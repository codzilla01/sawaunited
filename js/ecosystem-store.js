/* ==========================================================================
   SAWA UNITED GROUP — Ecosystem store
   --------------------------------------------------------------------------
   One state, three persistence tiers, all optional and all safe to fail:
     1. localStorage  (instant, always available)
     2. PHP API       (api/ecosystem.php on Hostinger → api/data/ecosystem.json)
     3. JSON file     (manual export / import from the super-admin console)
   Any commit is broadcast to every open tab through BroadcastChannel + the
   native `storage` event, so /super-admin edits appear on the public site
   immediately — no refresh, no build step.
   ========================================================================== */
(function (global) {
  "use strict";

  var KEY = "sawa_ecosystem_v4";
  var LANG_KEY = "sawa_lang";
  /* Resolved relative to the page: "/super-admin/" pages override this with a
     `window.SAWA_API_BASE` script variable before this file loads. */
  var API = global.SAWA_API_BASE || "api/ecosystem.php";
  var CHANNEL = "sawa-ecosystem";

  var listeners = [];
  var channel = null;
  try {
    if ("BroadcastChannel" in global) channel = new BroadcastChannel(CHANNEL);
  } catch (e) { channel = null; }

  var state = null;
  var cloud = { mode: "local", online: false, message: "" };
  var token = "";  // set only through SAWAStore.setToken() after full auth

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
  }

  function uid(prefix) {
    var stamp = Date.now().toString(36).toUpperCase();
    var rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return (prefix || "ID") + "-" + stamp + rand;
  }

  function safeParse(raw) {
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function readLocal() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? safeParse(raw) : null;
    } catch (e) { return null; }
  }

  function writeLocal(data) {
    try {
      var raw = JSON.stringify(data);
      localStorage.setItem(KEY, raw);
      lastWritten = raw;
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Merge stored data over the seed so new seed fields appear after an
     update without wiping operator edits. Arrays replace when present. */
  function merge(base, patch) {
    if (!patch || typeof patch !== "object") return clone(base);
    var out = clone(base);
    Object.keys(patch).forEach(function (k) {
      var pv = patch[k];
      if (Array.isArray(pv)) {
        out[k] = clone(pv);
      } else if (pv && typeof pv === "object") {
        out[k] = merge(out[k] && typeof out[k] === "object" ? out[k] : {}, pv);
      } else if (pv !== undefined && pv !== null) {
        out[k] = pv;
      }
    });
    return out;
  }

  function language() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === "ar" || saved === "en" || saved === "fr") return saved;
    } catch (e) { /* ignore */ }
    return "ar";
  }

  function t(key, lang) {
    return global.SAWA_T(lang || language(), key);
  }

  /* Trilingual field reader: pick(obj) → string for the active language. */
  function pick(value, lang) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return value;
    var l = lang || language();
    return value[l] || value.en || value.ar || value.fr || "";
  }

  function money(value, lang) {
    var n = Number(value) || 0;
    var code = (state && state.settings && state.settings.currency) || "EGP";
    var locale = (lang || language()) === "ar" ? "ar-EG" : (lang || language()) === "fr" ? "fr-FR" : "en-US";
    try {
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n) + " " + code;
    } catch (e) {
      return n.toLocaleString() + " " + code;
    }
  }

  function compact(value) {
    var n = Number(value) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
    return String(n);
  }

  function waLink(message) {
    var phone = (state && state.settings && state.settings.whatsapp) || "201011225592";
    var base = "https://wa.me/" + phone;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  function openWa(message) {
    global.open(waLink(message), "_blank", "noopener");
  }

  /* ------------------------------------------------------------------ */
  /* Persistence                                                         */
  /* ------------------------------------------------------------------ */
  /* Storage events fire for every open tab, including the one that wrote the
     value. Track our own writes so a remote-merge can never clobber local truth. */
  var lastWritten = "";
  var lastRemoteSeen = 0;

  function localStamp() {
    try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; }
  }

  function notify(event) {
    var payload = { data: state, cloud: cloud, event: event || "update" };
    listeners.slice().forEach(function (fn) {
      try { fn(state, payload); } catch (e) { console.error("[sawa store]", e); }
    });
  }

  function broadcast(reason) {
    var message = { type: "sawa:eco", reason: reason || "update", at: Date.now(), sender: CLIENT_ID };
    if (channel) { try { channel.postMessage(message); } catch (e) { /* ignore */ } }
    try {
      localStorage.setItem("sawa_eco_ping", JSON.stringify(message));
    } catch (e) { /* ignore */ }
  }

  var CLIENT_ID = uid("tab");

  function applyRemote(data, reason) {
    if (!data) return;
    state = merge(global.SAWA_SEED, data);
    writeLocal(state);
    notify(reason || "remote");
  }

  function pullFromCloud() {
    if (!global.fetch) {
      cloud = { mode: "local", online: false, message: "fetch unavailable" };
      return Promise.resolve(false);
    }
    return fetch(API + "?action=load&t=" + Date.now(), { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (body) {
        if (!body || body.ok === false || !body.data) throw new Error((body && body.message) || "no dataset");
        cloud = { mode: "php", online: true, pulled: true, message: "Hostinger API connected" };
        if (!body.data && body.inbox) absorbInbox(body.inbox);
        if (!body.data) {
          notify("cloud-connected");
          return true;
        }
        var localRev = state && state.rev ? state.rev : 0;
        var remoteRev = body.data.rev || 0;
        if (remoteRev >= localRev) {
          applyRemote(body.data, "cloud");
        } else {
          /* Local edits are ahead of the file — push them up. */
          saveToCloud(true);
        }
        notify("cloud-connected");
        return true;
      })
      .catch(function (err) {
        cloud = { mode: "local", online: false, message: "Local mode — " + (err.message || "offline") };
        notify("offline");
        return false;
      });
  }

  /* Before the server has a full dataset, public submissions live in the PHP
     inbox files. Fold them into local state so the console shows real data. */
  function absorbInbox(inbox) {
    var map = { leads: "leads", bookings: "bookings", applications: "applications" };
    Object.keys(map).forEach(function (key) {
      var list = inbox[key];
      if (!Array.isArray(list) || !list.length) return;
      var target = state[map[key]] || [];
      var known = {};
      target.forEach(function (row) { known[row.id] = true; });
      list.forEach(function (row) { if (row && row.id && !known[row.id]) target.unshift(row); });
      state[map[key]] = target;
    });
    writeLocal(state);
  }

  function saveToCloud(silent) {
    if (!global.fetch) return Promise.resolve(false);
    var body = JSON.stringify({ action: "save", token: token, data: state });
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: body,
      cache: "no-store"
    })
      .then(function (res) { return res.json().catch(function () { return null; }); })
      .then(function (out) {
        if (out && out.ok) {
          cloud = { mode: "php", online: true, message: "Saved to Hostinger" };
          if (!silent) notify("saved-cloud");
          return true;
        }
        cloud = { mode: "local", online: false, message: (out && out.message) || "Server rejected the save" };
        if (!silent) notify("save-local");
        return false;
      })
      .catch(function (err) {
        cloud = { mode: "local", online: false, message: "Saved locally only — " + (err.message || "network") };
        if (!silent) notify("save-local");
        return false;
      });
  }

  /* ------------------------------------------------------------------ */
  /* Commit pipeline                                                     */
  /* ------------------------------------------------------------------ */
  function commit(mutator, options) {
    var opts = options || {};
    var draft = clone(state);
    var result = mutator(draft);
    draft.rev = (draft.rev || 0) + 1;
    draft.updatedAt = new Date().toISOString();
    if (opts.audit) {
      draft.audit = draft.audit || [];
      draft.audit.unshift({
        id: uid("AU"),
        at: draft.updatedAt,
        actor: (global.SAWA_ADMIN && global.SAWA_ADMIN.email) || "developer@sawaunited.net",
        action: opts.audit,
        target: opts.target || "",
        ip: "client"
      });
      draft.audit = draft.audit.slice(0, 200);
    }
    state = draft;
    writeLocal(state);
    notify("commit");
    broadcast(opts.audit || "commit");
    if (opts.cloud !== false && cloud.mode === "php") saveToCloud(true);
    return result;
  }

  function subscribe(fn) {
    listeners.push(fn);
    if (state) {
      try { fn(state, { cloud: cloud, event: "init" }); } catch (e) { console.error(e); }
    }
    return function () {
      listeners = listeners.filter(function (item) { return item !== fn; });
    };
  }

  /* ------------------------------------------------------------------ */
  /* Cross-tab + cross-page sync                                         */
  /* ------------------------------------------------------------------ */
  global.addEventListener("storage", function (event) {
    if (event.key === KEY && event.newValue) {
      if (event.newValue === lastWritten) return; // echo of our own write
      var next = safeParse(event.newValue);
      if (next && (next.rev || 0) >= (state.rev || 0)) {
        state = next;
        lastRemoteSeen = Date.now();
        notify("sync");
      }
    }
    /* Tokens are never picked up from storage automatically — a tab must
       authenticate for itself before it can write to the API. */
  });

  if (channel) {
    channel.addEventListener("message", function (event) {
      var msg = event.data || {};
      if (msg.type !== "sawa:eco" || msg.sender === CLIENT_ID) return;
      var fresh = readLocal();
      if (fresh) { state = fresh; notify("sync"); }
    });
  }

  /* Refresh when the tab regains focus (e.g. returning from the console). */
  global.addEventListener("focus", function () {
    var fresh = readLocal();
    if (fresh && state && (fresh.rev || 0) > (state.rev || 0) && Date.now() - lastRemoteSeen > 120) {
      state = fresh;
      notify("sync");
    }
  });

  /* ------------------------------------------------------------------ */
  /* Public API                                                          */
  /* ------------------------------------------------------------------ */
  state = merge(global.SAWA_SEED, readLocal());

  var ready = pullFromCloud();

  var SAWAStore = {
    ready: ready,
    get data() { return state; },
    get cloud() { return cloud; },
    KEY: KEY,
    lang: language,
    t: t,
    pick: pick,
    money: money,
    compact: compact,
    uid: uid,
    slug: slug,
    clone: clone,
    waLink: waLink,
    openWa: openWa,
    subscribe: subscribe,
    commit: commit,
    setToken: function (value) {
      token = value || "";
      try {
        if (token) localStorage.setItem("sawa_admin_token", token);
        else localStorage.removeItem("sawa_admin_token");
      } catch (e) { /* ignore */ }
    },
    getToken: function () { return token; },
    refresh: pullFromCloud,
    push: function () { return saveToCloud(false); },

    /* ---- Auth (PHP when available, deterministic local check as fallback) ---- */
    login: function (email, password) {
      if (!global.fetch) return localAuth(email, password);
      var body = JSON.stringify({ action: "login", email: email, password: password });
      return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, cache: "no-store" })
        .then(function (res) { return res.json(); })
        .catch(function () { return null; })
        .then(function (out) {
          if (out && out.ok && out.token) {
            SAWAStore.setToken(out.token);
            cloud = { mode: "php", online: true, message: "Authenticated by Hostinger API" };
            /* If the server had no dataset when the page loaded, re-probe now so
               the console works against the live API instead of LocalStorage. */
            if (!cloud.pulled) pullFromCloud();
            return { ok: true, token: out.token, role: out.role || "SUPER_DEVELOPER_ADMIN", source: "php" };
          }
          if (out && out.ok === false && out.code === "BAD_CREDENTIALS") {
            return { ok: false, message: out.message || "Invalid credentials", source: "php" };
          }
          /* Static preview / no PHP: verify locally against the seeded hash. */
          return localAuth(email, password);
        });
    },

    /* ---- Lead capture: works online (PHP) and offline (local state) ---- */
    submitLead: function (lead) {
      var entry = Object.assign(
        {
          id: uid("LD"),
          status: "new",
          source: "website",
          createdAt: new Date().toISOString()
        },
        lead
      );
      commit(function (draft) {
        draft.leads = draft.leads || [];
        draft.leads.unshift(entry);
      }, { audit: "LEAD_CAPTURE", target: entry.sector || entry.type || "website", cloud: false });

      if (global.fetch) {
        fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "lead", lead: entry }),
          cache: "no-store"
        }).catch(function () { /* local copy already kept */ });
      }
      return entry;
    },

    submitBooking: function (booking) {
      var entry = Object.assign({ id: uid("BK"), status: "pending", payment: "cod", createdAt: new Date().toISOString() }, booking);
      commit(function (draft) {
        draft.bookings = draft.bookings || [];
        draft.bookings.unshift(entry);
      }, { audit: "BOOKING_CREATE", target: entry.car || "fleet", cloud: false });
      if (global.fetch) {
        fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "booking", booking: entry }),
          cache: "no-store"
        }).catch(function () { /* ignore */ });
      }
      return entry;
    },

    submitApplication: function (app) {
      var entry = Object.assign({ id: uid("APP"), status: "new", createdAt: new Date().toISOString() }, app);
      commit(function (draft) {
        draft.applications = draft.applications || [];
        draft.applications.unshift(entry);
      }, { audit: "WHOLESALE_APPLICATION", target: entry.company || "food", cloud: false });
      return entry;
    },

    logWhatsApp: function (message, sector) {
      commit(function (draft) {
        draft.analytics = draft.analytics || {};
        draft.analytics.whatsappLog = draft.analytics.whatsappLog || [];
        draft.analytics.whatsappLog.unshift({
          at: new Date().toISOString(),
          sector: sector || "group",
          to: (state.settings && state.settings.whatsapp) || "",
          status: "sent",
          text: String(message || "").slice(0, 160)
        });
        draft.analytics.whatsappLog = draft.analytics.whatsappLog.slice(0, 60);
      }, { audit: "WHATSAPP_ROUTE", target: sector || "group", cloud: false });
    },

    /* ---- Import / export ---- */
    exportJSON: function () {
      return JSON.stringify(state, null, 2);
    },
    importJSON: function (text) {
      var parsed = safeParse(text);
      if (!parsed || typeof parsed !== "object") return { ok: false, message: "Invalid JSON file" };
      commit(function (draft) {
        var next = merge(global.SAWA_SEED, parsed);
        Object.keys(next).forEach(function (k) { draft[k] = next[k]; });
      }, { audit: "DATA_IMPORT", target: "ecosystem snapshot" });
      return { ok: true };
    },
    reset: function () {
      commit(function (draft) {
        var seed = clone(global.SAWA_SEED);
        Object.keys(seed).forEach(function (k) { draft[k] = seed[k]; });
        draft.rev = (draft.rev || 0) + 1;
      }, { audit: "DATA_RESET", target: "seed dataset" });
    }
  };

  /* Deterministic local auth — mirrors api/ecosystem.php's default hash.
     Only used when the PHP endpoint is unreachable (static preview). */
  function localAuth(email, password) {
    var cleanEmail = String(email || "").trim().toLowerCase();
    var cleanPass = String(password || "");
    return sha256(cleanEmail + ":" + cleanPass + ":" + "sawa-2026-dev-salt-9f3a").then(function (hash) {
      var expected = "3c4c30e941f00f50d4230e69a8d4a610766cb1d7cfb9be4970af2c2461b52d68";
      if (cleanEmail === "developer@sawaunited.net" && hash === expected) {
        var fake = "local." + btoa(JSON.stringify({ sub: cleanEmail, role: "SUPER_DEVELOPER_ADMIN", exp: Date.now() + 8 * 3600e3 }));
        SAWAStore.setToken(fake);
        cloud = { mode: "local", online: false, message: "Offline session — local mode" };
        return { ok: true, token: fake, role: "SUPER_DEVELOPER_ADMIN", source: "local" };
      }
      return { ok: false, message: "Invalid developer credentials", source: "local" };
    });
  }

  function sha256(text) {
    if (global.crypto && global.crypto.subtle) {
      var bytes = new TextEncoder().encode(text);
      return global.crypto.subtle.digest("SHA-256", bytes).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) {
          return ("00" + b.toString(16)).slice(-2);
        }).join("");
      }).catch(function () { return sha256Fallback(text); });
    }
    return Promise.resolve(sha256Fallback(text));
  }

  /* Compact synchronous SHA-256 for non-secure contexts where WebCrypto is
     unavailable (plain-HTTP previews). Mirrors the PHP/Python hash exactly. */
  function sha256Fallback(ascii) {
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    var mathPow = Math.pow, maxWord = mathPow(2, 32);
    var result = "", words = [], asciiBitLength = ascii.length * 8;
    var hash = sha256Fallback.h = sha256Fallback.h || [];
    var k = sha256Fallback.k = sha256Fallback.k || [];
    var primeCounter = k.length;
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (var i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += "\x80";
    while ((ascii.length % 64) !== 56) ascii += "\x00";
    for (i = 0; i < ascii.length; i++) {
      var j = ascii.charCodeAt(i);
      if (j >> 8) return ""; // ASCII only
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (j = 0; j < words.length;) {
      var w = words.slice(j, (j += 16));
      var oldHash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = i < 16 ? w[i] : (
              w[i - 16]
              + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
              + w[i - 7]
              + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
            ) | 0);
        var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? "0" : "") + b.toString(16);
      }
    }
    return result;
  }

  SAWAStore.sha256 = sha256;
  SAWAStore.sha256Fallback = sha256Fallback;
  global.SAWAStore = SAWAStore;
})(window);
