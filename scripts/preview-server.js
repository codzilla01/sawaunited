#!/usr/bin/env node
/**
 * SAWA UNITED — local preview server
 * --------------------------------------------------------------------------
 * Mirrors the Hostinger/Apache behaviour closely enough to test the real
 * deployment output instead of a bare static file server:
 *
 *   • serves the repository root (or a --root target, e.g. a dist/ stage)
 *   • clean URLs: /super-admin → /super-admin/index.html (DirectoryIndex)
 *   • branded 404.html for unknown routes (ErrorDocument 404)
 *   • blocks development directories and secrets (.htaccess rules)
 *   • answers the security headers declared in .htaccess
 *   • executes api/*.php when a PHP CLI is available, otherwise reports the
 *     endpoint as unavailable so the app falls back to LocalStorage mode
 *
 * Usage:  node scripts/preview-server.js [--port 4173] [--root .] [--php <binary>]
 * Binds to 0.0.0.0 so the sandbox live preview can reach it.
 */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

/* ------------------------------------------------------------------ */
/* Arguments                                                           */
/* ------------------------------------------------------------------ */
const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf("--" + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}
const PORT = Number(arg("port", process.env.PORT || 4173));
const ROOT = path.resolve(arg("root", path.join(__dirname, "..")));
const PHP_FLAG = arg("php", process.env.PHP_BINARY || "");

/* ------------------------------------------------------------------ */
/* MIME                                                                */
/* ------------------------------------------------------------------ */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".zip": "application/zip",
  ".php": "text/html; charset=utf-8"
};

/* ------------------------------------------------------------------ */
/* PHP resolution                                                      */
/* ------------------------------------------------------------------ */
function resolvePhp() {
  const candidates = [];
  if (PHP_FLAG) candidates.push(PHP_FLAG);
  candidates.push(
    "php",
    path.join(__dirname, "..", "node_modules", ".bin", "php-cli"),
    "/usr/local/bin/php",
    "/usr/bin/php"
  );
  for (const candidate of candidates) {
    try {
      if (candidate.includes("/") && !fs.existsSync(candidate)) continue;
      const probe = require("child_process").spawnSync(candidate, ["-v"], { timeout: 4000 });
      if (!probe.error && probe.status === 0) {
        const line = String(probe.stdout || "").split("\n")[0];
        return { bin: candidate, version: line.trim() };
      }
    } catch (e) { /* keep probing */ }
  }
  return null;
}
const PHP = resolvePhp();

/* ------------------------------------------------------------------ */
/* Guard rails                                                         */
/* ------------------------------------------------------------------ */
const BLOCKED_DIRS = ["docs", "scripts", "backups", "dist", ".git", "node_modules"];
const BLOCKED_FILES = /^(config\.php|config\.sample\.php|\.env.*|composer\.(json|lock)|package(-lock)?\.json|.*\.(zip|sql|bak|swp|log))$/i;

function isBlocked(rel) {
  const first = rel.split("/")[0];
  if (BLOCKED_DIRS.includes(first)) return true;
  if (rel.startsWith("api/data/") && !rel.endsWith(".gitkeep")) return true;
  if (BLOCKED_FILES.test(path.basename(rel))) return true;
  return false;
}

/* ------------------------------------------------------------------ */
/* Headers (mirrors .htaccess)                                         */
/* ------------------------------------------------------------------ */
function securityHeaders(res, rel) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", rel.startsWith("super-admin") ? "DENY" : "SAMEORIGIN");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), " +
      "publickey-credentials-get=(self), publickey-credentials-create=(self)"
  );
  if (rel.startsWith("super-admin")) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    res.setHeader("Cache-Control", "no-store, max-age=0");
  } else if (/\.(css|js|woff2?|webp|png|jpe?g|svg|ico)$/i.test(rel)) {
    res.setHeader("Cache-Control", "public, max-age=3600");
  } else {
    res.setHeader("Cache-Control", "no-cache");
  }
}

/* ------------------------------------------------------------------ */
/* Responses                                                           */
/* ------------------------------------------------------------------ */
function sendFile(req, res, filePath, rel) {
  let stat;
  try { stat = fs.statSync(filePath); } catch (e) { return notFound(req, res); }
  if (!stat.isFile()) return notFound(req, res);

  securityHeaders(res, rel);
  res.statusCode = 200;
  res.setHeader("Content-Type", MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream");
  res.setHeader("Content-Length", stat.size);
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(filePath).pipe(res);
}

function notFound(req, res) {
  const page = path.join(ROOT, "404.html");
  securityHeaders(res, "404.html");
  res.statusCode = 404;
  if (fs.existsSync(page)) {
    const body = fs.readFileSync(page);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Length", body.length);
    return res.end(req.method === "HEAD" ? undefined : body);
  }
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("404 — Not found\n");
}

function forbidden(res, message) {
  securityHeaders(res, "forbidden");
  res.statusCode = 403;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("403 — Forbidden\n" + (message ? message + "\n" : ""));
}

/* ------------------------------------------------------------------ */
/* PHP execution                                                       */
/* ------------------------------------------------------------------ */
/* CLI PHP does not populate $_GET/$_SERVER the way mod_php does, so requests
   are routed through a tiny shim (written to the OS temp dir, never to the
   repo) that rebuilds the superglobals and then includes the real script. */
const SHIM = path.join(require("os").tmpdir(), "sawa-preview-php-shim.php");
const SHIM_SOURCE = `<?php
$_SERVER['REQUEST_METHOD'] = getenv('REQUEST_METHOD') ?: 'GET';
$_SERVER['QUERY_STRING']   = getenv('QUERY_STRING') ?: '';
$_SERVER['REQUEST_URI']    = getenv('REQUEST_URI') ?: '/';
$_SERVER['DOCUMENT_ROOT']  = getenv('DOCUMENT_ROOT') ?: '';
$_SERVER['SCRIPT_FILENAME']= getenv('SCRIPT_FILENAME') ?: '';
$_SERVER['SCRIPT_NAME']    = getenv('SCRIPT_NAME') ?: '/';
$_SERVER['PHP_SELF']       = $_SERVER['SCRIPT_NAME'];
$_SERVER['SERVER_NAME']    = getenv('SERVER_NAME') ?: 'localhost';
$_SERVER['SERVER_PORT']    = getenv('SERVER_PORT') ?: '80';
$_SERVER['SERVER_PROTOCOL']= 'HTTP/1.1';
$_SERVER['REMOTE_ADDR']    = getenv('REMOTE_ADDR') ?: '127.0.0.1';
$_SERVER['HTTP_HOST']      = getenv('HTTP_HOST') ?: 'localhost';
$_SERVER['HTTP_ORIGIN']    = getenv('HTTP_ORIGIN') ?: '';
$_SERVER['CONTENT_TYPE']   = getenv('CONTENT_TYPE') ?: '';
$_SERVER['CONTENT_LENGTH'] = getenv('CONTENT_LENGTH') ?: '';
$_SERVER['HTTP_X_FORWARDED_PROTO'] = 'https';
$_GET = array();
parse_str($_SERVER['QUERY_STRING'], $_GET);
$_REQUEST = $_GET;
unset($_GET['__sawa_target']);
require getenv('SAWA_PHP_TARGET');
`;
if (!fs.existsSync(SHIM)) {
  try { fs.writeFileSync(SHIM, SHIM_SOURCE, { mode: 0o600 }); } catch (e) { /* ignore */ }
}

function runPhp(req, res, filePath, url, rel) {
  if (!PHP) {
    securityHeaders(res, "api/ecosystem.php");
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({
      ok: false,
      code: "PHP_UNAVAILABLE",
      message: "Preview is running without PHP — the app continues in LocalStorage mode."
    }));
  }

  const query = url.search || "";
  const scriptPath = rel ? "/" + rel.replace(/\\/g, "/") : "/" + path.basename(filePath);
  const child = spawn(PHP.bin, [
    "-d", "display_errors=0",
    "-d", "log_errors=1",
    "-d", "error_reporting=E_ALL & ~E_DEPRECATED & ~E_NOTICE",
    "-d", "date.timezone=UTC",
    SHIM
  ], {
    cwd: path.dirname(filePath),
    env: Object.assign({}, process.env, {
      SAWA_PHP_TARGET: filePath,
      REQUEST_METHOD: req.method,
      REQUEST_URI: url.pathname + query,
      QUERY_STRING: url.search ? url.search.slice(1) : "",
      SCRIPT_FILENAME: filePath,
      SCRIPT_NAME: scriptPath,
      CONTENT_TYPE: req.headers["content-type"] || "",
      CONTENT_LENGTH: req.headers["content-length"] || "",
      HTTP_ORIGIN: req.headers.origin || "",
      HTTP_HOST: req.headers.host || "localhost",
      SERVER_NAME: "localhost",
      SERVER_PORT: String(PORT),
      REMOTE_ADDR: (req.socket && req.socket.remoteAddress) || "127.0.0.1",
      DOCUMENT_ROOT: ROOT,
      HTTPS: "off"
    })
  });

  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
  if (req.method !== "GET" && req.method !== "HEAD") req.pipe(child.stdin);
  else child.stdin.end();

  const chunks = [];
  child.stdout.on("data", (chunk) => chunks.push(chunk));
  child.on("error", (err) => {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, message: "PHP failed to start: " + err.message }));
  });
  child.on("close", (code) => {
    const out = Buffer.concat(chunks).toString("utf8");
    const headers = [];
    let body = out;
    // Surface any headers the script emitted itself (Content-Type, CORS…).
    if (/^[A-Za-z-]+:/m.test(out)) {
      const parts = out.split(/\r?\n\r?\n/);
      if (parts.length > 1) {
        headers.push(...parts.shift().split(/\r?\n/));
        body = parts.join("\r\n\r\n");
      }
    }
    securityHeaders(res, "api/ecosystem.php");
    headers.forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) res.setHeader(line.slice(0, idx).trim(), line.slice(idx + 1).trim());
    });
    if (res.getHeader("Cache-Control") === "no-cache") res.setHeader("Cache-Control", "no-store, max-age=0");
    res.statusCode = code === 0 ? 200 : 500;
    if (!res.getHeader("Content-Type")) res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(req.method === "HEAD" ? undefined : body);
    if (stderr.trim()) {
      console.error("[php]", stderr.trim().split("\n").slice(0, 4).join(" | "));
    }
  });
}

/* ------------------------------------------------------------------ */
/* Router (mirrors .htaccess rewrite rules)                            */
/* ------------------------------------------------------------------ */
const server = http.createServer((req, res) => {
  let url;
  try { url = new URL(req.url, "http://" + (req.headers.host || "localhost")); }
  catch (e) { return forbidden(res, "Malformed request URL"); }

  let rel = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (rel === "") rel = "index.html";

  // Browsers submit these for cross-origin preflight; answer without PHP.
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return res.end();
  }

  const full = path.join(ROOT, rel);
  // Directory traversal guard.
  if (!full.startsWith(ROOT)) return forbidden(res, "Path outside the document root");

  if (isBlocked(rel.replace(/\\/g, "/"))) return forbidden(res, "Blocked by .htaccess");

  if (fs.existsSync(full) && fs.statSync(full).isFile()) {
    if (rel.endsWith(".php")) return runPhp(req, res, full, url, rel);
    return sendFile(req, res, full, rel);
  }

  // DirectoryIndex: /super-admin → 301 → /super-admin/ → index.html
  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
    const index = path.join(full, "index.html");
    if (!fs.existsSync(index)) return forbidden(res, "Directory listing disabled");
    if (!url.pathname.endsWith("/")) {
      res.statusCode = 301;
      res.setHeader("Location", url.pathname + "/" + (url.search || ""));
      return res.end();
    }
    return sendFile(req, res, index, path.join(rel, "index.html"));
  }

  // Route without a trailing slash (e.g. /portfolio).
  const asDir = path.join(ROOT, rel, "index.html");
  if (fs.existsSync(asDir) && !rel.endsWith("/")) {
    res.statusCode = 301;
    res.setHeader("Location", "/" + rel + "/" + (url.search || ""));
    return res.end();
  }

  return notFound(req, res);
});

server.listen(PORT, "0.0.0.0", () => {
  const staged = path.relative(path.join(__dirname, ".."), ROOT) || ".";
  console.log("SAWA UNITED preview");
  console.log("  root      : " + ROOT + (staged === "." ? "" : "  (" + staged + ")"));
  console.log("  url       : http://localhost:" + PORT + "/");
  console.log("  console   : http://localhost:" + PORT + "/super-admin/");
  console.log("  php       : " + (PHP ? PHP.version + "  →  api/ecosystem.php (live persistence)" : "not found  →  LocalStorage mode"));
  console.log("  routing   : DirectoryIndex · 404.html · .htaccess guards · security headers");
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    console.log("\nPreview stopped.");
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();
  });
});
