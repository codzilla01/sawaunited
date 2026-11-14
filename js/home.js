/* ==========================================================================
   SAWA UNITED GROUP — Public platform controller
   Renders every sector module from SAWAStore and keeps the page live while
   the super-admin console edits the same dataset in another tab.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SAWAStore;
  var doc = document;
  var lang = S.lang();
  var state = S.data;

  /* ------------------------------------------------------------------ */
  /* Utilities                                                           */
  /* ------------------------------------------------------------------ */
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function esc(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function ico(name, size) {
    var flip = name === "arrow" ? ' class="arw-ico"' : "";
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" aria-hidden="true"' + flip + '><use href="#i-' + name + '"/></svg>';
  }
  function t(key) { return S.t(key); }
  function pick(obj) { return S.pick(obj, lang); }
  function money(v) { return S.money(v, lang); }
  function compact(v) { return S.compact(v); }
  function num(v) {
    try { return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : lang === "fr" ? "fr-FR" : "en-US").format(v); }
    catch (e) { return String(v); }
  }

  var toastTimer = null;
  function toast(message) {
    var box = $("#toast");
    if (!box) return;
    $("#toastText").textContent = message;
    box.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.classList.remove("is-open"); }, 4200);
  }

  function goWhatsApp(message, sector) {
    try { S.logWhatsApp(message, sector); } catch (e) { /* non-blocking */ }
    window.open(S.waLink(message), "_blank", "noopener");
  }

  function waMessage(lines) {
    var head = lang === "ar" ? "طلب جديد من موقع مجموعة سوا يونيتد" : lang === "fr" ? "Nouvelle demande — SAWA UNITED GROUP" : "New enquiry — SAWA UNITED GROUP";
    return head + "\n" + lines.filter(Boolean).join("\n");
  }

  /* ------------------------------------------------------------------ */
  /* Language                                                            */
  /* ------------------------------------------------------------------ */
  function applyStatic() {
    doc.documentElement.lang = lang;
    doc.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      var value = S.t(key);
      if (typeof value === "string") node.textContent = value;
    });
    $$(".lang-switch button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
    var title = S.pick(state.content.seoTitle, lang);
    var desc = S.pick(state.content.seoDescription, lang);
    doc.title = title;
    var md = $('meta[name="description"]');
    if (md) md.setAttribute("content", desc);
    var ogt = $("#ogTitle"), ogd = $("#ogDescription");
    if (ogt) ogt.setAttribute("content", title);
    if (ogd) ogd.setAttribute("content", desc);
    var cta = $("#headerCtaLabel");
    if (cta) cta.textContent = t("navCta");
    [$("#dockHome")].forEach(function (n) { if (n) n.classList.toggle("is-active", window.scrollY < 400); });
  }

  function setLang(next) {
    lang = next;
    try { localStorage.setItem("sawa_lang", next); } catch (e) { /* ignore */ }
    applyStatic();
    renderAll();
  }

  /* ------------------------------------------------------------------ */
  /* Header / chrome                                                     */
  /* ------------------------------------------------------------------ */
  function initChrome() {
    var header = $("#siteHeader");
    var sections = ["ecosystem", "realestate", "food", "cars", "energy", "logistics"];

    function onScroll() {
      header.classList.toggle("is-stuck", window.scrollY > 12);
      var y = window.scrollY + 140;
      var current = "";
      sections.forEach(function (id) {
        var node = doc.getElementById(id);
        if (node && node.offsetTop <= y) current = id;
      });
      $$("#navDesktop a").forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    $$(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(btn.dataset.lang); });
    });

    var scrim = $("#sheetScrim"), sheet = $("#sheet");
    function openSheet() {
      scrim.hidden = false; sheet.hidden = false;
      requestAnimationFrame(function () {
        scrim.classList.add("is-open");
        sheet.classList.add("is-open");
      });
      doc.body.classList.add("is-locked");
      $("#sheetClose").focus();
    }
    function closeSheet() {
      sheet.classList.remove("is-open");
      scrim.classList.remove("is-open");
      doc.body.classList.remove("is-locked");
      setTimeout(function () { sheet.hidden = true; scrim.hidden = true; }, 340);
    }
    $("#sheetClose").addEventListener("click", closeSheet);
    scrim.addEventListener("click", closeSheet);
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
    $("#quickBtn").addEventListener("click", function () { renderSheet(); openSheet(); });
    $("#dockCall").addEventListener("click", function () { renderSheet(); openSheet(); });
    $("#dockBook").addEventListener("click", function () {
      doc.getElementById("cars").scrollIntoView({ behavior: "smooth", block: "start" });
      toast(t("bookNow") + " · " + t("carsTitle"));
    });
    window.SAWA_OPEN_SHEET = function () { renderSheet(); openSheet(); };
    window.SAWA_TOAST = toast;
  }

  function renderSheet() {
    var list = $("#sheetList");
    var msg = waMessage([lang === "ar" ? "أرغب في التحدث مع مستشار المجموعة." : lang === "fr" ? "Je souhaite parler à un conseiller." : "I would like to speak with a group advisor."]);
    list.innerHTML = [
      { icon: "wa", href: S.waLink(msg), title: t("quickWa"), sub: S.data.settings.phone, external: true },
      { icon: "phone", href: "tel:" + S.data.settings.phoneRaw, title: t("quickCall"), sub: S.data.settings.phone, external: false },
      { icon: "calendar", href: "#realestate", title: t("quickVisit"), sub: t("estateTitle"), external: false },
      { icon: "doc", href: "#logistics", title: t("quickQuote"), sub: t("logisticsTitle"), external: false },
      { icon: "mail", href: "mailto:" + S.data.settings.email, title: S.data.settings.email, sub: t("contactEmail"), external: false }
    ].map(function (item) {
      return '<a class="quick-item" href="' + esc(item.href) + '"' + (item.external ? ' target="_blank" rel="noopener noreferrer"' : "") + '>' +
        '<span class="ico">' + ico(item.icon, 18) + '</span>' +
        '<span><b>' + esc(item.title) + '</b><small>' + esc(item.sub) + '</small></span>' +
        '<span class="arw">' + ico("arrow", 15) + '</span></a>';
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* Hero + portal                                                       */
  /* ------------------------------------------------------------------ */
  var portalIndex = 0;
  var portalTimer = null;
  var portalPaused = false;

  function renderHero() {
    var c = state.content;
    $("#heroEyebrow").textContent = pick(c.heroEyebrow);
    $("#heroTitleA").textContent = pick(c.heroTitleA);
    $("#heroTitleB").textContent = pick(c.heroTitleB);
    $("#heroLead").textContent = pick(c.heroLead);
    $("#heroHq").textContent = pick(state.settings.hq);
    $("#heroHours").textContent = pick(state.settings.hours);
    $("#contactHq").textContent = pick(state.settings.hq);
    $("#contactHours").textContent = pick(state.settings.hours);
    $("#contactPhone").textContent = state.settings.phone;
    var year = new Date().getFullYear();
    $("#copyYear").textContent = String(year);

    var track = $("#tickerTrack");
    if (track) {
      var words = [];
      state.sectors.forEach(function (s) { words.push(pick(s.name)); });
      words.push(pick(state.settings.tagline));
      words.push(pick(state.settings.hq));
      var html = words.concat(words).map(function (w) { return "<span>" + esc(w) + "</span>"; }).join("");
      track.innerHTML = html;
    }
  }

  function renderPortal() {
    var list = state.sectors;
    if (portalIndex >= list.length) portalIndex = 0;
    var sector = list[portalIndex];
    var card = $("#portalCard");
    card.setAttribute("data-sector", sector.id);
    card.style.setProperty("--sector", sector.accent);

    var imgA = $("#portalImgA"), imgB = $("#portalImgB");
    var useA = imgA.classList.contains("is-live");
    var incoming = useA ? imgB : imgA;
    var outgoing = useA ? imgA : imgB;
    incoming.hidden = false;
    incoming.src = sector.image;
    incoming.classList.remove("is-live");
    requestAnimationFrame(function () {
      incoming.classList.add("is-live");
      outgoing.classList.remove("is-live");
    });
    setTimeout(function () { outgoing.hidden = true; }, 950);

    $("#portalIndex").textContent = sector.no;
    $("#portalSector").textContent = pick(sector.tagline);
    $("#portalName").textContent = pick(sector.name);
    $("#portalDesc").textContent = pick(sector.desc);
    $("#portalStats").innerHTML = sector.stats.map(function (st) {
      return '<div class="portal-stat"><b dir="ltr">' + esc(st.value) + '</b><span>' + esc(pick(st.label)) + '</span></div>';
    }).join("");
    var link = $("#portalLink");
    link.href = "#" + sector.id;
    link.querySelector("span").textContent = t("explore");

    $$("#portalTabs .portal-tab").forEach(function (tab, i) {
      tab.setAttribute("aria-selected", String(i === portalIndex));
    });
  }

  function renderPortalTabs() {
    var icons = { realestate: "building", food: "leaf", cars: "car", energy: "fuel", logistics: "ship" };
    $("#portalTabs").innerHTML = state.sectors.map(function (s, i) {
      return '<button type="button" class="portal-tab" role="tab" aria-selected="' + (i === portalIndex) + '" data-i="' + i + '">' +
        ico(icons[s.id] || "grid", 18) + '<span>' + esc(pick(s.short)) + '</span></button>';
    }).join("");
    $$("#portalTabs .portal-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        portalIndex = Number(tab.dataset.i);
        renderPortal();
        restartPortalTimer();
      });
    });
  }

  function restartPortalTimer() {
    clearInterval(portalTimer);
    portalTimer = setInterval(function () {
      if (portalPaused || doc.hidden) return;
      portalIndex = (portalIndex + 1) % state.sectors.length;
      renderPortal();
    }, 7200);
  }

  /* ------------------------------------------------------------------ */
  /* KPI                                                                 */
  /* ------------------------------------------------------------------ */
  function renderKpis() {
    $("#kpiStrip").innerHTML = state.kpis.map(function (k) {
      return '<div class="kpi"><b><span class="kpi-num" data-to="' + k.value + '" dir="ltr">0</span><i>' + esc(k.suffix) + '</i></b>' +
        '<span>' + esc(pick(k.label)) + '</span></div>';
    }).join("");
    $$(".kpi-num").forEach(function (node) {
      var target = Number(node.dataset.to) || 0;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / 1100, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = num(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Bento                                                               */
  /* ------------------------------------------------------------------ */
  function renderBento() {
    var tags = {
      realestate: ["New Cairo", "New Capital", "North Coast"],
      food: ["Sawa Select", "FMCG", "Fresh produce"],
      cars: ["Pay on delivery", "Chauffeur", "Corporate"],
      energy: ["MGO 10ppm", "Gasoil", "Contracts"],
      logistics: ["Sea · Air · Land", "Customs", "12+ countries"]
    };
    $("#bentoGrid").innerHTML = state.sectors.map(function (s) {
      return '<a class="bento-card" href="#' + s.id + '" style="--sector:' + s.accent + '">' +
        '<img src="' + esc(s.image) + '" alt="" loading="lazy" decoding="async" width="800" height="600">' +
        '<span class="bento-num">' + esc(s.no) + ' / 05</span>' +
        '<h3>' + esc(pick(s.name)) + '</h3>' +
        '<p>' + esc(pick(s.tagline)) + '</p>' +
        '<div class="bento-tags">' + (tags[s.id] || []).map(function (tag) { return '<span class="bento-tag">' + esc(tag) + '</span>'; }).join("") + '</div>' +
        '<span class="bento-go">' + ico("arrow", 15) + '</span></a>';
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* 01 — Real estate                                                    */
  /* ------------------------------------------------------------------ */
  var propFilter = { status: "all", city: "all", type: "all" };
  var activeProperty = null;

  var TYPE_KEYS = {
    apartment: "typeApartment", villa: "typeVilla", office: "typeOffice",
    commercial: "typeCommercial", chalet: "typeChalet", land: "typeLand", penthouse: "typePenthouse"
  };
  var STATUS_KEYS = { available: "available", reserved: "reserved", sold: "sold" };

  function renderJourney() {
    $("#journeyGrid").innerHTML = state.journey.map(function (step) {
      return '<div class="journey-step"><span class="n">' + esc(step.no) + '</span>' +
        '<h4>' + esc(pick(step.title)) + '</h4><p>' + esc(pick(step.copy)) + '</p></div>';
    }).join("");
  }

  function renderPropFilters() {
    var chips = [{ id: "all", label: t("all") }].concat(["available", "reserved", "sold"].map(function (s) {
      return { id: s, label: t(STATUS_KEYS[s]) };
    }));
    $("#propStatusChips").innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-status="' + c.id + '" aria-pressed="' + (propFilter.status === c.id) + '">' + esc(c.label) + '</button>';
    }).join("");
    $$("#propStatusChips .chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        propFilter.status = btn.dataset.status;
        renderPropFilters();
        renderProperties();
      });
    });

    var cities = ["all"].concat(Object.keys(state.properties.reduce(function (acc, p) { acc[p.city] = 1; return acc; }, {})));
    $("#propCity").innerHTML = cities.map(function (c) {
      return '<option value="' + esc(c) + '"' + (propFilter.city === c ? " selected" : "") + '>' + (c === "all" ? esc(t("filterCity") + " — " + t("all")) : esc(c)) + '</option>';
    }).join("");

    var types = ["all"].concat(Object.keys(TYPE_KEYS));
    $("#propType").innerHTML = types.map(function (ty) {
      return '<option value="' + esc(ty) + '"' + (propFilter.type === ty ? " selected" : "") + '>' + (ty === "all" ? esc(t("filterType") + " — " + t("all")) : esc(t(TYPE_KEYS[ty]))) + '</option>';
    }).join("");
  }

  function filteredProperties() {
    return state.properties.filter(function (p) {
      if (propFilter.status !== "all" && p.status !== propFilter.status) return false;
      if (propFilter.city !== "all" && p.city !== propFilter.city) return false;
      if (propFilter.type !== "all" && p.type !== propFilter.type) return false;
      return true;
    });
  }

  function renderProperties() {
    var list = filteredProperties();
    $("#propCount").textContent = num(list.length);
    $("#propEmpty").hidden = list.length > 0;
    $("#propertyGrid").innerHTML = list.map(function (p) {
      var monthly = Math.round(((p.price * (1 - p.down / 100)) / (p.years * 12)) / 1000) * 1000;
      return '<article class="prop-card" data-id="' + esc(p.id) + '">' +
        '<div class="prop-media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(pick(p.title)) + '" loading="lazy" decoding="async" width="800" height="500">' +
          '<span class="prop-status" data-status="' + esc(p.status) + '">' + esc(t(STATUS_KEYS[p.status])) + '</span>' +
          '<span class="prop-ref" dir="ltr">' + esc(p.ref) + '</span>' +
        '</div>' +
        '<div class="prop-body">' +
          '<span class="prop-city">' + esc(p.city) + ' · ' + esc(pick(p.district)) + '</span>' +
          '<h3 class="prop-title">' + esc(pick(p.title)) + '</h3>' +
          '<div class="prop-specs">' +
            '<span>' + ico("maximize", 13) + '<span dir="ltr">' + num(p.area) + ' m²</span></span>' +
            (p.beds ? '<span>' + ico("bed", 13) + '<span>' + num(p.beds) + '</span></span>' : '') +
            (p.baths ? '<span>' + ico("bath", 13) + '<span>' + num(p.baths) + '</span></span>' : '') +
            '<span>' + ico("calendar", 13) + '<span>' + esc(p.handover) + '</span></span>' +
          '</div>' +
          '<div class="prop-foot">' +
            '<div class="prop-price"><b dir="ltr">' + esc(money(p.price)) + '</b>' +
              '<span>' + num(monthly) + ' ' + esc(t("perMonth")) + ' · ' + num(p.years) + ' ' + esc(t("yearsLabel")) + '</span></div>' +
            '<div class="prop-actions">' +
              '<button class="mini-btn" type="button" data-act="calc" aria-label="' + esc(t("roiTitle")) + '">' + ico("calc", 15) + '</button>' +
              '<button class="mini-btn" type="button" data-act="book" aria-label="' + esc(t("bookVisit")) + '">' + ico("wa", 15) + '</button>' +
            '</div>' +
          '</div>' +
        '</div></article>';
    }).join("");

    $$("#propertyGrid .prop-card").forEach(function (card) {
      var property = state.properties.filter(function (p) { return p.id === card.dataset.id; })[0];
      card.addEventListener("click", function (e) {
        var act = e.target.closest("[data-act]");
        selectProperty(property, act ? act.dataset.act : "calc");
      });
    });
    renderPropMap(list);
  }

  function selectProperty(property, action) {
    if (!property) return;
    activeProperty = property;
    $("#roiPrice").value = property.price;
    $("#roiDown").value = property.down;
    $("#roiYears").value = property.years;
    renderRoi();
    $$("#propMap .map-pin").forEach(function (pin) {
      pin.classList.toggle("is-live", pin.dataset.id === property.id);
    });
    if (action === "book") {
      goWhatsApp(waMessage([
        (lang === "ar" ? "الوحدة: " : lang === "fr" ? "Bien : " : "Asset: ") + pick(property.title) + " (" + property.ref + ")",
        (lang === "ar" ? "المدينة: " : lang === "fr" ? "Ville : " : "City: ") + property.city,
        (lang === "ar" ? "السعر: " : lang === "fr" ? "Prix : " : "Price: ") + money(property.price),
        (lang === "ar" ? "أرغب في حجز زيارة." : lang === "fr" ? "Je souhaite réserver une visite." : "I would like to book a viewing.")
      ]), "realestate");
    } else {
      toast(pick(property.title) + " → " + t("roiTitle"));
    }
  }

  function rangeFill(input) {
    var pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty("--fill", pct + "%");
  }

  function renderRoi() {
    var price = Number($("#roiPrice").value);
    var down = Number($("#roiDown").value);
    var years = Number($("#roiYears").value);
    var rentPct = Number($("#roiRent").value);

    [$("#roiPrice"), $("#roiDown"), $("#roiYears"), $("#roiRent")].forEach(rangeFill);

    var downAmount = price * (down / 100);
    var financed = price - downAmount;
    var monthly = Math.round(financed / (years * 12) / 1000) * 1000;
    var annualRent = price * (rentPct / 100);
    /* 8% running cost + 1.5% asset maintenance, measured against asset value */
    var net = annualRent * 0.92 - price * 0.015;
    var yieldPct = (net / price) * 100;

    $("#roiPriceOut").textContent = money(price);
    $("#roiDownOut").textContent = down + "%";
    $("#roiYearsOut").textContent = num(years) + " " + t("yearsLabel");
    $("#roiRentOut").textContent = money(Math.round(annualRent));
    $("#roiMonthly").textContent = money(monthly);
    $("#roiYield").textContent = (yieldPct > 0 ? yieldPct.toFixed(1) : "0.0") + "%";
    $("#roiTotal").textContent = money(price);
    $("#roiInvested").textContent = money(Math.round(downAmount));

    var cta = $("#roiCta");
    cta.onclick = function () {
      goWhatsApp(waMessage([
        (lang === "ar" ? "حاسبة الاستثمار — سوا يونيتد" : lang === "fr" ? "Simulation d’investissement — SAWA" : "Investment simulation — SAWA"),
        (lang === "ar" ? "السعر: " : lang === "fr" ? "Prix : " : "Price: ") + money(price) + " · " + t("downPayment") + " " + down + "% · " + years + " " + t("yearsLabel"),
        (lang === "ar" ? "القسط الشهري التقديري: " : lang === "fr" ? "Mensualité estimée : " : "Est. monthly: ") + money(monthly),
        (lang === "ar" ? "أرغب في حجز زيارة." : lang === "fr" ? "Je souhaite réserver une visite." : "I would like to book a viewing.")
      ]), "realestate");
    };
  }

  function renderPropMap(list) {
    var plane = $("#propMap");
    var base = plane.querySelector("img");
    plane.innerHTML = "";
    if (base) plane.appendChild(base);
    var lats = state.properties.map(function (p) { return p.lat; });
    var lngs = state.properties.map(function (p) { return p.lng; });
    var minLat = Math.min.apply(null, lats) - 0.08, maxLat = Math.max.apply(null, lats) + 0.08;
    var minLng = Math.min.apply(null, lngs) - 0.12, maxLng = Math.max.apply(null, lngs) + 0.12;

    (list || state.properties).forEach(function (p) {
      var x = ((p.lng - minLng) / (maxLng - minLng)) * 100;
      var y = 100 - ((p.lat - minLat) / (maxLat - minLat)) * 100;
      var pin = doc.createElement("button");
      pin.type = "button";
      pin.className = "map-pin" + (activeProperty && activeProperty.id === p.id ? " is-live" : "");
      pin.dataset.id = p.id;
      /* Geographic coordinates must stay unmirrored in RTL. */
      pin.style.left = Math.max(6, Math.min(94, x)) + "%";
      pin.style.top = Math.max(14, Math.min(94, y)) + "%";
      pin.innerHTML = '<span class="pin-head"></span><span>' + esc(pick(p.title)) + '</span>';
      pin.addEventListener("click", function () { selectProperty(p, "calc"); });
      plane.appendChild(pin);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 02 — Food                                                           */
  /* ------------------------------------------------------------------ */
  var foodCat = "all";

  var FOOD_CATS = [
    { id: "all", key: "catAll" },
    { id: "staples", key: "catStaples" },
    { id: "beverages", key: "catBeverages" },
    { id: "dairy", key: "catDairy" },
    { id: "fresh", key: "catFresh" },
    { id: "frozen", key: "catFrozen" }
  ];

  function renderFood() {
    var flagship = state.products.filter(function (p) { return p.flagship; });
    $("#flagshipGrid").className = "flagship snap-row rv is-in";
    $("#flagshipGrid").innerHTML = flagship.map(function (p) {
      return '<article class="flag-card">' +
        '<img src="' + esc(p.image || "portfolio/assets/sector-food.webp") + '" alt="" loading="lazy" decoding="async" width="600" height="400">' +
        '<span class="tag">SELECT</span>' +
        '<h4>' + esc(pick(p.name)) + '</h4>' +
        '<p>' + esc(p.pack) + ' · SKU ' + esc(p.sku) + '</p></article>';
    }).join("");

    $("#foodCats").innerHTML = FOOD_CATS.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (foodCat === c.id) + '">' + esc(t(c.key)) + '</button>';
    }).join("");
    $$("#foodCats .chip").forEach(function (btn) {
      btn.addEventListener("click", function () { foodCat = btn.dataset.cat; renderFood(); });
    });

    var list = state.products.filter(function (p) { return foodCat === "all" || p.category === foodCat; });
    $("#foodCatalog").innerHTML = list.map(function (p) {
      var icons = { staples: "box", beverages: "leaf", dairy: "box", fresh: "leaf", frozen: "box" };
      return '<div class="prod">' +
        '<span class="prod-ico">' + ico(icons[p.category] || "box", 22) + '</span>' +
        '<div><div class="prod-name">' + esc(pick(p.name)) + '</div>' +
        '<div class="prod-meta" dir="ltr">' + esc(p.sku) + ' · ' + esc(p.pack) + ' · ' + esc(t("moq")) + ' ' + num(p.moq) + '</div></div>' +
        '<div class="prod-price"><b dir="ltr">' + esc(money(p.price)) + '</b><span>' + esc(t("casePrice")) + '</span></div>' +
        '</div>';
    }).join("");
  }

  var b2b = { step: 1, type: "", volume: 150000, company: "", contact: "", phone: "", market: "Egypt" };

  function tierFor(volume) {
    var tiers = state.wholesaleTiers.slice().sort(function (a, b) { return b.min - a.min; });
    for (var i = 0; i < tiers.length; i++) {
      if (volume >= tiers[i].min) return tiers[i];
    }
    return tiers[tiers.length - 1];
  }

  function renderB2B() {
    var host = $("#b2bStepper");
    var tier = tierFor(b2b.volume);
    var head = '<div class="step-label">' + esc(t("step")) + ' ' + b2b.step + ' / 3</div>' +
      '<div class="steps-head">' + [1, 2, 3].map(function (i) {
        return '<span class="sdot' + (i <= b2b.step ? " is-done" : "") + '"></span>';
      }).join("") + '</div>';

    var body = "";
    if (b2b.step === 1) {
      body = '<h3 class="step-title">' + esc(t("b2bStep1")) + '</h3><div class="opt-grid">' +
        state.wholesaleTiers.map(function (tr) {
          return '<button type="button" class="opt" data-type="' + tr.id + '" aria-pressed="' + (b2b.type === tr.id) + '">' +
            '<strong>' + esc(pick(tr.name)) + '</strong><small>' + esc(pick(tr.note)) + '</small>' +
            '<small style="color:var(--sector)">−' + tr.discount + '%</small></button>';
        }).join("") + '</div>' +
        '<div class="step-nav"><button class="btn btn--gold" type="button" data-next="1" ' + (b2b.type ? "" : "disabled") + '>' + esc(t("next")) + ico("arrow", 15) + '</button></div>';
    } else if (b2b.step === 2) {
      body = '<h3 class="step-title">' + esc(t("b2bStep2")) + '</h3>' +
        '<div class="field"><label for="b2bVol"><span>' + esc(t("monthlyVolume")) + '</span><b dir="ltr">' + money(b2b.volume) + '</b></label>' +
        '<input class="range" type="range" id="b2bVol" min="10000" max="600000" step="5000" value="' + b2b.volume + '"></div>' +
        '<div class="calc-out" style="margin-top:14px">' +
          '<div class="calc-cell"><b>' + esc(pick(tier.name)) + '</b><span>' + esc(t("b2bStep1")) + '</span></div>' +
          '<div class="calc-cell is-hero"><b dir="ltr">−' + tier.discount + '%</b><span>' + esc(t("tierDiscount")) + '</span></div>' +
          '<div class="calc-cell" style="grid-column:1/-1"><b dir="ltr">' + money(Math.round(b2b.volume * (1 - tier.discount / 100))) + '</b><span>' + esc(t("indicativeValue")) + '</span></div>' +
        '</div>' +
        '<div class="step-nav"><button class="btn btn--ghost" type="button" data-prev="1">' + esc(t("back")) + '</button>' +
        '<button class="btn btn--gold" type="button" data-next="2">' + esc(t("next")) + ico("arrow", 15) + '</button></div>';
    } else {
      body = '<h3 class="step-title">' + esc(t("b2bStep3")) + '</h3>' +
        '<div class="form-grid">' +
          '<input class="input" id="b2bCompany" placeholder="' + esc(t("company")) + '" value="' + esc(b2b.company) + '" autocomplete="organization">' +
          '<input class="input" id="b2bContact" placeholder="' + esc(t("name")) + '" value="' + esc(b2b.contact) + '" autocomplete="name">' +
          '<input class="input" id="b2bPhone" placeholder="' + esc(t("phone")) + '" value="' + esc(b2b.phone) + '" inputmode="tel" autocomplete="tel" dir="ltr">' +
          '<select class="select" id="b2bMarket">' + ["Egypt", "Saudi Arabia", "UAE", "Kuwait", "Jordan", "Morocco"].map(function (m) {
            return '<option' + (b2b.market === m ? " selected" : "") + '>' + m + '</option>';
          }).join("") + '</select>' +
          '<button class="btn btn--wa btn--block" type="button" id="b2bSubmit">' + ico("wa", 16) + esc(t("submitWa")) + '</button>' +
        '</div>' +
        '<div class="step-nav"><button class="btn btn--ghost" type="button" data-prev="2">' + esc(t("back")) + '</button></div>' +
        '<div id="b2bDone"></div>';
    }
    host.innerHTML = head + body;

    var vol = $("#b2bVol");
    if (vol) {
      rangeFill(vol);
      vol.addEventListener("input", function () { b2b.volume = Number(vol.value); renderB2B(); });
    }
    $$("#b2bStepper [data-type]").forEach(function (btn) {
      btn.addEventListener("click", function () { b2b.type = btn.dataset.type; renderB2B(); });
    });
    $$("#b2bStepper [data-next]").forEach(function (btn) {
      btn.addEventListener("click", function () { b2b.step = Math.min(3, b2b.step + 1); renderB2B(); });
    });
    $$("#b2bStepper [data-prev]").forEach(function (btn) {
      btn.addEventListener("click", function () { b2b.step = Math.max(1, b2b.step - 1); renderB2B(); });
    });
    var submit = $("#b2bSubmit");
    if (submit) {
      submit.addEventListener("click", function () {
        b2b.company = ($("#b2bCompany") || {}).value || "";
        b2b.contact = ($("#b2bContact") || {}).value || "";
        b2b.phone = ($("#b2bPhone") || {}).value || "";
        b2b.market = ($("#b2bMarket") || {}).value || "Egypt";
        if (!b2b.phone) { toast(t("phone")); ($("#b2bPhone") || {}).focus && $("#b2bPhone").focus(); return; }
        S.submitApplication({
          company: b2b.company || "—", contact: b2b.contact || "—", phone: b2b.phone,
          market: b2b.market, type: b2b.type, volume: b2b.volume
        });
        $("#b2bDone").innerHTML = '<div class="alert" style="margin-top:12px">' + ico("check", 16) + '<span>' + esc(t("successLead")) + '</span></div>';
        goWhatsApp(waMessage([
          (lang === "ar" ? "طلب شراكة بالجملة — سوا فود" : lang === "fr" ? "Demande de partenariat B2B — Sawa Food" : "Wholesale partnership — Sawa Food"),
          (lang === "ar" ? "الشركة: " : lang === "fr" ? "Société : " : "Company: ") + (b2b.company || "—"),
          (lang === "ar" ? "نوع الشراكة: " : lang === "fr" ? "Type : " : "Type: ") + pick(tierFor(b2b.volume).name),
          (lang === "ar" ? "حجم الطلب الشهري: " : lang === "fr" ? "Volume mensuel : " : "Monthly volume: ") + money(b2b.volume),
          (lang === "ar" ? "السوق: " : lang === "fr" ? "Marché : " : "Market: ") + b2b.market,
          (lang === "ar" ? "الهاتف: " : lang === "fr" ? "Téléphone : " : "Phone: ") + b2b.phone
        ]), "food");
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 03 — Cars                                                           */
  /* ------------------------------------------------------------------ */
  var carCat = "all";
  var booking = { step: 1, category: "", carId: "", days: 7, city: "Cairo", date: "", name: "", phone: "", chauffeur: false };

  function carCategoryLabel(id) {
    var found = state.carCategories.filter(function (c) { return c.id === id; })[0];
    return found ? pick(found.label) : id;
  }

  function renderCars() {
    $("#carCats").innerHTML = state.carCategories.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (carCat === c.id) + '">' + esc(pick(c.label)) + '</button>';
    }).join("");
    $$("#carCats .chip").forEach(function (btn) {
      btn.addEventListener("click", function () { carCat = btn.dataset.cat; renderCars(); });
    });

    var list = state.cars.filter(function (c) { return carCat === "all" || c.category === carCat; });
    $("#fleetList").innerHTML = list.map(function (c) {
      return '<button type="button" class="car-row" data-car="' + esc(c.id) + '" aria-label="' + esc(pick(c.name)) + '">' +
        '<div class="car-main">' +
          '<span class="car-badge">' + ico("car", 20) + '</span>' +
          '<div style="min-width:0">' +
            '<div class="car-name">' + esc(pick(c.name)) + '</div>' +
            '<div class="car-meta"><span>' + esc(carCategoryLabel(c.category)) + '</span><span>' + num(c.seats) + ' ' + esc(t("seats")) + '</span><span>' + esc(c.transmission) + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="car-price">' +
          '<b dir="ltr">' + esc(money(c.daily)) + '</b><span>' + esc(t("perDay")) + '</span>' +
          '<span class="dot-avail' + (c.available ? "" : " is-off") + '">' + esc(c.available ? t("availableNow") : t("unavailableNow")) + '</span>' +
        '</div></button>';
    }).join("");

    $$("#fleetList .car-row").forEach(function (row) {
      row.addEventListener("click", function () {
        var car = state.cars.filter(function (c) { return c.id === row.dataset.car; })[0];
        booking.carId = car.id;
        booking.category = car.category;
        booking.step = 2;
        renderBooking();
        toast(pick(car.name) + " · " + money(car.daily) + " / " + t("perDay"));
      });
    });
    renderBooking();
  }

  function renderBooking() {
    var host = $("#carStepper");
    var steps = [t("b1"), t("b2"), t("b3"), t("b4"), t("b5"), t("b6")];
    var head = '<div class="step-label">' + esc(t("bookingTitle")) + ' · ' + booking.step + ' / 6</div>' +
      '<div class="steps-head">' + steps.map(function (_, i) {
        return '<span class="sdot' + (i + 1 <= booking.step ? " is-done" : "") + '"></span>';
      }).join("") + '</div>';

    var body = "";
    var car = state.cars.filter(function (c) { return c.id === booking.carId; })[0];

    if (booking.step === 1) {
      body = '<h3 class="step-title">' + esc(t("b1")) + '</h3><div class="opt-grid">' +
        state.carCategories.filter(function (c) { return c.id !== "all"; }).map(function (c) {
          return '<button type="button" class="opt" data-bcat="' + c.id + '" aria-pressed="' + (booking.category === c.id) + '"><strong>' + esc(pick(c.label)) + '</strong></button>';
        }).join("") + '</div>';
    } else if (booking.step === 2) {
      var pool = state.cars.filter(function (c) { return !booking.category || c.category === booking.category; });
      body = '<h3 class="step-title">' + esc(t("b2")) + '</h3><div class="opt-grid">' +
        pool.map(function (c) {
          return '<button type="button" class="opt" data-bcar="' + esc(c.id) + '" aria-pressed="' + (booking.carId === c.id) + '">' +
            '<strong>' + esc(pick(c.name)) + '</strong><small>' + esc(money(c.daily)) + ' · ' + esc(t("perDay")) + '</small></button>';
        }).join("") + '</div>';
    } else if (booking.step === 3) {
      body = '<h3 class="step-title">' + esc(t("b3")) + '</h3>' +
        '<div class="field"><label for="bkDays"><span>' + esc(t("days")) + '</span><b dir="ltr">' + booking.days + '</b></label>' +
        '<input class="range" type="range" id="bkDays" min="1" max="30" step="1" value="' + booking.days + '"></div>' +
        '<div class="chip-row" style="margin-top:14px">' + [3, 7, 14, 30].map(function (d) {
          return '<button type="button" class="chip" data-days="' + d + '" aria-pressed="' + (booking.days === d) + '">' + d + ' ' + esc(t("days")) + '</button>';
        }).join("") + '</div>' +
        (booking.days >= 30 ? '<div class="alert" style="margin-top:12px">' + ico("check", 16) + '<span>' + esc(t("perMonthC")) + ': ' + esc(money((car ? car.monthly : 0))) + '</span></div>' : "");
    } else if (booking.step === 4) {
      body = '<h3 class="step-title">' + esc(t("b4")) + '</h3>' +
        '<div class="form-grid">' +
          '<div class="field"><label for="bkCity"><span>' + esc(t("pickupCity")) + '</span></label>' +
          '<select class="select" id="bkCity">' + ["Cairo", "Giza", "Alexandria", "Dubai", "Abu Dhabi", "Casablanca"].map(function (cty) {
            return '<option' + (booking.city === cty ? " selected" : "") + '>' + cty + '</option>';
          }).join("") + '</select></div>' +
          '<div class="field"><label for="bkDate"><span>' + esc(t("pickupDate")) + '</span></label>' +
          '<input class="input" type="date" id="bkDate" value="' + esc(booking.date) + '"></div>' +
          '<button type="button" class="opt" data-chauffeur aria-pressed="' + booking.chauffeur + '"><strong>' + esc(t("chauffeur")) + '</strong><small>+ 1,200 ' + esc(state.settings.currency) + ' / ' + esc(t("days")) + '</small></button>' +
        '</div>';
    } else if (booking.step === 5) {
      body = '<h3 class="step-title">' + esc(t("b5")) + '</h3>' +
        '<div class="form-grid">' +
          '<input class="input" id="bkName" placeholder="' + esc(t("name")) + '" value="' + esc(booking.name) + '" autocomplete="name">' +
          '<input class="input" id="bkPhone" placeholder="' + esc(t("phone")) + '" value="' + esc(booking.phone) + '" inputmode="tel" autocomplete="tel" dir="ltr">' +
        '</div>';
    } else {
      var subtotal = (car ? car.daily * booking.days : 0) + (booking.chauffeur ? 1200 * booking.days : 0);
      var delivery = 750;
      body = '<h3 class="step-title">' + esc(t("b6")) + '</h3><div class="summary">' +
        '<div class="summary-row"><span>' + esc(t("b2")) + '</span><b>' + esc(car ? pick(car.name) : "—") + '</b></div>' +
        '<div class="summary-row"><span>' + esc(t("b3")) + '</span><b>' + num(booking.days) + ' ' + esc(t("days")) + '</b></div>' +
        '<div class="summary-row"><span>' + esc(t("pickupCity")) + '</span><b>' + esc(booking.city) + '</b></div>' +
        (booking.chauffeur ? '<div class="summary-row"><span>' + esc(t("chauffeur")) + '</span><b>+' + esc(money(1200 * booking.days)) + '</b></div>' : "") +
        '<div class="summary-row"><span>' + esc(t("deliveryFee")) + '</span><b>' + esc(money(delivery)) + '</b></div>' +
        '<div class="summary-row is-total"><span>' + esc(t("totalCod")) + '</span><b dir="ltr">' + esc(money(subtotal + delivery)) + '</b></div>' +
        '</div>' +
        '<div class="alert alert--warn" style="margin-top:12px">' + ico("card", 16) + '<span>' + esc(t("codNote")) + '</span></div>';
    }

    var nav = '<div class="step-nav">' +
      (booking.step > 1 ? '<button class="btn btn--ghost" type="button" data-bprev>' + esc(t("back")) + '</button>' : "") +
      (booking.step < 6
        ? '<button class="btn btn--gold" type="button" data-bnext>' + esc(t("next")) + ico("arrow", 15) + '</button>'
        : '<button class="btn btn--wa" type="button" id="bkConfirm">' + ico("wa", 16) + esc(t("confirmBooking")) + '</button>') +
      '</div>';

    host.innerHTML = head + body + nav;

    var daysInput = $("#bkDays");
    if (daysInput) {
      rangeFill(daysInput);
      daysInput.addEventListener("input", function () { booking.days = Number(daysInput.value); renderBooking(); });
    }
    $$("#carStepper [data-days]").forEach(function (b) {
      b.addEventListener("click", function () { booking.days = Number(b.dataset.days); renderBooking(); });
    });
    $$("#carStepper [data-bcat]").forEach(function (b) {
      b.addEventListener("click", function () { booking.category = b.dataset.bcat; booking.carId = ""; booking.step = 2; renderBooking(); });
    });
    $$("#carStepper [data-bcar]").forEach(function (b) {
      b.addEventListener("click", function () { booking.carId = b.dataset.bcar; renderBooking(); });
    });
    var ch = $("#carStepper [data-chauffeur]");
    if (ch) ch.addEventListener("click", function () { booking.chauffeur = !booking.chauffeur; renderBooking(); });
    var citySel = $("#bkCity"), dateInp = $("#bkDate");
    if (citySel) citySel.addEventListener("change", function () { booking.city = citySel.value; });
    if (dateInp) dateInp.addEventListener("change", function () { booking.date = dateInp.value; });
    var nameInp = $("#bkName"), phoneInp = $("#bkPhone");
    if (nameInp) nameInp.addEventListener("input", function () { booking.name = nameInp.value; });
    if (phoneInp) phoneInp.addEventListener("input", function () { booking.phone = phoneInp.value; });

    $$("#carStepper [data-bprev]").forEach(function (b) {
      b.addEventListener("click", function () { booking.step = Math.max(1, booking.step - 1); renderBooking(); });
    });
    $$("#carStepper [data-bnext]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (booking.step === 1 && !booking.category) { toast(t("b1")); return; }
        if (booking.step === 2 && !booking.carId) { toast(t("b2")); return; }
        if (booking.step === 5 && !booking.phone) { toast(t("phone")); return; }
        booking.step = Math.min(6, booking.step + 1);
        renderBooking();
      });
    });
    var confirm = $("#bkConfirm");
    if (confirm) {
      confirm.addEventListener("click", function () {
        var entry = S.submitBooking({
          customer: booking.name || "—", phone: booking.phone || "—",
          car: car ? pick(car.name) : "—", days: booking.days, city: booking.city,
          total: ((car ? car.daily * booking.days : 0) + (booking.chauffeur ? 1200 * booking.days : 0) + 750)
        });
        goWhatsApp(waMessage([
          (lang === "ar" ? "حجز سيارة — مشاري كارز" : lang === "fr" ? "Réservation — Mashary Cars" : "Booking — Mashary Cars"),
          (lang === "ar" ? "السيارة: " : lang === "fr" ? "Véhicule : " : "Car: ") + (car ? pick(car.name) : "—"),
          (lang === "ar" ? "المدة: " : lang === "fr" ? "Durée : " : "Duration: ") + booking.days + " " + t("days"),
          (lang === "ar" ? "الاستلام: " : lang === "fr" ? "Départ : " : "Pickup: ") + booking.city + (booking.date ? " · " + booking.date : ""),
          (lang === "ar" ? "الإجمالي: " : lang === "fr" ? "Total : " : "Total: ") + money(entry.total) + " — " + t("totalCod"),
          (lang === "ar" ? "الاسم: " : lang === "fr" ? "Nom : " : "Name: ") + (booking.name || "—") + " · " + (booking.phone || "")
        ]), "cars");
        toast(t("confirmBooking") + " · " + entry.id);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 04 — Energy                                                         */
  /* ------------------------------------------------------------------ */
  var energy = { productId: "", volume: 0, frequency: "monthly" };

  function renderEnergy() {
    if (!energy.productId && state.petroleum.length) {
      energy.productId = state.petroleum[0].id;
      energy.volume = state.petroleum[0].minOrder;
    }
    var product = state.petroleum.filter(function (p) { return p.id === energy.productId; })[0] || state.petroleum[0];
    var monthly = product.price * energy.volume;
    var max = product.minOrder * 12;

    $("#energyStepper").innerHTML =
      '<div class="step-label">' + esc(t("supplyCalc")) + '</div>' +
      '<h3 class="step-title">' + esc(t("energyTitle")) + '</h3>' +
      '<div class="form-grid">' +
        '<div class="field"><label for="enProduct"><span>' + esc(t("product")) + '</span></label>' +
        '<select class="select" id="enProduct">' + state.petroleum.map(function (p) {
          return '<option value="' + esc(p.id) + '"' + (p.id === product.id ? " selected" : "") + '>' + esc(pick(p.name)) + ' — ' + money(p.price) + ' / ' + esc(pick(p.unit)) + '</option>';
        }).join("") + '</select></div>' +
        '<div class="field"><label for="enVol"><span>' + esc(t("volume")) + '</span><b dir="ltr">' + num(energy.volume) + ' ' + esc(pick(product.unit)) + '</b></label>' +
        '<input class="range" type="range" id="enVol" min="' + product.minOrder + '" max="' + max + '" step="' + Math.max(1, Math.round(product.minOrder / 10)) + '" value="' + energy.volume + '"></div>' +
        '<div class="chip-row">' + ["weekly", "biweekly", "monthly"].map(function (f) {
          var key = f === "weekly" ? "weekly" : f === "biweekly" ? "biweekly" : "monthlyF";
          return '<button type="button" class="chip" data-freq="' + f + '" aria-pressed="' + (energy.frequency === f) + '">' + esc(t(key)) + '</button>';
        }).join("") + '</div>' +
        '<div class="calc-out">' +
          '<div class="calc-cell is-hero" style="grid-column:1/-1"><b dir="ltr">' + money(Math.round(monthly)) + '</b><span>' + esc(t("monthlyValue")) + '</span></div>' +
        '</div>' +
        '<button class="btn btn--gold btn--block" type="button" id="enCta">' + ico("doc", 16) + esc(t("requestContract")) + '</button>' +
      '</div>';

    $("#energyProducts").innerHTML = state.petroleum.map(function (p, i) {
      var pct = Math.max(12, Math.min(96, 100 - i * 11));
      return '<div class="gauge"><span class="gauge-name">' + esc(pick(p.name)) + '</span>' +
        '<span class="gauge-val" dir="ltr">' + money(p.price) + '</span>' +
        '<span class="gauge-bar"><i style="width:' + pct + '%"></i></span></div>';
    }).join("");

    var sel = $("#enProduct"), vol = $("#enVol");
    if (sel) sel.addEventListener("change", function () {
      energy.productId = sel.value;
      var p = state.petroleum.filter(function (x) { return x.id === sel.value; })[0];
      energy.volume = p ? p.minOrder : 0;
      renderEnergy();
    });
    if (vol) {
      rangeFill(vol);
      vol.addEventListener("input", function () { energy.volume = Number(vol.value); renderEnergy(); });
    }
    $$("#energyStepper [data-freq]").forEach(function (b) {
      b.addEventListener("click", function () { energy.frequency = b.dataset.freq; renderEnergy(); });
    });
    var cta = $("#enCta");
    if (cta) cta.addEventListener("click", function () {
      var freqKey = energy.frequency === "weekly" ? "weekly" : energy.frequency === "biweekly" ? "biweekly" : "monthlyF";
      goWhatsApp(waMessage([
        (lang === "ar" ? "طلب عرض عقد توريد — قطاع الطاقة" : lang === "fr" ? "Demande d’offre contractuelle — Énergie" : "Contract pricing request — Energy"),
        (lang === "ar" ? "المنتج: " : lang === "fr" ? "Produit : " : "Product: ") + pick(product.name),
        (lang === "ar" ? "الكمية الشهرية: " : lang === "fr" ? "Volume mensuel : " : "Monthly volume: ") + num(energy.volume) + " " + pick(product.unit),
        (lang === "ar" ? "الدورية: " : lang === "fr" ? "Fréquence : " : "Frequency: ") + t(freqKey),
        (lang === "ar" ? "القيمة التقديرية: " : lang === "fr" ? "Valeur estimée : " : "Est. value: ") + money(Math.round(monthly))
      ]), "energy");
      S.submitLead({ type: "supply", name: "B2B energy enquiry", phone: "—", sector: "energy", detail: pick(product.name) + " · " + num(energy.volume), value: Math.round(monthly) });
      toast(t("requestContract"));
    });
  }

  /* ------------------------------------------------------------------ */
  /* 05 — Logistics                                                      */
  /* ------------------------------------------------------------------ */
  var quote = { mode: "sea", origin: "Shanghai", destination: "Alexandria", weight: 12000 };

  function renderTracker() {
    var input = $("#shipInput");
    if (input && !input.value) input.placeholder = t("trackerPlaceholder");
  }

  function trackShipment() {
    var code = ($("#shipInput").value || "").trim().toUpperCase();
    if (!code) { toast(t("trackerPlaceholder")); return; }
    var ship = state.shipments.filter(function (s) { return s.id.toUpperCase() === code; })[0];
    var host = $("#shipResult");
    if (!ship) {
      host.innerHTML = '<div class="alert alert--warn" style="margin-top:12px">' + ico("search", 16) + '<span>' + esc(t("notFoundShipment")) + '</span></div>';
      return;
    }
    var statusKey = ship.status === "delivered" ? "delivered" : ship.status === "customs" ? "customs" : "inTransit";
    host.innerHTML =
      '<div class="ship-meta">' +
        '<span class="ship-pill is-status" dir="ltr">' + esc(ship.id) + '</span>' +
        '<span class="ship-pill">' + esc(ship.origin) + ' → ' + esc(ship.destination) + '</span>' +
        '<span class="ship-pill">' + esc(t(statusKey)) + '</span>' +
        '<span class="ship-pill">ETA ' + esc(ship.eta) + '</span>' +
      '</div>' +
      '<div class="progress-track"><i style="width:' + ship.progress + '%"></i></div>' +
      '<div class="timeline">' + ship.timeline.slice().reverse().map(function (item) {
        return '<div class="tl-item is-done"><span class="tl-dot"></span><div class="tl-body"><b>' + esc(pick(item.label)) + '</b><span dir="ltr">' + esc(item.at) + '</span></div></div>';
      }).join("") + '</div>' +
      '<div class="alert" style="margin-top:12px">' + ico("truck", 16) + '<span>' + esc(ship.client) + ' · ' + ship.progress + '%</span></div>';
  }

  function renderQuote() {
    var host = $("#quoteStepper");
    var modeCut = { sea: 0.22, air: 1.85, land: 0.34 };
    var modes = state.logistics.filter(function (m) { return ["sea", "air", "land"].indexOf(m.id) >= 0; });
    var perKg = modeCut[quote.mode] || 0.3;
    var base = quote.mode === "sea" ? 1800 : quote.mode === "air" ? 2400 : 1200;
    var estimate = Math.round((quote.weight * perKg + base) / 100) * 100;
    var transit = (modes.filter(function (m) { return m.id === quote.mode; })[0] || {}).transit || "—";

    host.innerHTML =
      '<div class="step-label">' + esc(t("quoteTitle")) + '</div>' +
      '<h3 class="step-title">' + esc(t("mode")) + '</h3>' +
      '<div class="mode-grid">' + modes.map(function (m) {
        var icon = m.id === "sea" ? "ship" : m.id === "air" ? "plane" : "truck";
        var modeKey = m.id === "sea" ? "modeSea" : m.id === "air" ? "modeAir" : "modeLand";
        return '<button type="button" class="mode" data-mode="' + m.id + '" aria-pressed="' + (quote.mode === m.id) + '">' +
          ico(icon, 18) + '<span>' + esc(t(modeKey)) + '</span><small>' + esc(m.transit) + ' ' + esc(m.unit) + '</small></button>';
      }).join("") + '</div>' +
      '<div class="form-grid" style="margin-top:12px">' +
        '<div class="form-row">' +
          '<input class="input" id="qOrigin" value="' + esc(quote.origin) + '" placeholder="' + esc(t("origin")) + '" aria-label="' + esc(t("origin")) + '">' +
          '<input class="input" id="qDest" value="' + esc(quote.destination) + '" placeholder="' + esc(t("destination")) + '" aria-label="' + esc(t("destination")) + '">' +
        '</div>' +
        '<div class="field"><label for="qWeight"><span>' + esc(t("weight")) + '</span><b dir="ltr">' + num(quote.weight) + '</b></label>' +
        '<input class="range" type="range" id="qWeight" min="100" max="60000" step="100" value="' + quote.weight + '"></div>' +
        '<div class="calc-out">' +
          '<div class="calc-cell is-hero"><b dir="ltr">' + money(estimate) + '</b><span>' + esc(t("estimate")) + '</span></div>' +
          '<div class="calc-cell"><b dir="ltr">' + esc(transit) + '</b><span>' + esc(t("days")) + '</span></div>' +
        '</div>' +
        '<button class="btn btn--gold btn--block" type="button" id="qCta">' + ico("wa", 16) + esc(t("requestQuote")) + '</button>' +
      '</div>';

    $$("#quoteStepper [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { quote.mode = b.dataset.mode; renderQuote(); });
    });
    var w = $("#qWeight");
    if (w) { rangeFill(w); w.addEventListener("input", function () { quote.weight = Number(w.value); renderQuote(); }); }
    var o = $("#qOrigin"), d = $("#qDest");
    if (o) o.addEventListener("change", function () { quote.origin = o.value; });
    if (d) d.addEventListener("change", function () { quote.destination = d.value; });
    var cta = $("#qCta");
    if (cta) cta.addEventListener("click", function () {
      goWhatsApp(waMessage([
        (lang === "ar" ? "عرض سعر شحن — سوا لوجستيكس" : lang === "fr" ? "Devis fret — SAWA Logistics" : "Freight quote — SAWA Logistics"),
        quote.origin + " → " + quote.destination,
        (lang === "ar" ? "الوسيلة: " : lang === "fr" ? "Mode : " : "Mode: ") + quote.mode.toUpperCase(),
        (lang === "ar" ? "الوزن: " : lang === "fr" ? "Poids : " : "Weight: ") + num(quote.weight) + " kg",
        (lang === "ar" ? "التقدير: " : lang === "fr" ? "Estimation : " : "Estimate: ") + money(estimate)
      ]), "logistics");
      S.submitLead({ type: "logistics", name: "Freight quote", phone: "—", sector: "logistics", detail: quote.origin + " → " + quote.destination, value: estimate });
      toast(t("requestQuote"));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Presence / values / footer                                          */
  /* ------------------------------------------------------------------ */
  function renderPresence() {
    $("#valueGrid").innerHTML = state.values.map(function (v) {
      return '<div class="val"><span class="val-ico">' + ico(v.icon || "shield", 17) + '</span>' +
        '<h4>' + esc(pick(v.title)) + '</h4><p>' + esc(pick(v.copy)) + '</p></div>';
    }).join("");

    var world = $("#worldMap");
    var img = world.querySelector("img");
    world.innerHTML = "";
    if (img) world.appendChild(img);
    state.countries.forEach(function (c) {
      var pin = doc.createElement("span");
      pin.className = "world-pin" + (c.hq ? " is-hq" : "");
      pin.style.left = c.x + "%";
      pin.style.top = c.y + "%";
      pin.dataset.label = pick(c.name);
      pin.title = pick(c.name);
      world.appendChild(pin);
    });
    var legend = doc.createElement("div");
    legend.className = "world-legend";
    legend.innerHTML = '<span><i class="hq"></i>' + esc(t("hqLabel")) + '</span><span><i></i>' + esc(t("officeLabel")) + '</span>';
    world.appendChild(legend);

    $("#footSectors").innerHTML = state.sectors.map(function (s) {
      return '<a href="#' + s.id + '">' + esc(pick(s.name)) + '</a>';
    }).join("");

    var note = $("#cloudNote");
    if (note) {
      var mode = S.cloud.mode === "php" ? "API · LIVE" : "LOCAL · SYNC";
      note.textContent = mode;
      note.style.color = S.cloud.mode === "php" ? "#6EE7A8" : "var(--gold-2)";
    }
  }

  /* ------------------------------------------------------------------ */
  /* Reveal + render orchestration                                       */
  /* ------------------------------------------------------------------ */
  var observer = null;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      $$(".rv").forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    }
    $$(".rv:not(.is-in)").forEach(function (n) { observer.observe(n); });
  }

  function renderAll() {
    applyStatic();
    renderHero();
    renderPortalTabs();
    renderPortal();
    renderKpis();
    renderBento();
    renderJourney();
    renderPropFilters();
    renderProperties();
    renderRoi();
    renderFood();
    renderB2B();
    renderCars();
    renderEnergy();
    renderTracker();
    renderQuote();
    renderPresence();
    renderSheet();
    $$("[data-wa-link]").forEach(function (a) {
      a.href = S.waLink();
    });
    observeReveals();
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function init() {
    state = S.data;
    initChrome();
    renderAll();
    restartPortalTimer();

    var portalCard = $("#portalCard");
    ["mouseenter", "touchstart", "focusin"].forEach(function (ev) {
      portalCard.addEventListener(ev, function () { portalPaused = true; }, { passive: true });
    });
    ["mouseleave", "focusout"].forEach(function (ev) {
      portalCard.addEventListener(ev, function () { portalPaused = false; });
    });

    $("#propCity").addEventListener("change", function (e) { propFilter.city = e.target.value; renderProperties(); });
    $("#propType").addEventListener("change", function (e) { propFilter.type = e.target.value; renderProperties(); });
    ["roiPrice", "roiDown", "roiYears", "roiRent"].forEach(function (id) {
      var node = $("#" + id);
      node.addEventListener("input", renderRoi);
    });
    $("#shipBtn").addEventListener("click", trackShipment);
    $("#shipInput").addEventListener("keydown", function (e) { if (e.key === "Enter") trackShipment(); });
    $("#customCarBtn").addEventListener("click", function () {
      goWhatsApp(waMessage([
        lang === "ar" ? "طلب سيارة مخصصة — مشاري كارز" : lang === "fr" ? "Demande de véhicule sur mesure — Mashary Cars" : "Bespoke vehicle request — Mashary Cars",
        lang === "ar" ? "الفئة/الموديل المطلوب: " : lang === "fr" ? "Catégorie / modèle : " : "Category / model: "
      ]), "cars");
      booking.step = 5;
      renderBooking();
    });

    /* Live sync: any console edit re-renders the relevant modules instantly. */
    S.subscribe(function (next) {
      var previousLang = lang;
      state = next;
      if (previousLang !== S.lang()) lang = S.lang();
      if (doc.querySelector("#propertyGrid .prop-card")) {
        renderHero();
        renderPortal();
        renderKpis();
        renderBento();
        renderPropFilters();
        renderProperties();
        renderFood();
        renderCars();
        renderEnergy();
        renderPresence();
      }
      observeReveals();
    });

    if (!S.cloud.online) {
      S.ready && S.ready.then(function () {
        setTimeout(function () { var n = $("#cloudNote"); if (n) renderPresence(); }, 400);
      });
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
