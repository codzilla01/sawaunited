<?php
/**
 * SAWA UNITED GROUP — Ecosystem API
 * --------------------------------------------------------------------------
 * Hostinger-compatible, dependency-free JSON persistence for the public site
 * and the /super-admin command centre.
 *
 *   GET  api/ecosystem.php?action=load        → current dataset
 *   GET  api/ecosystem.php?action=ping        → health probe
 *   POST {action:"login", email, password}    → developer session token
 *   POST {action:"save", token, data}         → replace dataset (auth required)
 *   POST {action:"lead", lead}                → public lead capture
 *   POST {action:"booking", booking}          → public rental booking
 *   POST {action:"application", application}  → public wholesale application
 *
 * Data lives in api/data/ecosystem.json with rolling backups in api/data/backups/.
 * Copy api/config.sample.php to api/config.php to override the developer
 * credentials, the signing secret or the CORS allow-list on the server.
 */

declare(strict_types=1);

const API_VERSION   = '1.1.0';
const MAX_BODY      = 4194304;          // 4 MB request ceiling
const MAX_BACKUPS   = 20;               // rolling snapshots kept on disk
const TOKEN_TTL     = 28800;            // 8 hours
const RATE_WINDOW   = 60;               // seconds
const RATE_MAX      = 30;               // writes allowed per window / IP

const DEFAULT_EMAIL    = 'developer@sawaunited.net';
const DEFAULT_HASH     = '3c4c30e941f00f50d4230e69a8d4a610766cb1d7cfb9be4970af2c2461b52d68';
const DEFAULT_SALT     = 'sawa-2026-dev-salt-9f3a';
const DEFAULT_ROLE     = 'SUPER_DEVELOPER_ADMIN';

/* ------------------------------------------------------------------ */
/* Bootstrap                                                           */
/* ------------------------------------------------------------------ */
$CONFIG = array(
    'email'      => DEFAULT_EMAIL,
    'pass_hash'  => DEFAULT_HASH,
    'salt'       => DEFAULT_SALT,
    'role'       => DEFAULT_ROLE,
    'secret'     => '',
    'allow_origin' => '',
);

$configFile = __DIR__ . '/config.php';
if (is_file($configFile)) {
    $loaded = include $configFile;
    if (is_array($loaded)) {
        $CONFIG = array_merge($CONFIG, $loaded);
    }
}

$DATA_DIR  = __DIR__ . '/data';
$DATA_FILE = $DATA_DIR . '/ecosystem.json';
$BACKUP_DIR = $DATA_DIR . '/backups';
$RATE_FILE = $DATA_DIR . '/rate-limits.json';
$AUDIT_FILE = $DATA_DIR . '/audit.log';
/* Small JSON files holding the most recent public submissions, so nothing is
   lost before the first console save writes the full dataset. */
$INBOX_DIR = $DATA_DIR . '/inbox';

if ($CONFIG['secret'] === '') {
    // Stable per-install secret derived from the document root + salt so tokens
    // survive requests without a hard-coded secret in the repository.
    $CONFIG['secret'] = hash('sha256', 'sawa-eco|' . DEFAULT_SALT . '|' . (isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : 'local'));
}

foreach (array($DATA_DIR, $BACKUP_DIR, $INBOX_DIR) as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, max-age=0');
header('Referrer-Policy: strict-origin-when-cross-origin');

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin !== '') {
    $allowed = trim((string) $CONFIG['allow_origin']);
    $sameHost = false;
    if (isset($_SERVER['HTTP_HOST'])) {
        $sameHost = (strpos($origin, '//' . $_SERVER['HTTP_HOST']) !== false);
    }
    if ($sameHost || ($allowed !== '' && in_array($origin, array_map('trim', explode(',', $allowed)), true))) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Headers: Content-Type, Accept');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ------------------------------------------------------------------ */
/* Response helpers                                                    */
/* ------------------------------------------------------------------ */
function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400, string $code = 'ERROR'): void
{
    respond(array('ok' => false, 'code' => $code, 'message' => $message), $status);
}

function body_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return array();
    }
    if (strlen($raw) > MAX_BODY) {
        fail('Payload too large', 413, 'TOO_LARGE');
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        fail('Malformed JSON body', 400, 'BAD_JSON');
    }
    return $decoded;
}

function client_ip(): string
{
    foreach (array('HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR') as $key) {
        if (!empty($_SERVER[$key])) {
            $value = explode(',', (string) $_SERVER[$key])[0];
            return trim($value);
        }
    }
    return '0.0.0.0';
}

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */
function read_dataset(string $file): ?array
{
    if (!is_file($file)) {
        return null;
    }
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') {
        return null;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : null;
}

function write_dataset(string $file, string $backupDir, array $data, string $auditFile, string $actor, string $action): bool
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) {
        return false;
    }

    if (is_file($file)) {
        @copy($file, $backupDir . '/ecosystem-' . gmdate('Ymd-His') . '.json');
        $backups = glob($backupDir . '/ecosystem-*.json');
        if (is_array($backups) && count($backups) > MAX_BACKUPS) {
            sort($backups);
            $drop = array_slice($backups, 0, count($backups) - MAX_BACKUPS);
            foreach ($drop as $old) {
                @unlink($old);
            }
        }
    }

    $tmp = $file . '.tmp';
    if (@file_put_contents($tmp, $json, LOCK_EX) === false) {
        return false;
    }
    if (!@rename($tmp, $file)) {
        @unlink($tmp);
        return false;
    }
    @chmod($file, 0644);

    @file_put_contents(
        $auditFile,
        json_encode(array(
            'at'     => gmdate('c'),
            'actor'  => $actor,
            'action' => $action,
            'ip'     => client_ip(),
            'rev'    => isset($data['rev']) ? $data['rev'] : null,
        ), JSON_UNESCAPED_UNICODE) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    return true;
}

/* Append a public submission to a bounded JSON inbox (newest first). */
function append_inbox(string $file, array $entry): void
{
    $list = read_inbox($file, 200);
    array_unshift($list, $entry);
    $list = array_slice($list, 0, 200);
    @file_put_contents($file, json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    @chmod($file, 0644);
}

function read_inbox(string $file, int $limit): array
{
    if (!is_file($file)) {
        return array();
    }
    $raw = @file_get_contents($file);
    $decoded = $raw === false ? null : json_decode($raw, true);
    if (!is_array($decoded)) {
        return array();
    }
    return array_slice($decoded, 0, $limit);
}

/* ------------------------------------------------------------------ */
/* Tokens (HMAC, stateless)                                            */
/* ------------------------------------------------------------------ */
function b64url(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function b64url_decode(string $value): string
{
    $pad = strlen($value) % 4;
    if ($pad) {
        $value .= str_repeat('=', 4 - $pad);
    }
    $decoded = base64_decode(strtr($value, '-_', '+/'), true);
    return $decoded === false ? '' : $decoded;
}

function issue_token(array $config): string
{
    $payload = array(
        'sub'  => $config['email'],
        'role' => $config['role'],
        'iat'  => time(),
        'exp'  => time() + TOKEN_TTL,
        'jti'  => bin2hex(random_bytes(8)),
    );
    $body = b64url(json_encode($payload));
    $sig = b64url(hash_hmac('sha256', $body, $config['secret'], true));
    return $body . '.' . $sig;
}

function verify_token(string $token, array $config): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return null;
    }
    $expected = b64url(hash_hmac('sha256', $parts[0], $config['secret'], true));
    if (!hash_equals($expected, $parts[1])) {
        return null;
    }
    $payload = json_decode(b64url_decode($parts[0]), true);
    if (!is_array($payload) || !isset($payload['exp']) || (int) $payload['exp'] < time()) {
        return null;
    }
    if (!isset($payload['role']) || $payload['role'] !== $config['role']) {
        return null;
    }
    return $payload;
}

/* ------------------------------------------------------------------ */
/* Rate limiting (file based, per IP)                                   */
/* ------------------------------------------------------------------ */
function rate_limit(string $file, int $max, int $window): bool
{
    $now = time();
    $bucket = array();
    $raw = @file_get_contents($file);
    if ($raw !== false && $raw !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $bucket = $decoded;
        }
    }
    foreach ($bucket as $ip => $hits) {
        $bucket[$ip] = array_values(array_filter($hits, function ($ts) use ($now, $window) {
            return ($now - (int) $ts) < $window;
        }));
        if (count($bucket[$ip]) === 0) {
            unset($bucket[$ip]);
        }
    }
    $ip = client_ip();
    $current = isset($bucket[$ip]) ? $bucket[$ip] : array();
    if (count($current) >= $max) {
        @file_put_contents($file, json_encode($bucket), LOCK_EX);
        return false;
    }
    $current[] = $now;
    $bucket[$ip] = $current;
    @file_put_contents($file, json_encode($bucket), LOCK_EX);
    return true;
}

/* ------------------------------------------------------------------ */
/* Routing                                                             */
/* ------------------------------------------------------------------ */
$method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper($_SERVER['REQUEST_METHOD']) : 'GET';
$action = isset($_GET['action']) ? strtolower((string) $_GET['action']) : '';
$body = array();

if ($method === 'POST') {
    $body = body_json();
    if (isset($body['action'])) {
        $action = strtolower((string) $body['action']);
    }
}

switch ($action) {
    case 'ping':
        respond(array(
            'ok'      => true,
            'service' => 'sawa-ecosystem',
            'version' => API_VERSION,
            'php'     => PHP_VERSION,
            'writable'=> is_writable($DATA_DIR),
            'dataset' => is_file($DATA_FILE),
            'time'    => gmdate('c'),
        ));
        break;

    case 'load':
        $data = read_dataset($DATA_FILE);
        if ($data === null) {
            /* No dataset committed yet: hand back any captured submissions so
               the console can display real leads before its first save. */
            $pulled = array('ok' => true, 'source' => 'empty', 'data' => null, 'inbox' => array());
            foreach (array('leads' => 'leads', 'bookings' => 'bookings', 'applications' => 'applications') as $inbox => $key) {
                $pulled['inbox'][$inbox] = read_inbox($INBOX_DIR . '/' . $inbox . '.json', 50);
            }
            respond($pulled);
        }
        respond(array('ok' => true, 'source' => 'php', 'data' => $data));
        break;

    case 'login':
        if ($method !== 'POST') {
            fail('Use POST for login', 405, 'METHOD');
        }
        if (!rate_limit($RATE_FILE, 12, RATE_WINDOW)) {
            fail('Too many attempts. Try again in a minute.', 429, 'RATE_LIMIT');
        }
        $email = isset($body['email']) ? strtolower(trim((string) $body['email'])) : '';
        $password = isset($body['password']) ? (string) $body['password'] : '';
        $hash = hash('sha256', $email . ':' . $password . ':' . $CONFIG['salt']);

        if ($email === strtolower((string) $CONFIG['email']) && hash_equals((string) $CONFIG['pass_hash'], $hash)) {
            $token = issue_token($CONFIG);
            @file_put_contents(
                $AUDIT_FILE,
                json_encode(array('at' => gmdate('c'), 'actor' => $email, 'action' => 'LOGIN_SUCCESS', 'ip' => client_ip()), JSON_UNESCAPED_UNICODE) . PHP_EOL,
                FILE_APPEND | LOCK_EX
            );
            respond(array(
                'ok'    => true,
                'token' => $token,
                'role'  => $CONFIG['role'],
                'exp'   => time() + TOKEN_TTL,
                'email' => $email,
            ));
        }

        @file_put_contents(
            $AUDIT_FILE,
            json_encode(array('at' => gmdate('c'), 'actor' => $email, 'action' => 'LOGIN_FAILED', 'ip' => client_ip()), JSON_UNESCAPED_UNICODE) . PHP_EOL,
            FILE_APPEND | LOCK_EX
        );
        fail('Invalid developer credentials', 401, 'BAD_CREDENTIALS');
        break;

    case 'save':
        if ($method !== 'POST') {
            fail('Use POST for save', 405, 'METHOD');
        }
        $token = isset($body['token']) ? (string) $body['token'] : '';
        // Local-preview sessions are prefixed with "local." and cannot write to
        // the server; only real HMAC tokens are accepted here.
        $session = verify_token($token, $CONFIG);
        if ($session === null) {
            fail('Session expired or invalid — sign in again', 401, 'UNAUTHORIZED');
        }
        if (!rate_limit($RATE_FILE, RATE_MAX, RATE_WINDOW)) {
            fail('Save throttled, retry shortly', 429, 'RATE_LIMIT');
        }
        $data = isset($body['data']) && is_array($body['data']) ? $body['data'] : null;
        if ($data === null) {
            fail('Missing dataset', 422, 'NO_DATA');
        }
        if (!isset($data['rev'])) {
            $existing = read_dataset($DATA_FILE);
            $data['rev'] = isset($existing['rev']) ? ((int) $existing['rev'] + 1) : 1;
        }
        $data['serverUpdatedAt'] = gmdate('c');
        if (!write_dataset($DATA_FILE, $BACKUP_DIR, $data, $AUDIT_FILE, (string) $session['sub'], 'DATASET_SAVE')) {
            fail('Server could not persist the dataset (check api/data permissions)', 500, 'WRITE_FAILED');
        }
        respond(array('ok' => true, 'rev' => $data['rev'], 'savedAt' => $data['serverUpdatedAt']));
        break;

    case 'lead':
    case 'booking':
    case 'application':
        if ($method !== 'POST') {
            fail('Use POST', 405, 'METHOD');
        }
        if (!rate_limit($RATE_FILE, RATE_MAX, RATE_WINDOW)) {
            fail('Too many submissions, retry shortly', 429, 'RATE_LIMIT');
        }
        $key = $action === 'lead' ? 'lead' : ($action === 'booking' ? 'booking' : 'application');
        $entry = isset($body[$key]) && is_array($body[$key]) ? $body[$key] : array();
        if (empty($entry)) {
            fail('Empty submission', 422, 'NO_DATA');
        }
        // Keep an append-only inbox so nothing is lost if the main dataset is
        // later replaced from the console.
        $entry['receivedAt'] = gmdate('c');
        $entry['ip'] = client_ip();
        append_inbox($INBOX_DIR . '/' . $key . 's.json', $entry);

        $dataset = read_dataset($DATA_FILE);
        if (is_array($dataset)) {
            $listKey = $key === 'lead' ? 'leads' : ($key === 'booking' ? 'bookings' : 'applications');
            if (!isset($dataset[$listKey]) || !is_array($dataset[$listKey])) {
                $dataset[$listKey] = array();
            }
            array_unshift($dataset[$listKey], $entry);
            $dataset[$listKey] = array_slice($dataset[$listKey], 0, 300);
            $dataset['rev'] = isset($dataset['rev']) ? ((int) $dataset['rev'] + 1) : 1;
            write_dataset($DATA_FILE, $BACKUP_DIR, $dataset, $AUDIT_FILE, 'public', strtoupper($key) . '_CAPTURE');
        }
        respond(array('ok' => true, 'id' => isset($entry['id']) ? $entry['id'] : null));
        break;

    default:
        fail('Unknown action. Use load, ping, login, save, lead, booking or application.', 404, 'UNKNOWN_ACTION');
}
