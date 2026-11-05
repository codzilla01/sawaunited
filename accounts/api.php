<?php
/*
 * SAWA UNITED — server for the encrypted accounts book.
 * The browser encrypts every record before sending it, so this server only stores
 * locked data. It also checks who is signed in and what each person may read or write.
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const MAX_DOC = 400000;          // bytes per stored record
const SESSION_HOURS = 12;
const LOCK_FAILS = 5;            // wrong passwords before a short lock
const LOCK_MINUTES = 5;
const IP_LIMIT = 30;             // sign-in attempts per address per 15 minutes

function out(array $a): void { echo json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail(string $code, string $msg = '', int $http = 400): void { http_response_code($http); out(['ok' => false, 'error' => $code, 'msg' => $msg]); }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail('method', '', 405);
$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) fail('no_config', 'ملف config.php مش موجود. انسخ config.sample.php باسم config.php واكتب فيه بيانات قاعدة البيانات.', 500);
$cfg = require $cfgFile;
if (($cfg['driver'] ?? 'mysql') === 'mysql' && (str_contains((string)($cfg['db_pass'] ?? ''), 'اكتب') || str_contains((string)($cfg['db_name'] ?? ''), 'XXXX'))) fail('no_config', 'لسه ما كتبتش بيانات قاعدة البيانات في config.php.', 500);

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 40 * 1024 * 1024) fail('too_large', '', 413);
$in = json_decode($raw, true);
if (!is_array($in)) fail('bad_json');

$driver = $cfg['driver'] ?? 'mysql';
try {
  if ($driver === 'sqlite') {
    $db = new PDO('sqlite:' . $cfg['sqlite_path']);
  } else {
    $db = new PDO("mysql:host={$cfg['db_host']};dbname={$cfg['db_name']};charset=utf8mb4", $cfg['db_user'], $cfg['db_pass']);
  }
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (Throwable $e) {
  fail('db_connect', 'مش قادر يوصل لقاعدة البيانات. راجع البيانات في config.php.', 500);
}

function schema(PDO $db, string $driver): void {
  $eng = $driver === 'sqlite' ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
  $txt = $driver === 'sqlite' ? 'TEXT' : 'MEDIUMTEXT';
  $db->exec("CREATE TABLE IF NOT EXISTS sawa_docs (path VARCHAR(255) NOT NULL PRIMARY KEY, coll VARCHAR(200) NOT NULL, data $txt NULL, deleted INTEGER NOT NULL DEFAULT 0, rev BIGINT NOT NULL, updated_at BIGINT NOT NULL)$eng");
  $db->exec("CREATE TABLE IF NOT EXISTS sawa_counter (id INTEGER NOT NULL PRIMARY KEY, v BIGINT NOT NULL)$eng");
  $db->exec("CREATE TABLE IF NOT EXISTS sawa_users (pid VARCHAR(100) NOT NULL PRIMARY KEY, username VARCHAR(60) NOT NULL UNIQUE, auth VARCHAR(255) NULL, level VARCHAR(10) NOT NULL, active INTEGER NOT NULL DEFAULT 1, fails INTEGER NOT NULL DEFAULT 0, locked_until BIGINT NOT NULL DEFAULT 0, created_at BIGINT NOT NULL)$eng");
  $db->exec("CREATE TABLE IF NOT EXISTS sawa_sessions (token CHAR(64) NOT NULL PRIMARY KEY, pid VARCHAR(100) NOT NULL, level VARCHAR(10) NOT NULL, expires BIGINT NOT NULL)$eng");
  $db->exec("CREATE TABLE IF NOT EXISTS sawa_attempts (ip VARCHAR(64) NOT NULL, at BIGINT NOT NULL)$eng");
  try { $db->exec('CREATE INDEX sawa_docs_rev ON sawa_docs (rev)'); } catch (Throwable $e) {}
  try { $db->exec('CREATE INDEX sawa_attempts_ip ON sawa_attempts (ip, at)'); } catch (Throwable $e) {}
  if (!$db->query('SELECT COUNT(*) FROM sawa_counter')->fetchColumn()) $db->exec('INSERT INTO sawa_counter (id, v) VALUES (1, 0)');
}

function validPath(string $p): ?array {
  return preg_match('~^([A-Za-z0-9_\-.:@+]{1,120})/([A-Za-z0-9_\-.:@+]{1,120})$~', $p, $m) ? [$m[1], $m[2]] : null;
}
function validUser(string $u): bool { return (bool)preg_match('~^[a-z0-9._-]{3,30}$~', $u); }
function validAuth($a): bool { return is_string($a) && (bool)preg_match('~^[0-9a-f]{64}$~', $a); }
function now(): int { return time(); }
function ip(): string { return substr((string)($_SERVER['REMOTE_ADDR'] ?? '0'), 0, 64); }

function newSession(PDO $db, string $pid, string $level): string {
  $tok = bin2hex(random_bytes(32));
  $db->prepare('INSERT INTO sawa_sessions (token, pid, level, expires) VALUES (?,?,?,?)')->execute([hash('sha256', $tok), $pid, $level, now() + SESSION_HOURS * 3600]);
  return $tok;
}
function session(PDO $db): array {
  $tok = (string)($_SERVER['HTTP_X_SESSION'] ?? '');
  if (!preg_match('~^[0-9a-f]{64}$~', $tok)) fail('auth', 'سجّل دخول تاني', 401);
  $h = hash('sha256', $tok);
  $st = $db->prepare('SELECT s.pid, s.level, s.expires, u.active, u.level AS ulevel FROM sawa_sessions s JOIN sawa_users u ON u.pid = s.pid WHERE s.token = ?');
  $st->execute([$h]);
  $s = $st->fetch();
  if (!$s || (int)$s['expires'] < now() || !(int)$s['active'] || $s['ulevel'] !== $s['level']) {
    $db->prepare('DELETE FROM sawa_sessions WHERE token = ?')->execute([$h]);
    fail('auth', 'الجلسة انتهت، سجّل دخول تاني', 401);
  }
  $db->prepare('UPDATE sawa_sessions SET expires = ? WHERE token = ?')->execute([now() + SESSION_HOURS * 3600, $h]);
  return ['pid' => $s['pid'], 'level' => $s['level'], 'token' => $h];
}
function canRead(array $s, string $path): bool {
  if ($s['level'] === 'mgr') return true;
  return $path === 'people/' . $s['pid'] || str_starts_with($path, 'bx_' . $s['pid'] . '/');
}
function canWrite(array $s, string $coll, string $op): bool {
  if ($s['level'] === 'mgr') return in_array($coll, ['people','tx','adj','att','eval','prof','img','config','meta'], true) || str_starts_with($coll, 'bx_');
  return $coll === 'bx_' . $s['pid'] && ($op === 'set' || $op === 'delete');
}
function nextRev(PDO $db): int {
  $db->exec('UPDATE sawa_counter SET v = v + 1 WHERE id = 1');
  return (int)$db->query('SELECT v FROM sawa_counter WHERE id = 1')->fetchColumn();
}
function putDoc(PDO $db, string $path, string $coll, ?array $data): int {
  $rev = nextRev($db);
  $json = $data === null ? null : json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($json !== null && strlen($json) > MAX_DOC) throw new RuntimeException('too_big');
  $del = $data === null ? 1 : 0;
  $u = $db->prepare('UPDATE sawa_docs SET data = ?, deleted = ?, rev = ?, updated_at = ? WHERE path = ?');
  $u->execute([$json, $del, $rev, now(), $path]);
  if ($u->rowCount() === 0) $db->prepare('INSERT INTO sawa_docs (path, coll, data, deleted, rev, updated_at) VALUES (?,?,?,?,?,?)')->execute([$path, $coll, $json, $del, $rev, now()]);
  return $rev;
}
function getDoc(PDO $db, string $path): ?array {
  $st = $db->prepare('SELECT data FROM sawa_docs WHERE path = ? AND deleted = 0');
  $st->execute([$path]);
  $r = $st->fetchColumn();
  return $r === false || $r === null ? null : json_decode($r, true);
}
function usersCount(PDO $db): int { return (int)$db->query('SELECT COUNT(*) FROM sawa_users')->fetchColumn(); }

$a = (string)($in['a'] ?? '');
try {
  switch ($a) {
    case 'status':
      schema($db, $driver);
      out(['ok' => true, 'empty' => usersCount($db) === 0]);

    case 'setup': {
      schema($db, $driver);
      $pid = (string)($in['pid'] ?? ''); $user = (string)($in['user'] ?? ''); $auth = $in['auth'] ?? '';
      if (!preg_match('~^[A-Za-z0-9_\-.:@+]{1,100}$~', $pid) || !validUser($user) || !validAuth($auth)) fail('bad_input');
      $db->beginTransaction();
      if (usersCount($db) > 0) { $db->rollBack(); fail('exists', 'النظام متجهّز بالفعل', 409); }
      $db->prepare('INSERT INTO sawa_users (pid, username, auth, level, active, created_at) VALUES (?,?,?,?,1,?)')->execute([$pid, $user, password_hash($auth, PASSWORD_DEFAULT), 'mgr', now()]);
      $tok = newSession($db, $pid, 'mgr');
      $db->commit();
      out(['ok' => true, 'token' => $tok, 'pid' => $pid, 'level' => 'mgr']);
    }

    case 'login': {
      $ip = ip(); $t = now();
      $db->prepare('DELETE FROM sawa_attempts WHERE at < ?')->execute([$t - 900]);
      $db->prepare('DELETE FROM sawa_sessions WHERE expires < ?')->execute([$t]);
      $c = $db->prepare('SELECT COUNT(*) FROM sawa_attempts WHERE ip = ?'); $c->execute([$ip]);
      if ((int)$c->fetchColumn() >= IP_LIMIT) fail('rate', 'محاولات كتير. استنى ربع ساعة وجرّب تاني.', 429);
      $db->prepare('INSERT INTO sawa_attempts (ip, at) VALUES (?,?)')->execute([$ip, $t]);
      $user = strtolower(trim((string)($in['user'] ?? ''))); $auth = $in['auth'] ?? '';
      $st = $db->prepare('SELECT * FROM sawa_users WHERE username = ?'); $st->execute([$user]);
      $u = $st->fetch();
      if ($u && (int)$u['locked_until'] > $t) fail('locked', 'الحساب اتقفل مؤقتًا بعد محاولات غلط. جرّب بعد ' . ceil(((int)$u['locked_until'] - $t) / 60) . ' دقيقة.', 429);
      $okPw = $u && $u['auth'] && validAuth($auth) && password_verify($auth, $u['auth']);
      if (!$u) password_verify('x', password_hash('timing-guard', PASSWORD_DEFAULT));
      if (!$okPw || !(int)$u['active']) {
        if ($u) {
          $f = (int)$u['fails'] + 1;
          $db->prepare('UPDATE sawa_users SET fails = ?, locked_until = ? WHERE pid = ?')->execute([$f >= LOCK_FAILS ? 0 : $f, $f >= LOCK_FAILS ? $t + LOCK_MINUTES * 60 : 0, $u['pid']]);
        }
        fail('login', 'اسم المستخدم أو كلمة السر غلط.', 401);
      }
      $db->prepare('UPDATE sawa_users SET fails = 0, locked_until = 0 WHERE pid = ?')->execute([$u['pid']]);
      if (password_needs_rehash($u['auth'], PASSWORD_DEFAULT)) $db->prepare('UPDATE sawa_users SET auth = ? WHERE pid = ?')->execute([password_hash($auth, PASSWORD_DEFAULT), $u['pid']]);
      out(['ok' => true, 'token' => newSession($db, $u['pid'], $u['level']), 'pid' => $u['pid'], 'level' => $u['level']]);
    }

    case 'logout': {
      $tok = (string)($_SERVER['HTTP_X_SESSION'] ?? '');
      if ($tok !== '') $db->prepare('DELETE FROM sawa_sessions WHERE token = ?')->execute([hash('sha256', $tok)]);
      out(['ok' => true]);
    }

    case 'changes': {
      $s = session($db); $since = max(0, (int)($in['since'] ?? 0));
      $top = (int)$db->query('SELECT v FROM sawa_counter WHERE id = 1')->fetchColumn();
      if ($s['level'] === 'mgr') {
        $st = $db->prepare('SELECT path, data, deleted, rev FROM sawa_docs WHERE rev > ? AND rev <= ? ORDER BY rev LIMIT 300');
        $st->execute([$since, $top]);
      } else {
        $pre = 'bx_' . $s['pid'] . '/';
        $st = $db->prepare('SELECT path, data, deleted, rev FROM sawa_docs WHERE rev > ? AND rev <= ? AND (path = ? OR SUBSTR(path, 1, ?) = ?) ORDER BY rev LIMIT 300');
        $st->execute([$since, $top, 'people/' . $s['pid'], strlen($pre), $pre]);
      }
      $rows = $st->fetchAll(); $docs = [];
      foreach ($rows as $r) {
        if (!canRead($s, $r['path'])) continue;
        $docs[] = (int)$r['deleted'] ? ['path' => $r['path'], 'del' => 1] : ['path' => $r['path'], 'data' => json_decode($r['data'], true)];
      }
      $more = count($rows) >= 300;
      $last = $more ? (int)$rows[count($rows) - 1]['rev'] : max($since, $top);
      out(['ok' => true, 'docs' => $docs, 'rev' => $last, 'more' => $more, 'me' => $s['pid'], 'level' => $s['level']]);
    }

    case 'write': {
      $s = session($db);
      $op = (string)($in['op'] ?? ''); $path = (string)($in['path'] ?? ''); $p = validPath($path);
      if (!$p || !in_array($op, ['set', 'update', 'delete'], true)) fail('bad_input');
      if (!canWrite($s, $p[0], $op)) fail('forbidden', 'مش مسموحلك تعدّل هنا', 403);
      $data = $in['data'] ?? null;
      if ($op !== 'delete' && !is_array($data)) fail('bad_input');
      $db->beginTransaction();
      if ($op === 'update') { $cur = getDoc($db, $path); if ($cur === null) { $db->rollBack(); fail('not_found'); } $data = array_merge($cur, $data); }
      $rev = putDoc($db, $path, $p[0], $op === 'delete' ? null : $data);
      $db->commit();
      out(['ok' => true, 'rev' => $rev]);
    }

    case 'bulk': {
      $s = session($db);
      if ($s['level'] !== 'mgr') fail('forbidden', '', 403);
      $docs = $in['docs'] ?? null; if (!is_array($docs) || count($docs) > 200) fail('bad_input');
      $db->beginTransaction();
      foreach ($docs as $d) {
        $p = validPath((string)($d['path'] ?? ''));
        if (!$p || !is_array($d['data'] ?? null) || !canWrite($s, $p[0], 'set')) { $db->rollBack(); fail('bad_input', 'سجل غير صالح: ' . ($d['path'] ?? '')); }
        putDoc($db, $d['path'], $p[0], $d['data']);
      }
      $db->commit();
      out(['ok' => true, 'n' => count($docs)]);
    }

    case 'users': {
      $s = session($db); if ($s['level'] !== 'mgr') fail('forbidden', '', 403);
      $rows = $db->query('SELECT pid, username, level, active, CASE WHEN auth IS NULL THEN 0 ELSE 1 END AS has_auth FROM sawa_users')->fetchAll();
      out(['ok' => true, 'users' => $rows]);
    }

    case 'user_set': {
      $s = session($db); if ($s['level'] !== 'mgr') fail('forbidden', '', 403);
      $pid = (string)($in['pid'] ?? ''); $user = strtolower(trim((string)($in['user'] ?? '')));
      $level = (string)($in['level'] ?? 'staff'); $active = !empty($in['active']) ? 1 : 0; $auth = $in['auth'] ?? null;
      if (!preg_match('~^[A-Za-z0-9_\-.:@+]{1,100}$~', $pid) || !in_array($level, ['mgr', 'staff', 'none'], true)) fail('bad_input');
      if ($level === 'none') $active = 0;
      if ($pid === $s['pid'] && ($level !== 'mgr' || !$active)) fail('self', 'مينفعش تشيل صلاحياتك أو تقفل حسابك', 400);
      if ($auth !== null && !validAuth($auth)) fail('bad_input');
      $st = $db->prepare('SELECT * FROM sawa_users WHERE pid = ?'); $st->execute([$pid]); $u = $st->fetch();
      if ($level === 'none' && !$u) out(['ok' => true]);
      if (!validUser($user)) fail('bad_user', 'اسم المستخدم من 3 لـ 30 حرف إنجليزي أو رقم');
      $dup = $db->prepare('SELECT COUNT(*) FROM sawa_users WHERE username = ? AND pid <> ?'); $dup->execute([$user, $pid]);
      if ((int)$dup->fetchColumn()) fail('dup_user', 'اسم المستخدم ده مستخدم لحد تاني', 409);
      $db->beginTransaction();
      $lv = $level === 'none' ? 'staff' : $level;
      if ($u) {
        $db->prepare('UPDATE sawa_users SET username = ?, level = ?, active = ?' . ($auth ? ', auth = ?, fails = 0, locked_until = 0' : '') . ' WHERE pid = ?')
           ->execute($auth ? [$user, $lv, $active, password_hash($auth, PASSWORD_DEFAULT), $pid] : [$user, $lv, $active, $pid]);
        if ($auth || !$active || $u['level'] !== $lv) $db->prepare('DELETE FROM sawa_sessions WHERE pid = ?')->execute([$pid]);
      } else {
        $db->prepare('INSERT INTO sawa_users (pid, username, auth, level, active, created_at) VALUES (?,?,?,?,?,?)')
           ->execute([$pid, $user, $auth ? password_hash($auth, PASSWORD_DEFAULT) : null, $lv, $active, now()]);
      }
      $db->commit();
      out(['ok' => true]);
    }

    case 'passwd': {
      $s = session($db);
      $old = $in['old'] ?? ''; $new = $in['new'] ?? ''; $wrap = $in['wrap'] ?? null;
      if (!validAuth($old) || !validAuth($new) || !is_array($wrap)) fail('bad_input');
      $st = $db->prepare('SELECT auth FROM sawa_users WHERE pid = ?'); $st->execute([$s['pid']]); $h = $st->fetchColumn();
      if (!$h || !password_verify($old, $h)) fail('wrong_old', 'كلمة السر الحالية غلط.', 401);
      $field = $s['level'] === 'mgr' ? 'wK' : 'wS';
      $db->beginTransaction();
      $cur = getDoc($db, 'people/' . $s['pid']);
      if ($cur === null) { $db->rollBack(); fail('not_found'); }
      $cur[$field] = $wrap;
      putDoc($db, 'people/' . $s['pid'], 'people', $cur);
      $db->prepare('UPDATE sawa_users SET auth = ? WHERE pid = ?')->execute([password_hash($new, PASSWORD_DEFAULT), $s['pid']]);
      $db->prepare('DELETE FROM sawa_sessions WHERE pid = ? AND token <> ?')->execute([$s['pid'], $s['token']]);
      $db->commit();
      out(['ok' => true]);
    }

    default:
      fail('unknown_action');
  }
} catch (Throwable $e) {
  if ($db->inTransaction()) $db->rollBack();
  if ($e->getMessage() === 'too_big') fail('too_big', 'السجل ده كبير قوي', 413);
  error_log('sawa api: ' . $e->getMessage());
  fail('server', 'حصلت مشكلة في السيرفر، جرّب تاني.', 500);
}
