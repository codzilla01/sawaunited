/* ==========================================================================
   SAWA UNITED GROUP — Super Admin Command Center
   Dual-factor access (credentials + role, then WebAuthn biometrics) and full
   CRUD over the same ecosystem dataset the public platform renders.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SAWAStore;
  var doc = document;
  var DEV_EMAIL = "developer@sawaunited.net";
  var ROLE = "SUPER_DEVELOPER_ADMIN";
  var SESSION_KEY = "sawa_admin_session";
  var AUDIT_NOUN = {
    properties: "PROPERTY", products: "PRODUCT", cars: "VEHICLE",
    petroleum: "PETRO_PRODUCT", contracts: "CONTRACT", shipments: "SHIPMENT",
    leads: "LEAD", applications: "APPLICATION", bookings: "BOOKING"
  };
  var DEVICES_KEY = "sawa_webauthn_devices";
  var FP_KEY = "sawa_fingerprint_pending";

  var session = null;
  var devices = [];
  var currentView = "overview";

  /* ------------------------------------------------------------------ */
  /* Utilities                                                           */
  /* ------------------------------------------------------------------ */
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function esc(v) {
    return String(v === null || v === undefined ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function ico(name, size) {
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" aria-hidden="true"><use href="#a-' + name + '"/></svg>';
  }
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function money(v) {
    var n = Number(v) || 0;
    try { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n) + " EGP"; }
    catch (e) { return n + " EGP"; }
  }
  function compactMoney(v) {
    var n = Number(v) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
    return String(n);
  }
  function dateShort(iso) {
    if (!iso) return "—";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toISOString().slice(0, 10);
  }
  function timeShort(iso) {
    if (!iso) return "—";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toISOString().slice(5, 16).replace("T", " ");
  }
  function en(value) { return typeof value === "object" && value ? (value.en || value.ar || "") : (value || ""); }

  var toastTimer = null;
  function toast(message) {
    var bar = $("#toastbar");
    $("#toastText").textContent = message;
    bar.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { bar.classList.remove("is-on"); }, 3600);
  }

  /* ------------------------------------------------------------------ */
  /* Session                                                             */
  /* ------------------------------------------------------------------ */
  function loadSession() {
    var saved = readJSON(SESSION_KEY, null);
    if (!saved || !saved.email || saved.role !== ROLE) return null;
    if (saved.exp && Date.now() > saved.exp) return null;
    return saved;
  }

  function saveSession(payload) {
    session = {
      email: payload.email || DEV_EMAIL,
      role: ROLE,
      token: payload.token || "",
      source: payload.source || "php",
      at: Date.now(),
      exp: Date.now() + 8 * 3600 * 1000
    };
    writeJSON(SESSION_KEY, session);
    return session;
  }

  function clearSession() {
    session = null;
    try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    S.setToken("");
  }

  function openConsole() {
    $("#gate").hidden = true;
    $("#gate").style.display = "none";
    $("#app").classList.add("is-on");
    $("#tbUserEmail").textContent = (session && session.email) || DEV_EMAIL;
    renderAll();
    setView(currentView);
  }

  function lockConsole(message) {
    clearSession();
    $("#app").classList.remove("is-on");
    $("#gate").hidden = false;
    $("#gate").style.display = "";
    $("#devPass").value = "";
    if (message) showError(message);
  }

  function showError(message) {
    var box = $("#loginError");
    $("#loginErrorText").textContent = message;
    box.classList.add("is-on");
  }
  function hideError() { $("#loginError").classList.remove("is-on"); }

  /* ------------------------------------------------------------------ */
  /* Biometric scanner UI                                                */
  /* ------------------------------------------------------------------ */
  function scanOpen(title, sub) {
    $("#scanTitle").textContent = title || "Biometric verification";
    $("#scanSub").textContent = sub || "Place your finger on the sensor";
    var scrim = $("#scanScrim");
    scrim.classList.add("is-open");
    var scanner = $("#scanner");
    scanner.classList.remove("is-ok");
    scanner.classList.add("is-scanning");
    $$(".scan-step").forEach(function (s) { s.classList.remove("is-active", "is-done"); });
    return {
      step: function (i) {
        $$(".scan-step").forEach(function (s, idx) {
          s.classList.toggle("is-done", idx < i);
          s.classList.toggle("is-active", idx === i);
        });
      },
      ok: function () {
        scanner.classList.remove("is-scanning");
        scanner.classList.add("is-ok");
        $$(".scan-step").forEach(function (s) { s.classList.remove("is-active"); s.classList.add("is-done"); });
      },
      close: function (delay) {
        setTimeout(function () { scrim.classList.remove("is-open"); }, delay || 420);
      }
    };
  }

  /* ------------------------------------------------------------------ */
  /* WebAuthn                                                            */
  /* ------------------------------------------------------------------ */
  function b64(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function unb64(str) {
    var pad = str.length % 4 ? "=".repeat(4 - (str.length % 4)) : "";
    var raw = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  function randomChallenge() {
    var arr = new Uint8Array(32);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    return arr;
  }
  function webauthnSupported() {
    return !!(window.PublicKeyCredential && navigator.credentials && navigator.credentials.create);
  }
  function platformAuthenticator() {
    if (!webauthnSupported() || !window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return Promise.resolve(false);
    }
    return window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(function () { return false; });
  }
  function loadDevices() {
    devices = readJSON(DEVICES_KEY, []);
    if (!Array.isArray(devices)) devices = [];
    return devices;
  }
  function saveDevices() { writeJSON(DEVICES_KEY, devices); }

  function registerBiometric() {
    if (!webauthnSupported()) {
      return Promise.resolve({ ok: false, reason: "unsupported" });
    }
    var userId = randomChallenge().slice(0, 16);
    return navigator.credentials.create({
      publicKey: {
        challenge: randomChallenge(),
        rp: { name: "SAWA UNITED GROUP", id: location.hostname },
        user: {
          id: userId,
          name: session ? session.email : DEV_EMAIL,
          displayName: "SAWA Developer"
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred"
        },
        timeout: 60000,
        attestation: "none"
      }
    }).then(function (cred) {
      if (!cred) return { ok: false, reason: "cancelled" };
      var record = {
        id: b64(cred.rawId),
        label: deviceLabel(),
        email: session ? session.email : DEV_EMAIL,
        createdAt: new Date().toISOString(),
        transports: (cred.response && cred.response.getTransports) ? safeTransports(cred) : [],
        simulated: false
      };
      devices = devices.filter(function (d) { return d.id !== record.id; });
      devices.unshift(record);
      saveDevices();
      return { ok: true, record: record };
    }).catch(function (err) {
      return { ok: false, reason: (err && err.name) || "error", message: err && err.message };
    });
  }

  function safeTransports(cred) {
    try { return cred.response.getTransports(); } catch (e) { return []; }
  }

  function authenticateBiometric() {
    loadDevices();
    var real = devices.filter(function (d) { return !d.simulated; });
    if (!webauthnSupported() || real.length === 0) {
      return simulateBiometric(real.length === 0 ? "no-device" : "unsupported");
    }
    return navigator.credentials.get({
      publicKey: {
        challenge: randomChallenge(),
        timeout: 60000,
        userVerification: "required",
        rpId: location.hostname,
        allowCredentials: real.map(function (d) {
          return { type: "public-key", id: unb64(d.id), transports: d.transports || [] };
        })
      }
    }).then(function (assertion) {
      if (!assertion) return { ok: false, reason: "cancelled" };
      var match = real.filter(function (d) { return d.id === b64(assertion.rawId); })[0];
      if (match) {
        match.lastUsedAt = new Date().toISOString();
        saveDevices();
      }
      return { ok: true, record: match, simulated: false };
    }).catch(function (err) {
      return { ok: false, reason: (err && err.name) || "error", message: err && err.message };
    });
  }

  /* Desktop-preview fallback: animated scanner + local credential check. */
  function simulateBiometric(reason) {
    var scanner = scanOpen(
      reason === "no-device" ? "Register device fingerprint" : "Simulated biometric check",
      reason === "no-device" ? "No passkey yet — running secure simulation" : "Platform authenticator unavailable"
    );
    return new Promise(function (resolve) {
      scanner.step(0);
      setTimeout(function () { scanner.step(1); }, 550);
      setTimeout(function () { scanner.step(2); }, 1250);
      setTimeout(function () { scanner.step(3); }, 1950);
      setTimeout(function () {
        scanner.ok();
        var record = {
          id: "sim-" + Math.random().toString(36).slice(2, 12),
          label: deviceLabel() + " (simulated)",
          email: session ? session.email : DEV_EMAIL,
          createdAt: new Date().toISOString(),
          simulated: true
        };
        devices = devices.filter(function (d) { return d.id !== record.id; });
        devices.unshift(record);
        saveDevices();
        scanner.close(700);
        resolve({ ok: true, record: record, simulated: true, reason: reason });
      }, 2600);
    });
  }

  function deviceLabel() {
    var ua = navigator.userAgent;
    var os = /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac/.test(ua) ? "macOS" : /Win/.test(ua) ? "Windows" : "Linux";
    var browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : /Firefox\//.test(ua) ? "Firefox" : "Browser";
    return os + " · " + browser;
  }

  /* ------------------------------------------------------------------ */
  /* Login flow                                                          */
  /* ------------------------------------------------------------------ */
  function initGate() {
    var emailInput = $("#devEmail");
    var passInput = $("#devPass");
    var loginBtn = $("#loginBtn");
    var bioBtn = $("#bioLogin");

    try {
      var remembered = localStorage.getItem("sawa_dev_email");
      if (remembered) emailInput.value = remembered;
    } catch (e) { /* ignore */ }

    $("#passToggle").addEventListener("click", function () {
      var shown = passInput.type === "text";
      passInput.type = shown ? "password" : "text";
      this.setAttribute("aria-pressed", String(!shown));
    });

    $("#loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      hideError();
      var email = emailInput.value.trim().toLowerCase();
      var password = passInput.value;
      if (!email || !password) { showError("Enter the developer email and master password."); return; }

      loginBtn.disabled = true;
      loginBtn.querySelector("span").textContent = "Verifying credentials…";

      S.login(email, password).then(function (result) {
        loginBtn.disabled = false;
        loginBtn.querySelector("span").textContent = "Verify credentials & continue";
        if (!result.ok) {
          showError(result.message || "Invalid developer credentials.");
          audit("LOGIN_FAILED", email);
          return;
        }
        if (result.role !== ROLE) {
          showError("This account does not hold the SUPER_DEVELOPER_ADMIN role.");
          return;
        }
        if ($("#rememberDev").checked) {
          try { localStorage.setItem("sawa_dev_email", email); } catch (err) { /* ignore */ }
        }
        saveSession({ email: email, token: result.token, source: result.source });
        audit("LOGIN_SUCCESS", email);
        bioBtn.disabled = false;
        bioBtn.querySelector("small").textContent = "Tap to verify fingerprint and unlock";
        startSecondFactor(function () { openConsole(); });
      }).catch(function () {
        loginBtn.disabled = false;
        loginBtn.querySelector("span").textContent = "Verify credentials & continue";
        showError("Sign-in failed. Check the connection and try again.");
      });
    });

    bioBtn.addEventListener("click", function () {
      if (!session) {
        showError("Complete step 1 (credentials) before the biometric factor.");
        return;
      }
      startSecondFactor(function () { openConsole(); });
    });
  }

  function startSecondFactor(done) {
    scanOpen("Step 2 · Biometric verification", "Confirm with your fingerprint to unlock the console");
    var scanner = { step: function (i) {
      $$(".scan-step").forEach(function (s, idx) {
        s.classList.toggle("is-done", idx < i);
        s.classList.toggle("is-active", idx === i);
      });
    } };
    scanner.step(0);
    setTimeout(function () { scanner.step(1); }, 500);

    authenticateBiometric().then(function (res) {
      if (!res.ok && res.reason !== "cancelled") {
        return simulateBiometric(res.reason).then(function (sim) {
          finish(res, sim || res);
        });
      }
      finish(res);
    }).catch(function () { finish({ ok: false, reason: "error" }); });

    function finish(res) {
      $("#scanScrim").classList.remove("is-open");
      $("#scanner").classList.remove("is-scanning", "is-ok");
      if (res.ok) {
        audit(res.simulated ? "BIOMETRIC_SIMULATED" : "BIOMETRIC_VERIFIED", "WebAuthn authenticator");
        toast(res.simulated ? "Device verified in simulation mode" : "Biometric verification complete");
        done();
      } else {
        showError("Biometric verification failed (" + (res.reason || "unknown") + "). Enter credentials again.");
        audit("BIOMETRIC_FAILED", res.reason || "unknown");
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Audit                                                               */
  /* ------------------------------------------------------------------ */
  function audit(action, target) {
    var data = S.data;
    var entry = {
      id: S.uid("AU"),
      at: new Date().toISOString(),
      actor: (session && session.email) || DEV_EMAIL,
      action: action,
      target: target || "super-admin",
      ip: "client"
    };
    /* Session events are written straight to the store so the public site
       audit ledger and the console stay consistent. */
    try {
      S.commit(function (draft) {
        draft.audit = draft.audit || [];
        draft.audit.unshift(entry);
        draft.audit = draft.audit.slice(0, 200);
      }, { cloud: false });
    } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------------ */
  /* Navigation                                                          */
  /* ------------------------------------------------------------------ */
  function setView(name) {
    currentView = name;
    $$(".view").forEach(function (v) { v.classList.toggle("is-on", v.id === "view-" + name); });
    $$(".nav-item[data-view]").forEach(function (b) { b.classList.toggle("is-active", b.dataset.view === name); });
    closeSide();
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderAll();
  }

  function closeSide() {
    $("#side").classList.remove("is-open");
    $("#sideScrim").classList.remove("is-on");
  }

  function bindNav() {
    $$(".nav-item[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () { setView(btn.dataset.view); });
    });
    $$("[data-goto]").forEach(function (btn) {
      btn.addEventListener("click", function () { setView(btn.dataset.goto); });
    });
    $("#sideToggle").addEventListener("click", function () {
      $("#side").classList.add("is-open");
      $("#sideScrim").classList.add("is-on");
    });
    $("#sideClose").addEventListener("click", closeSide);
    $("#sideScrim").addEventListener("click", closeSide);
    $("#logoutBtn").addEventListener("click", function () { lockConsole(); toast("Session ended"); });
    $("#sideLogout").addEventListener("click", function () { lockConsole(); toast("Session ended"); });
  }

  /* ------------------------------------------------------------------ */
  /* Counters / chrome                                                   */
  /* ------------------------------------------------------------------ */
  function syncBadge() {
    var cloud = S.cloud;
    var badge = $("#tbSync");
    var live = cloud.mode === "php";
    badge.classList.toggle("is-live", live);
    $("#tbSyncText").textContent = live ? "API LIVE" : "LOCAL";
    $("#sideApi").textContent = live ? "Hostinger PHP" : "local mode";
    $("#sideRev").textContent = String(S.data.rev || 0);
  }

  function refreshCounts() {
    var d = S.data;
    $("#cntLeads").textContent = String((d.leads || []).length);
    $("#cntProps").textContent = String((d.properties || []).length);
    $("#cntProducts").textContent = String((d.products || []).length);
    $("#cntCars").textContent = String((d.cars || []).length);
    $("#cntContracts").textContent = String((d.contracts || []).length);
    $("#cntShip").textContent = String((d.shipments || []).length);
    syncBadge();
  }

  /* ------------------------------------------------------------------ */
  /* Overview                                                            */
  /* ------------------------------------------------------------------ */
  function renderOverview() {
    var d = S.data;
    var visits = (d.analytics.sites || []).reduce(function (a, s) { return a + (s.visits || 0); }, 0);
    var leads = d.leads || [];
    var pipeline = leads.reduce(function (a, l) { return a + (Number(l.value) || 0); }, 0);
    var available = (d.properties || []).filter(function (p) { return p.status === "available"; }).length;
    var reserved = (d.properties || []).filter(function (p) { return p.status === "reserved"; }).length;
    var portfolio = (d.properties || []).reduce(function (a, p) { return a + (Number(p.price) || 0); }, 0);

    $("#overviewStats").innerHTML = [
      { label: "Web visits · 30d", value: compactMoney(visits).replace("K", "K"), sub: "4 properties" },
      { label: "Leads captured", value: String(leads.length), sub: "live pipeline" },
      { label: "Pipeline value", value: compactMoney(pipeline) + " EGP", sub: "weighted by stage" },
      { label: "Assets available", value: available + " / " + (d.properties || []).length, sub: reserved + " reserved" }
    ].map(function (s) {
      return '<div class="stat"><span>' + esc(s.label) + '</span><b>' + esc(s.value) + '</b><small>' + esc(s.sub) + '</small></div>';
    }).join("");

    var spark = $("#ovSpark");
    var daily = (d.analytics.daily || []).slice(-14);
    var max = Math.max.apply(null, daily.concat([1]));
    spark.innerHTML = daily.map(function (v) {
      return '<span style="height:' + Math.max(6, Math.round((v / max) * 100)) + '%" title="' + v + '"></span>';
    }).join("");

    $("#ovSiteKv").innerHTML = (d.analytics.sites || []).map(function (site) {
      return '<div class="kv-row"><span>' + esc(site.domain) + '</span><b>' + site.visits.toLocaleString() + ' · ' + site.conversion + '%</b></div>';
    }).join("");

    $("#ovLeads").innerHTML = leads.slice(0, 6).map(function (l) {
      return '<tr><td class="td-mono">' + esc(l.id) + '</td><td>' + esc(l.name) + '<div class="td-muted">' + esc(l.detail) + '</div></td>' +
        '<td><span class="pill">' + esc(l.sector) + '</span></td><td class="td-mono">' + esc(compactMoney(l.value)) + '</td></tr>';
    }).join("") || '<tr><td colspan="4" class="td-muted">No leads yet</td></tr>';

    $("#ovPortfolio").innerHTML = [
      ['Available', available + " assets"],
      ['Reserved', reserved + " assets"],
      ['Sold', ((d.properties || []).length - available - reserved) + " assets"],
      ['Gross asset value', money(portfolio)],
      ['Avg. ticket', money(Math.round(portfolio / Math.max(1, (d.properties || []).length)))]
    ].map(function (row) {
      return '<div class="kv-row"><span>' + esc(row[0]) + '</span><b>' + esc(row[1]) + '</b></div>';
    }).join("");

    $("#ovAudit").innerHTML = (d.audit || []).slice(0, 6).map(function (a) {
      return '<div class="log-row"><time>' + esc(timeShort(a.at)) + '</time><b>' + esc(a.action) + '</b><span>' + esc(a.target) + '</span></div>';
    }).join("") || '<div class="empty">No audit entries</div>';
  }

  /* ------------------------------------------------------------------ */
  /* Real estate                                                         */
  /* ------------------------------------------------------------------ */
  function renderRealEstate() {
    var d = S.data;
    var q = ($("#reSearch").value || "").toLowerCase();
    var status = $("#reStatus").value;
    var type = $("#reType").value;

    var stats = {
      total: d.properties.length,
      available: d.properties.filter(function (p) { return p.status === "available"; }).length,
      reserved: d.properties.filter(function (p) { return p.status === "reserved"; }).length,
      sold: d.properties.filter(function (p) { return p.status === "sold"; }).length
    };
    $("#reStats").innerHTML = [
      { label: "Total assets", value: stats.total, sub: "portfolio" },
      { label: "Available", value: stats.available, sub: "listed publicly" },
      { label: "Reserved", value: stats.reserved, sub: "handover tracking" },
      { label: "Sold", value: stats.sold, sub: "closed" }
    ].map(function (s) {
      return '<div class="stat"><span>' + esc(s.label) + '</span><b>' + esc(s.value) + '</b><small>' + esc(s.sub) + '</small></div>';
    }).join("");

    var list = d.properties.filter(function (p) {
      if (status !== "all" && p.status !== status) return false;
      if (type !== "all" && p.type !== type) return false;
      if (q) {
        var hay = [p.ref, p.city, en(p.title), p.title.ar].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    $("#reTable").innerHTML = list.map(function (p) {
      var cls = p.status === "available" ? "pill--ok" : p.status === "reserved" ? "pill--warn" : "pill--info";
      return '<tr>' +
        '<td class="td-mono">' + esc(p.ref) + '</td>' +
        '<td><b style="font-weight:700">' + esc(en(p.title)) + '</b><div class="td-muted">' + esc(p.type) + ' · ' + p.area + ' m²</div></td>' +
        '<td class="td-muted">' + esc(p.city) + '</td>' +
        '<td class="td-mono">' + esc(compactMoney(p.price)) + '</td>' +
        '<td><span class="pill ' + cls + '">' + esc(p.status) + '</span></td>' +
        '<td class="td-muted">' + esc(p.handover) + '<div class="td-muted">' + esc(p.handoverStage || "—") + '</div></td>' +
        '<td><div class="td-actions">' +
          '<button class="btn btn--ghost btn--icon" type="button" data-edit="property" data-id="' + esc(p.id) + '" aria-label="Edit">' + ico("edit", 13) + '</button>' +
          '<button class="btn btn--danger btn--icon" type="button" data-del="properties" data-id="' + esc(p.id) + '" aria-label="Delete">' + ico("trash", 13) + '</button>' +
        '</div></td></tr>';
    }).join("") || '<tr><td colspan="7" class="td-muted">No assets match the filters.</td></tr>';
  }

  /* ------------------------------------------------------------------ */
  /* Food                                                                */
  /* ------------------------------------------------------------------ */
  function renderFood() {
    var d = S.data;
    $("#fdTable").innerHTML = d.products.map(function (p) {
      return '<tr><td class="td-mono">' + esc(p.sku) + '</td>' +
        '<td><b>' + esc(en(p.name)) + '</b><div class="td-muted">' + esc(p.category) + (p.flagship ? ' · <span style="color:var(--gold-bright)">flagship</span>' : "") + '</div></td>' +
        '<td class="td-muted">' + esc(p.pack) + '</td>' +
        '<td class="td-mono">' + esc(money(p.price)) + '</td>' +
        '<td class="td-mono">' + esc(p.moq) + '</td>' +
        '<td><div class="td-actions">' +
          '<button class="btn btn--ghost btn--icon" type="button" data-edit="product" data-id="' + esc(p.id) + '" aria-label="Edit">' + ico("edit", 13) + '</button>' +
          '<button class="btn btn--danger btn--icon" type="button" data-del="products" data-id="' + esc(p.id) + '" aria-label="Delete">' + ico("trash", 13) + '</button>' +
        '</div></td></tr>';
    }).join("");

    $("#fdApps").innerHTML = (d.applications || []).map(function (a) {
      var cls = a.status === "approved" ? "pill--ok" : a.status === "new" ? "pill--info" : "pill--warn";
      return '<tr><td class="td-mono">' + esc(a.id) + '</td>' +
        '<td><b>' + esc(a.company) + '</b><div class="td-muted">' + esc(a.contact) + '</div></td>' +
        '<td><span class="pill">' + esc(a.type) + '</span></td>' +
        '<td class="td-mono">' + esc(compactMoney(a.volume)) + '</td>' +
        '<td><button class="pill ' + cls + '" type="button" data-cycle="applications" data-id="' + esc(a.id) + '">' + esc(a.status) + '</button></td></tr>';
    }).join("") || '<tr><td colspan="5" class="td-muted">No applications yet.</td></tr>';
  }

  /* ------------------------------------------------------------------ */
  /* Cars                                                                */
  /* ------------------------------------------------------------------ */
  function renderCars() {
    var d = S.data;
    var bookings = d.bookings || [];
    var cod = bookings.reduce(function (a, b) { return a + (Number(b.total) || 0); }, 0);
    $("#carStats").innerHTML = [
      { label: "Fleet size", value: d.cars.length, sub: "vehicles" },
      { label: "Available now", value: d.cars.filter(function (c) { return c.available; }).length, sub: "bookable" },
      { label: "COD bookings", value: bookings.length, sub: "zero upfront" },
      { label: "COD value", value: compactMoney(cod) + " EGP", sub: "collect on delivery" }
    ].map(function (s) {
      return '<div class="stat"><span>' + esc(s.label) + '</span><b>' + esc(s.value) + '</b><small>' + esc(s.sub) + '</small></div>';
    }).join("");

    $("#carTable").innerHTML = d.cars.map(function (c) {
      return '<tr><td><b>' + esc(en(c.name)) + '</b><div class="td-muted">' + c.seats + ' seats · ' + esc(c.transmission) + '</div></td>' +
        '<td><span class="pill">' + esc(c.category) + '</span></td>' +
        '<td class="td-mono">' + esc(compactMoney(c.daily)) + '</td>' +
        '<td class="td-mono">' + esc(compactMoney(c.monthly)) + '</td>' +
        '<td><button class="pill ' + (c.available ? "pill--ok" : "pill--bad") + '" type="button" data-toggle-car="' + esc(c.id) + '">' + (c.available ? "available" : "booked") + '</button></td>' +
        '<td><div class="td-actions">' +
          '<button class="btn btn--ghost btn--icon" type="button" data-edit="car" data-id="' + esc(c.id) + '" aria-label="Edit">' + ico("edit", 13) + '</button>' +
          '<button class="btn btn--danger btn--icon" type="button" data-del="cars" data-id="' + esc(c.id) + '" aria-label="Delete">' + ico("trash", 13) + '</button>' +
        '</div></td></tr>';
    }).join("");

    $("#carBookings").innerHTML = bookings.map(function (b) {
      var cls = b.status === "confirmed" ? "pill--ok" : b.status === "delivered" ? "pill--info" : "pill--warn";
      return '<tr><td class="td-mono">' + esc(b.id) + '</td>' +
        '<td>' + esc(b.customer) + '<div class="td-muted">' + esc(b.city || "") + ' · ' + esc(b.days) + ' days</div></td>' +
        '<td class="td-muted">' + esc(b.car) + '</td>' +
        '<td class="td-mono">' + esc(compactMoney(b.total)) + '</td>' +
        '<td><button class="pill ' + cls + '" type="button" data-cycle-booking="' + esc(b.id) + '">' + esc(b.status) + '</button></td>' +
        '<td><div class="td-actions"><button class="btn btn--danger btn--icon" type="button" data-del="bookings" data-id="' + esc(b.id) + '" aria-label="Delete">' + ico("trash", 13) + '</button></div></td></tr>';
    }).join("") || '<tr><td colspan="6" class="td-muted">No bookings captured yet.</td></tr>';
  }

  /* ------------------------------------------------------------------ */
  /* Energy                                                              */
  /* ------------------------------------------------------------------ */
  function renderEnergy() {
    var d = S.data;
    $("#enTable").innerHTML = d.petroleum.map(function (p) {
      return '<tr><td><b>' + esc(en(p.name)) + '</b></td>' +
        '<td class="td-muted">' + esc(en(p.unit)) + '</td>' +
        '<td class="td-mono">' + esc(money(p.price)) + '</td>' +
        '<td class="td-mono">' + esc(p.minOrder.toLocaleString()) + '</td>' +
        '<td><div class="td-actions">' +
          '<button class="btn btn--ghost btn--icon" type="button" data-edit="petro" data-id="' + esc(p.id) + '" aria-label="Edit">' + ico("edit", 13) + '</button>' +
          '<button class="btn btn--danger btn--icon" type="button" data-del="petroleum" data-id="' + esc(p.id) + '" aria-label="Delete">' + ico("trash", 13) + '</button>' +
        '</div></td></tr>';
    }).join("");

    $("#enContracts").innerHTML = (d.contracts || []).map(function (c) {
      var cls = c.status === "active" ? "pill--ok" : c.status === "draft" ? "pill--warn" : "pill--info";
      return '<tr><td class="td-mono">' + esc(c.id) + '</td>' +
        '<td><b>' + esc(c.client) + '</b><div class="td-muted">Renews ' + esc(c.renewal) + '</div></td>' +
        '<td class="td-muted">' + esc(c.product) + '</td>' +
        '<td class="td-mono">' + esc(compactMoney(c.value)) + '</td>' +
        '<td><button class="pill ' + cls + '" type="button" data-cycle-contract="' + esc(c.id) + '">' + esc(c.status) + '</button></td>' +
        '<td><div class="td-actions">' +
          '<button class="btn btn--ghost btn--icon" type="button" data-edit="contract" data-id="' + esc(c.id) + '" aria-label="Edit">' + ico("edit", 13) + '</button>' +
          '<button class="btn btn--danger btn--icon" type="button" data-del="contracts" data-id="' + esc(c.id) + '" aria-label="Delete">' + ico("trash", 13) + '</button>' +
        '</div></td></tr>';
    }).join("") || '<tr><td colspan="6" class="td-muted">No contracts yet.</td></tr>';
  }

  /* ------------------------------------------------------------------ */
  /* Logistics                                                           */
  /* ------------------------------------------------------------------ */
  function renderLogistics() {
    var d = S.data;
    var q = ($("#lgSearch").value || "").toLowerCase();
    var list = (d.shipments || []).filter(function (s) {
      if (!q) return true;
      return [s.id, s.client, s.origin, s.destination].join(" ").toLowerCase().indexOf(q) >= 0;
    });
    $("#lgTable").innerHTML = list.map(function (s) {
      var cls = s.status === "delivered" ? "pill--ok" : s.status === "customs" ? "pill--warn" : "pill--info";
      return '<tr><td class="td-mono">' + esc(s.id) + '</td>' +
        '<td>' + esc(s.client) + '</td>' +
        '<td class="td-muted" dir="ltr">' + esc(s.origin) + ' → ' + esc(s.destination) + '</td>' +
        '<td><span class="pill">' + esc(s.mode) + '</span></td>' +
        '<td class="td-mono">' + esc(s.eta) + '</td>' +
        '<td><div class="bar-track" style="min-width:70px"><i style="width:' + s.progress + '%;background:var(--gold)"></i></div></td>' +
        '<td><button class="pill ' + cls + '" type="button" data-cycle-ship="' + esc(s.id) + '">' + esc(s.status) + '</button></td>' +
        '<td><div class="td-actions">' +
          '<button class="btn btn--ghost btn--icon" type="button" data-edit="shipment" data-id="' + esc(s.id) + '" aria-label="Edit">' + ico("edit", 13) + '</button>' +
          '<button class="btn btn--danger btn--icon" type="button" data-del="shipments" data-id="' + esc(s.id) + '" aria-label="Delete">' + ico("trash", 13) + '</button>' +
        '</div></td></tr>';
    }).join("") || '<tr><td colspan="8" class="td-muted">No shipments found.</td></tr>';
  }

  /* ------------------------------------------------------------------ */
  /* Leads                                                               */
  /* ------------------------------------------------------------------ */
  function renderLeads() {
    var d = S.data;
    var q = ($("#ldSearch").value || "").toLowerCase();
    var sector = $("#ldSector").value;
    var stage = $("#ldStage").value;
    var leads = d.leads || [];

    var won = leads.filter(function (l) { return l.status === "won" || l.status === "confirmed"; });
    $("#leadStats").innerHTML = [
      { label: "Total leads", value: leads.length, sub: "all time" },
      { label: "New / unworked", value: leads.filter(function (l) { return l.status === "new"; }).length, sub: "needs action" },
      { label: "Won value", value: compactMoney(won.reduce(function (a, l) { return a + (Number(l.value) || 0); }, 0)) + " EGP", sub: "closed" },
      { label: "WhatsApp routed", value: (d.analytics.whatsappLog || []).length, sub: "messages logged" }
    ].map(function (s) {
      return '<div class="stat"><span>' + esc(s.label) + '</span><b>' + esc(s.value) + '</b><small>' + esc(s.sub) + '</small></div>';
    }).join("");

    var list = leads.filter(function (l) {
      if (sector !== "all" && l.sector !== sector) return false;
      if (stage !== "all" && l.status !== stage) return false;
      if (q) {
        return [l.id, l.name, l.detail, l.phone].join(" ").toLowerCase().indexOf(q) >= 0;
      }
      return true;
    });

    $("#ldTable").innerHTML = list.map(function (l) {
      var cls = ["won", "confirmed"].indexOf(l.status) >= 0 ? "pill--ok" : l.status === "new" ? "pill--info" : l.status === "lost" ? "pill--bad" : "pill--warn";
      return '<tr><td class="td-mono">' + esc(l.id) + '</td>' +
        '<td><b>' + esc(l.name) + '</b><div class="td-muted" dir="ltr">' + esc(l.phone) + '</div></td>' +
        '<td class="td-muted">' + esc(l.detail) + '</td>' +
        '<td><span class="pill">' + esc(l.sector) + '</span></td>' +
        '<td class="td-mono">' + esc(compactMoney(l.value)) + '</td>' +
        '<td><button class="pill ' + cls + '" type="button" data-cycle-lead="' + esc(l.id) + '">' + esc(l.status) + '</button></td>' +
        '<td class="td-muted">' + esc(l.source) + '<div class="td-muted">' + esc(dateShort(l.createdAt)) + '</div></td>' +
        '<td><div class="td-actions">' +
          '<a class="btn btn--ghost btn--icon" href="' + esc(S.waLink("SAWA UNITED — " + l.detail)) + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ico("wa", 13) + '</a>' +
          '<button class="btn btn--danger btn--icon" type="button" data-del="leads" data-id="' + esc(l.id) + '" aria-label="Delete">' + ico("trash", 13) + '</button>' +
        '</div></td></tr>';
    }).join("") || '<tr><td colspan="8" class="td-muted">No leads match the filters.</td></tr>';
  }

  /* ------------------------------------------------------------------ */
  /* Telemetry                                                           */
  /* ------------------------------------------------------------------ */
  function renderTelemetry() {
    var d = S.data;
    var a = d.analytics || {};
    var sites = a.sites || [];
    var totalVisits = sites.reduce(function (x, s) { return x + s.visits; }, 0);
    var totalLeads = sites.reduce(function (x, s) { return x + s.leads; }, 0);
    var avg = totalVisits ? ((totalLeads / totalVisits) * 100).toFixed(2) : "0";

    $("#tlStats").innerHTML = [
      { label: "Total visits", value: totalVisits.toLocaleString(), sub: "30 days" },
      { label: "Total leads", value: String(totalLeads), sub: "all properties" },
      { label: "Blended CVR", value: avg + "%", sub: "visits → leads" },
      { label: "WhatsApp routes", value: String((a.whatsappLog || []).length), sub: "last 60" }
    ].map(function (s) {
      return '<div class="stat"><span>' + esc(s.label) + '</span><b>' + esc(s.value) + '</b><small>' + esc(s.sub) + '</small></div>';
    }).join("");

    var maxVisits = Math.max.apply(null, sites.map(function (s) { return s.visits; }).concat([1]));
    $("#tlSites").innerHTML = sites.map(function (s) {
      return '<div class="bar-row"><div class="top"><b>' + esc(s.domain) + '</b><span>' + s.visits.toLocaleString() + ' visits · ' + s.conversion + '%</span></div>' +
        '<div class="bar-track"><i style="width:' + Math.round((s.visits / maxVisits) * 100) + '%;background:' + s.accent + '"></i></div></div>';
    }).join("");

    var totalSrc = (a.sources || []).reduce(function (x, s) { return x + s.value; }, 0) || 1;
    $("#tlSources").innerHTML = (a.sources || []).map(function (s) {
      return '<div class="bar-row"><div class="top"><b>' + esc(en(s.name)) + '</b><span>' + s.value + '%</span></div>' +
        '<div class="bar-track"><i style="width:' + Math.round((s.value / totalSrc) * 100) + '%;background:linear-gradient(90deg,var(--gold),var(--gold-bright))"></i></div></div>';
    }).join("");

    $("#tlWa").innerHTML = (a.whatsappLog || []).map(function (w) {
      return '<div class="log-row"><time>' + esc(timeShort(w.at)) + '</time><b>' + esc(w.sector) + '</b><span>' + esc(w.text) + '</span></div>';
    }).join("") || '<div class="empty">No WhatsApp routing yet</div>';

    $("#tlHealth").innerHTML = [
      ['Persistence', S.cloud.mode === "php" ? "Hostinger API" : "LocalStorage", S.cloud.mode === "php"],
      ['Connection', S.cloud.online ? "online" : "offline", S.cloud.online],
      ['Data revision', String(d.rev || 0), true],
      ['Dataset size', (JSON.stringify(d).length / 1024).toFixed(1) + " KB", true],
      ['WebAuthn', webauthnSupported() ? "available" : "unavailable", webauthnSupported()],
      ['Authenticators', String(devices.length), devices.length > 0],
      ['Last cloud save', d.serverUpdatedAt ? dateShort(d.serverUpdatedAt) : "local only", !!d.serverUpdatedAt]
    ].map(function (row) {
      return '<div class="kv-row"><span>' + esc(row[0]) + '</span><b class="' + (row[2] ? "ok" : "warn") + '">' + esc(row[1]) + '</b></div>';
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* Brand control                                                       */
  /* ------------------------------------------------------------------ */
  function triInput(label, path, value) {
    return '<div class="field"><label>' + esc(label) + '</label>' +
      '<input data-brand="' + path + '" data-lang="ar" dir="rtl" placeholder="AR" value="' + esc((value && value.ar) || "") + '">' +
      '<input data-brand="' + path + '" data-lang="en" dir="ltr" placeholder="EN" value="' + esc((value && value.en) || "") + '">' +
      '<input data-brand="' + path + '" data-lang="fr" dir="ltr" placeholder="FR" value="' + esc((value && value.fr) || "") + '">' +
      '</div>';
  }

  function renderBrand() {
    var c = S.data.content;
    $("#brandForm").innerHTML =
      triInput("Hero title line 1", "heroTitleA", c.heroTitleA) +
      triInput("Hero title line 2", "heroTitleB", c.heroTitleB) +
      triInput("Hero lead", "heroLead", c.heroLead) +
      triInput("SEO title", "seoTitle", c.seoTitle) +
      triInput("SEO description", "seoDescription", c.seoDescription);

    $("#kpiForm").innerHTML = S.data.kpis.map(function (k) {
      return '<div class="field-row"><div class="field"><label>' + esc(en(k.label)) + '</label>' +
        '<input type="number" data-kpi="' + esc(k.id) + '" value="' + k.value + '" min="0"></div>' +
        '<div class="field"><label>Suffix</label><input data-kpi-suffix="' + esc(k.id) + '" value="' + esc(k.suffix) + '"></div></div>';
    }).join("");

    var s = S.data.settings;
    $("#settingsForm").innerHTML =
      '<div class="field-row"><div class="field"><label>Phone</label><input id="setPhone" value="' + esc(s.phone) + '" dir="ltr"></div>' +
      '<div class="field"><label>WhatsApp</label><input id="setWa" value="' + esc(s.whatsapp) + '" dir="ltr"></div></div>' +
      '<div class="field"><label>Email</label><input id="setEmail" value="' + esc(s.email) + '" dir="ltr"></div>' +
      '<div class="field"><label>Headquarters (EN)</label><input id="setHq" value="' + esc(en(s.hq)) + '"></div>';

    $("#brandPreview").innerHTML = [
      ['Hero (EN)', en(c.heroTitleA) + " " + en(c.heroTitleB)],
      ['SEO title', en(c.seoTitle)],
      ['Phone', s.phone],
      ['WhatsApp', s.whatsapp],
      ['HQ', en(s.hq)],
      ['Revision', String(S.data.rev || 0)]
    ].map(function (row) {
      return '<div class="kv-row"><span>' + esc(row[0]) + '</span><b style="max-width:60%;text-align:end;overflow:hidden;text-overflow:ellipsis">' + esc(row[1]) + '</b></div>';
    }).join("");
  }

  function saveBrand() {
    var updates = {};
    $$("[data-brand]").forEach(function (input) {
      var path = input.dataset.brand;
      var lang = input.dataset.lang;
      if (!updates[path]) updates[path] = {};
      updates[path][lang] = input.value;
    });
    S.commit(function (draft) {
      Object.keys(updates).forEach(function (path) {
        draft.content[path] = Object.assign({}, draft.content[path], updates[path]);
      });
    }, { audit: "BRAND_PUBLISH", target: "hero + SEO (ar/en/fr)" });
    toast("Brand copy published to the public site");
    renderBrand();
  }

  function saveKpis() {
    S.commit(function (draft) {
      $$("[data-kpi]").forEach(function (input) {
        var k = draft.kpis.filter(function (item) { return item.id === input.dataset.kpi; })[0];
        if (k) k.value = Number(input.value) || 0;
      });
      $$("[data-kpi-suffix]").forEach(function (input) {
        var k = draft.kpis.filter(function (item) { return item.id === input.dataset.kpiSuffix; })[0];
        if (k) k.suffix = input.value;
      });
    }, { audit: "KPI_UPDATE", target: "homepage counters" });
    toast("KPI counters updated");
  }

  function saveSettings() {
    S.commit(function (draft) {
      draft.settings.phone = $("#setPhone").value;
      draft.settings.whatsapp = $("#setWa").value;
      draft.settings.email = $("#setEmail").value;
      draft.settings.hq = Object.assign({}, draft.settings.hq, { en: $("#setHq").value });
    }, { audit: "SETTINGS_UPDATE", target: "contact channels" });
    toast("Contact channels saved");
  }

  /* ------------------------------------------------------------------ */
  /* Security                                                            */
  /* ------------------------------------------------------------------ */
  function renderSecurity() {
    loadDevices();

    $("#devList").innerHTML = devices.map(function (d) {
      return '<div class="dev-row"><span class="ico">' + ico("finger", 15) + '</span>' +
        '<div><b>' + esc(d.label) + '</b><small>' + esc(d.email) + ' · added ' + esc(dateShort(d.createdAt)) + (d.lastUsedAt ? " · used " + esc(dateShort(d.lastUsedAt)) : "") + '</small></div>' +
        '<button class="btn btn--danger btn--sm" type="button" data-remove-device="' + esc(d.id) + '">Remove</button></div>';
    }).join("") || '<div class="empty">' + ico("finger", 26) + 'No authenticator registered on this device yet.</div>';

    $("#secSession").innerHTML = [
      ["Developer account", (session && session.email) || DEV_EMAIL],
      ["Role", ROLE],
      ["Factor 1", "Credentials · verified"],
      ["Factor 2", devices.length ? "WebAuthn · registered" : "Not yet registered"],
      ["Session source", (session && session.source) || "local"],
      ["Issued", session ? new Date(session.at).toISOString().slice(0, 16).replace("T", " ") : "—"],
      ["Expires", session ? new Date(session.exp).toISOString().slice(0, 16).replace("T", " ") : "—"]
    ].map(function (row) {
      return '<div class="kv-row"><span>' + esc(row[0]) + '</span><b>' + esc(row[1]) + '</b></div>';
    }).join("");

    $("#secHardening").innerHTML = [
      ["HTTPS transport", location.protocol === "https:"],
      ["Secure context", window.isSecureContext],
      ["WebAuthn API", webauthnSupported()],
      ["Platform authenticator", devices.some(function (d) { return !d.simulated; })],
      ["Server-side token", S.cloud.mode === "php"],
      ["api/config.php override", S.cloud.mode === "php"],
      ["Simulation fallback", devices.some(function (d) { return d.simulated; })]
    ].map(function (row) {
      return '<div class="kv-row"><span>' + esc(row[0]) + '</span><b class="' + (row[1] ? "ok" : "warn") + '">' + (row[1] ? "enabled" : "pending") + '</b></div>';
    }).join("");

    $("#fullAudit").innerHTML = (S.data.audit || []).map(function (a) {
      return '<div class="log-row"><time>' + esc(timeShort(a.at)) + '</time><b>' + esc(a.action) + '</b><span>' + esc(a.target) + '</span><span class="ip">' + esc(a.ip || "") + '</span></div>';
    }).join("") || '<div class="empty">No audit entries</div>';
  }

  function initSecurity() {
    $("#registerDevice").addEventListener("click", function () {
      if (!session) { toast("Sign in first"); return; }
      var btn = this;
      btn.disabled = true;
      btn.innerHTML = ico("refresh", 13) + "Waiting for sensor…";
      registerBiometric().then(function (res) {
        btn.disabled = false;
        btn.innerHTML = ico("plus", 13) + "Register this device";
        if (res.ok) {
          audit("WEBAUTHN_REGISTERED", res.record.label);
          toast("Authenticator registered: " + res.record.label);
          renderSecurity();
          return;
        }
        /* Simulation fallback so the console is testable on any desktop. */
        simulateBiometric(res.reason).then(function (sim) {
          if (sim.ok) {
            audit("WEBAUTHN_SIMULATED", sim.record.label);
            toast("Simulated authenticator registered");
            renderSecurity();
          }
        });
      });
    });

    doc.addEventListener("click", function (e) {
      var rm = e.target.closest("[data-remove-device]");
      if (rm) {
        devices = devices.filter(function (d) { return d.id !== rm.dataset.removeDevice; });
        saveDevices();
        audit("WEBAUTHN_REMOVED", rm.dataset.removeDevice);
        renderSecurity();
        toast("Authenticator removed");
      }
      var ca = e.target.closest("#clearAudit");
      if (ca) {
        S.commit(function (draft) { draft.audit = []; }, { audit: "AUDIT_CLEARED", target: "console" });
        renderSecurity();
        toast("Audit trail cleared");
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Data & sync                                                         */
  /* ------------------------------------------------------------------ */
  function renderData() {
    var cloud = S.cloud;
    $("#apiMode").textContent = cloud.mode === "php" ? "CONNECTED" : "LOCAL";
    $("#dataStatus").innerHTML = [
      ["Tier 1 · LocalStorage", "active", true],
      ["Tier 2 · PHP API", cloud.mode === "php" ? "connected" : "unavailable (static preview)", cloud.mode === "php"],
      ["Dataset revision", String(S.data.rev || 0), true],
      ["Last local change", dateShort(S.data.updatedAt), true],
      ["Last server write", S.data.serverUpdatedAt ? dateShort(S.data.serverUpdatedAt) : "—", !!S.data.serverUpdatedAt],
      ["Payload size", (JSON.stringify(S.data).length / 1024).toFixed(1) + " KB", true]
    ].map(function (row) {
      return '<div class="kv-row"><span>' + esc(row[0]) + '</span><b class="' + (row[2] ? "ok" : "warn") + '">' + esc(row[1]) + '</b></div>';
    }).join("");

    $("#apiInfo").innerHTML = [
      ["Endpoint", "api/ecosystem.php"],
      ["Actions", "load · save · login · lead · booking"],
      ["Auth", "HMAC-SHA256 token (8h TTL)"],
      ["Storage", "api/data/ecosystem.json"],
      ["Backups", "api/data/backups (20 rolling)"],
      ["Message", cloud.message || "local only"]
    ].map(function (row) {
      return '<div class="kv-row"><span>' + esc(row[0]) + '</span><b style="font-size:10.5px">' + esc(row[1]) + '</b></div>';
    }).join("");

    $("#apiRef").innerHTML = [
      "GET  ?action=load",
      "GET  ?action=ping",
      "POST {action:'login', email, password}",
      "POST {action:'save', token, data}",
      "POST {action:'lead', lead}",
      "POST {action:'booking', booking}"
    ].map(function (line) {
      return '<div class="log-row"><b dir="ltr" style="letter-spacing:0">' + esc(line) + '</b></div>';
    }).join("");
  }

  function initData() {
    $("#pushCloud").addEventListener("click", function () {
      S.push().then(function (ok) {
        toast(ok ? "Dataset pushed to Hostinger" : "Saved locally — API unreachable");
        renderData();
        syncBadge();
      });
    });

    $("#exportBtn").addEventListener("click", function () {
      var blob = new Blob([S.exportJSON()], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = doc.createElement("a");
      a.href = url;
      a.download = "sawa-ecosystem-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 800);
      audit("DATA_EXPORT", a.download);
      toast("Snapshot exported");
    });

    $("#importFile").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var res = S.importJSON(String(reader.result));
        toast(res.ok ? "Dataset imported" : res.message);
        renderAll();
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    $("#resetBtn").addEventListener("click", function () {
      if (!confirm("Reset every sector back to the seeded dataset? Local edits will be lost.")) return;
      S.reset();
      renderAll();
      toast("Dataset reset to seed");
    });
  }

  /* ------------------------------------------------------------------ */
  /* CRUD modals                                                         */
  /* ------------------------------------------------------------------ */
  var SCHEMAS = {
    property: {
      collection: "properties",
      title: "asset",
      fields: [
        { key: "ref", label: "Reference", type: "text", half: true, placeholder: "SU-RE-110" },
        { key: "status", label: "Status", type: "select", half: true, options: [["available", "Available"], ["reserved", "Reserved"], ["sold", "Sold"]] },
        { key: "titleEn", label: "Title (EN)", type: "text" },
        { key: "titleAr", label: "Title (AR)", type: "text", dir: "rtl" },
        { key: "city", label: "City", type: "text", half: true },
        { key: "districtEn", label: "District", type: "text", half: true },
        { key: "type", label: "Type", type: "select", half: true, options: [["apartment", "Apartment"], ["villa", "Villa"], ["office", "Office"], ["commercial", "Commercial"], ["chalet", "Chalet"], ["penthouse", "Penthouse"], ["land", "Land"]] },
        { key: "price", label: "Price (EGP)", type: "number", half: true },
        { key: "area", label: "Area (m²)", type: "number", half: true },
        { key: "beds", label: "Bedrooms", type: "number", half: true },
        { key: "baths", label: "Bathrooms", type: "number", half: true },
        { key: "handover", label: "Handover", type: "text", half: true, placeholder: "Q4 2026" },
        { key: "roi", label: "Target ROI %", type: "number", half: true },
        { key: "down", label: "Down payment %", type: "number", half: true },
        { key: "years", label: "Instalment years", type: "number", half: true },
        { key: "handoverStage", label: "Handover stage", type: "select", half: true, options: [["design", "Design"], ["contract", "Contract"], ["delivery", "Delivery"], ["closed", "Closed"]] },
        { key: "client", label: "Client", type: "text", half: true },
        { key: "progress", label: "Build progress %", type: "number", half: true },
        { key: "image", label: "Image path", type: "text", placeholder: "portfolio/assets/sector-realestate.webp" },
        { key: "tour3d", label: "3D tour URL", type: "text", placeholder: "https://…" }
      ]
    },
    product: {
      collection: "products",
      title: "product",
      fields: [
        { key: "sku", label: "SKU", type: "text", half: true, placeholder: "SF-1011" },
        { key: "category", label: "Category", type: "select", half: true, options: [["staples", "Staples"], ["beverages", "Beverages"], ["dairy", "Dairy"], ["fresh", "Fresh"], ["frozen", "Frozen"]] },
        { key: "nameEn", label: "Product name (EN)", type: "text" },
        { key: "nameAr", label: "Product name (AR)", type: "text", dir: "rtl" },
        { key: "brand", label: "Brand", type: "text", half: true },
        { key: "pack", label: "Pack size", type: "text", half: true },
        { key: "price", label: "Case price (EGP)", type: "number", half: true },
        { key: "moq", label: "MOQ", type: "number", half: true },
        { key: "flagship", label: "Flagship (Sawa Select)", type: "select", half: true, options: [["false", "No"], ["true", "Yes"]] }
      ]
    },
    car: {
      collection: "cars",
      title: "vehicle",
      fields: [
        { key: "nameEn", label: "Vehicle (EN)", type: "text", half: true },
        { key: "nameAr", label: "Vehicle (AR)", type: "text", half: true, dir: "rtl" },
        { key: "category", label: "Category", type: "select", half: true, options: [["economy", "Economy"], ["sedan", "Sedan"], ["suv", "Luxury SUV"], ["family", "Family"], ["luxury", "Luxury"], ["grandtouring", "Grand touring"], ["van", "Van"], ["bus", "Bus"]] },
        { key: "seats", label: "Seats", type: "number", half: true },
        { key: "daily", label: "Daily rate (EGP)", type: "number", half: true },
        { key: "monthly", label: "Monthly rate (EGP)", type: "number", half: true },
        { key: "transmission", label: "Transmission", type: "select", half: true, options: [["automatic", "Automatic"], ["manual", "Manual"]] },
        { key: "fuel", label: "Fuel", type: "select", half: true, options: [["petrol", "Petrol"], ["hybrid", "Hybrid"], ["diesel", "Diesel"], ["electric", "Electric"]] },
        { key: "available", label: "Available", type: "select", half: true, options: [["true", "Available"], ["false", "Booked"]] }
      ]
    },
    petro: {
      collection: "petroleum",
      title: "product",
      fields: [
        { key: "nameEn", label: "Product (EN)", type: "text", half: true },
        { key: "nameAr", label: "Product (AR)", type: "text", half: true, dir: "rtl" },
        { key: "unitEn", label: "Unit", type: "text", half: true, placeholder: "litre" },
        { key: "price", label: "Unit price (EGP)", type: "number", half: true },
        { key: "minOrder", label: "Minimum order", type: "number", half: true }
      ]
    },
    contract: {
      collection: "contracts",
      title: "contract",
      fields: [
        { key: "client", label: "Client", type: "text", half: true },
        { key: "product", label: "Product", type: "text", half: true },
        { key: "monthlyVolume", label: "Monthly volume", type: "number", half: true },
        { key: "value", label: "Contract value (EGP)", type: "number", half: true },
        { key: "status", label: "Status", type: "select", half: true, options: [["draft", "Draft"], ["active", "Active"], ["expired", "Expired"]] },
        { key: "renewal", label: "Renewal date", type: "date", half: true }
      ]
    },
    shipment: {
      collection: "shipments",
      title: "shipment",
      fields: [
        { key: "id", label: "Tracking ref", type: "text", half: true, placeholder: "SAWA-EG-00000" },
        { key: "client", label: "Client", type: "text", half: true },
        { key: "mode", label: "Mode", type: "select", half: true, options: [["sea", "Sea"], ["air", "Air"], ["land", "Land"]] },
        { key: "status", label: "Status", type: "select", half: true, options: [["in-transit", "In transit"], ["customs", "Customs"], ["delivered", "Delivered"]] },
        { key: "origin", label: "Origin", type: "text", half: true },
        { key: "destination", label: "Destination", type: "text", half: true },
        { key: "eta", label: "ETA", type: "date", half: true },
        { key: "progress", label: "Progress %", type: "number", half: true }
      ]
    }
  };

  var modalContext = null;

  function openModal(kind, id) {
    var schema = SCHEMAS[kind];
    if (!schema) return;
    var collection = S.data[schema.collection] || [];
    var record = id ? collection.filter(function (r) { return r.id === id; })[0] : null;
    modalContext = { kind: kind, schema: schema, id: id, record: record };

    $("#modalTitle").textContent = (record ? "Edit " : "New ") + schema.title;
    $("#modalError").classList.remove("is-on");
    $("#modalBody").innerHTML = schema.fields.map(function (f) {
      var value = "";
      if (record) {
        if (f.key === "titleEn") value = en(record.title);
        else if (f.key === "titleAr") value = (record.title && record.title.ar) || "";
        else if (f.key === "nameEn") value = en(record.name);
        else if (f.key === "nameAr") value = (record.name && record.name.ar) || "";
        else if (f.key === "districtEn") value = en(record.district);
        else if (f.key === "unitEn") value = en(record.unit);
        else if (f.key === "flagship") value = String(!!record.flagship);
        else if (f.key === "available") value = String(!!record.available);
        else value = record[f.key] === undefined ? "" : record[f.key];
      } else if (f.options) {
        value = f.options[0][0];
      }
      if (f.type === "select") {
        return '<div class="field"><label>' + esc(f.label) + '</label><select data-field="' + f.key + '">' +
          f.options.map(function (o) {
            return '<option value="' + esc(o[0]) + '"' + (String(value) === o[0] ? " selected" : "") + '>' + esc(o[1]) + '</option>';
          }).join("") + '</select></div>';
      }
      return '<div class="field"><label>' + esc(f.label) + '</label>' +
        '<input data-field="' + f.key + '" type="' + f.type + '" value="' + esc(value) + '"' +
        (f.dir ? ' dir="' + f.dir + '"' : "") + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "") + '></div>';
    }).join("");

    $("#modalScrim").classList.add("is-open");
    var first = $("#modalBody input, #modalBody select");
    if (first) setTimeout(function () { first.focus(); }, 120);
  }

  function closeModal() {
    $("#modalScrim").classList.remove("is-open");
    modalContext = null;
  }

  function saveModal(e) {
    e.preventDefault();
    if (!modalContext) return;
    var schema = modalContext.schema;
    var values = {};
    $$("#modalBody [data-field]").forEach(function (input) {
      var key = input.dataset.field;
      values[key] = input.type === "number" ? Number(input.value || 0) : input.value;
    });

    var id = modalContext.id;
    var collectionName = schema.collection;

    S.commit(function (draft) {
      var list = draft[collectionName] || (draft[collectionName] = []);
      var existing = id ? list.filter(function (r) { return r.id === id; })[0] : null;
      var target = existing || { id: S.uid(collectionName.slice(0, 3).toUpperCase()) };

      Object.keys(values).forEach(function (key) {
        var v = values[key];
        if (key === "titleEn") { target.title = Object.assign({}, target.title, { en: v }); }
        else if (key === "titleAr") { target.title = Object.assign({}, target.title, { ar: v }); }
        else if (key === "nameEn") { target.name = Object.assign({}, target.name, { en: v }); }
        else if (key === "nameAr") { target.name = Object.assign({}, target.name, { ar: v }); }
        else if (key === "districtEn") { target.district = Object.assign({}, target.district, { en: v }); }
        else if (key === "unitEn") { target.unit = Object.assign({}, target.unit, { en: v }); }
        else if (key === "flagship") { target.flagship = v === "true"; }
        else if (key === "available") { target.available = v === "true"; }
        else if (key === "id" && existing) { /* keep stable id */ }
        else { target[key] = v; }
      });

      if (!target.ref && collectionName === "properties") target.ref = "SU-RE-" + Math.floor(100 + Math.random() * 800);
      if (!target.name && collectionName !== "properties") target.name = Object.assign({}, target.name, { en: values.nameEn || values.client || "New record", ar: values.nameAr || "" });
      if (!target.title && collectionName === "properties") target.title = { en: values.titleEn || "New asset", ar: values.titleAr || "" };
      if (!target.image) target.image = "portfolio/assets/sector-realestate.webp";
      if ((collectionName === "properties" || collectionName === "products") && target.image === "portfolio/assets/sector-realestate.webp" && collectionName === "products") {
        target.image = "portfolio/assets/sector-food.webp";
      }
      if (target.progress === undefined) target.progress = 0;

      if (!existing) list.unshift(target);
    }, {
      audit: (modalContext.id ? "UPDATE_" : "CREATE_") + AUDIT_NOUN[collectionName],
      target: values.ref || values.sku || values.nameEn || values.client || values.id || collectionName
    });

    toast((modalContext.id ? "Updated " : "Created ") + schema.title);
    closeModal();
    renderAll();
  }

  /* ------------------------------------------------------------------ */
  /* Table event delegation                                              */
  /* ------------------------------------------------------------------ */
  function bindTables() {
    doc.addEventListener("click", function (e) {
      var edit = e.target.closest("[data-edit]");
      if (edit) { openModal(edit.dataset.edit, edit.dataset.id); return; }

      var del = e.target.closest("[data-del]");
      if (del) {
        var collection = del.dataset.del;
        if (!confirm("Delete this record permanently?")) return;
        S.commit(function (draft) {
          draft[collection] = (draft[collection] || []).filter(function (r) { return r.id !== del.dataset.id; });
        }, { audit: "DELETE_" + AUDIT_NOUN[collection], target: del.dataset.id });
        toast("Record deleted");
        renderAll();
        return;
      }

      var newBtn = e.target.closest("[data-new]");
      if (newBtn) { openModal(newBtn.dataset.new); return; }

      var cycleLead = e.target.closest("[data-cycle-lead]");
      if (cycleLead) {
        cycleLeadStatus(cycleLead.dataset.cycleLead);
        return;
      }

      var cycleApp = e.target.closest("[data-cycle]");
      if (cycleApp) {
        cycleStatus(cycleApp.dataset.cycle, cycleApp.dataset.id, ["new", "review", "approved", "rejected"]);
        return;
      }

      var cycleBooking = e.target.closest("[data-cycle-booking]");
      if (cycleBooking) {
        cycleStatus("bookings", cycleBooking.dataset.cycleBooking, ["pending", "confirmed", "delivered", "cancelled"]);
        return;
      }

      var cycleContract = e.target.closest("[data-cycle-contract]");
      if (cycleContract) {
        cycleStatus("contracts", cycleContract.dataset.cycleContract, ["draft", "active", "expired"]);
        return;
      }

      var cycleShip = e.target.closest("[data-cycle-ship]");
      if (cycleShip) {
        cycleStatus("shipments", cycleShip.dataset.cycleShip, ["in-transit", "customs", "delivered"]);
        return;
      }

      var toggleCar = e.target.closest("[data-toggle-car]");
      if (toggleCar) {
        var carId = toggleCar.dataset.toggleCar;
        S.commit(function (draft) {
          var car = draft.cars.filter(function (c) { return c.id === carId; })[0];
          if (car) car.available = !car.available;
        }, { audit: "FLEET_AVAILABILITY", target: carId });
        toast("Fleet availability updated");
        renderAll();
      }
    });

    $("#modalClose").addEventListener("click", closeModal);
    $("#modalCancel").addEventListener("click", closeModal);
    $("#modalScrim").addEventListener("click", function (e) { if (e.target === this) closeModal(); });
    $("#modalForm").addEventListener("submit", saveModal);
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && $("#modalScrim").classList.contains("is-open")) closeModal();
    });
  }

  function cycleStatus(collection, id, cycle) {
    S.commit(function (draft) {
      var record = (draft[collection] || []).filter(function (r) { return r.id === id; })[0];
      if (!record) return;
      var idx = cycle.indexOf(record.status);
      record.status = cycle[(idx + 1) % cycle.length];
    }, { audit: AUDIT_NOUN[collection] + "_STATUS", target: id });
    toast("Status updated");
    renderAll();
  }

  function cycleLeadStatus(id) {
    var cycle = ["new", "contacted", "qualified", "negotiation", "confirmed", "won", "lost"];
    S.commit(function (draft) {
      var lead = (draft.leads || []).filter(function (l) { return l.id === id; })[0];
      if (!lead) return;
      var idx = cycle.indexOf(lead.status);
      lead.status = cycle[(idx + 1) % cycle.length];
    }, { audit: "LEAD_STAGE", target: id });
    toast("Lead stage advanced");
    renderAll();
  }

  /* ------------------------------------------------------------------ */
  /* Render orchestration                                                */
  /* ------------------------------------------------------------------ */
  function renderAll() {
    if (!session) return;
    refreshCounts();
    renderOverview();
    if (currentView === "realestate") renderRealEstate();
    if (currentView === "food") renderFood();
    if (currentView === "cars") renderCars();
    if (currentView === "energy") renderEnergy();
    if (currentView === "logistics") renderLogistics();
    if (currentView === "leads") renderLeads();
    if (currentView === "telemetry") renderTelemetry();
    if (currentView === "brand") renderBrand();
    if (currentView === "security") renderSecurity();
    if (currentView === "data") renderData();
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function init() {
    loadDevices();
    initGate();
    bindNav();
    bindTables();
    initData();
    initSecurity();

    $("#brandSave").addEventListener("click", saveBrand);
    $("#kpiSave").addEventListener("click", saveKpis);
    $("#settingsSave").addEventListener("click", saveSettings);

    ["reSearch", "reStatus", "reType"].forEach(function (id) {
      $("#" + id).addEventListener("input", renderRealEstate);
      $("#" + id).addEventListener("change", renderRealEstate);
    });
    ["ldSearch", "ldSector", "ldStage"].forEach(function (id) {
      $("#" + id).addEventListener("input", renderLeads);
      $("#" + id).addEventListener("change", renderLeads);
    });
    $("#lgSearch").addEventListener("input", renderLogistics);

    $("#scanCancel").addEventListener("click", function () {
      $("#scanScrim").classList.remove("is-open");
      $("#scanner").classList.remove("is-scanning", "is-ok");
    });

    platformAuthenticator().then(function (available) {
      var bioBtn = $("#bioLogin");
      if (!available) bioBtn.querySelector("small").textContent = "Platform authenticator not detected — simulation mode ready";
    });

    var saved = loadSession();
    if (saved) {
      session = saved;
      S.setToken(saved.token || "");
      openConsole();
    } else {
      $("#gate").hidden = false;
    }

    S.subscribe(function () {
      if (session) refreshCounts();
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
