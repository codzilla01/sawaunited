# -*- coding: utf-8 -*-
import json, os
from sawa_data import BRAND, CONTENT

data_json = json.dumps(CONTENT, ensure_ascii=False).replace(".jpg", ".webp")

html = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title id="pageTitle">SAWA UNITED GROUP | Corporate Profile & Business Portfolio</title>
<meta name="description" id="metaDescription" content="Explore the SAWA UNITED GROUP corporate profile and business portfolio in Arabic and English.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="https://sawaunited.net/portfolio/">
<link rel="alternate" hreflang="ar" href="https://sawaunited.net/portfolio/?lang=ar">
<link rel="alternate" hreflang="en" href="https://sawaunited.net/portfolio/?lang=en">
<link rel="alternate" hreflang="x-default" href="https://sawaunited.net/portfolio/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SAWA UNITED GROUP">
<meta property="og:title" content="SAWA UNITED GROUP | Corporate Profile">
<meta property="og:description" content="Corporate profile and business portfolio in Arabic and English.">
<meta property="og:url" content="https://sawaunited.net/portfolio/">
<meta property="og:image" content="https://sawaunited.net/assets/sawa-header-logo.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/logo-transparent.png">
<link rel="stylesheet" href="../css/design-system.css">
<style>
:root {{
  --obsidian: #07090E;
  --obsidian2: #0D131D;
  --obsidian-card: #121A27;
  --obsidian-line: rgba(255,255,255,0.10);
  --ivory: #F7F5F0;
  --ivory2: #EFECE4;
  --ivory-card: #FFFFFF;
  --ivory-line: rgba(11,16,24,0.11);
  --gold: #D4A033;
  --gold-bright: #E3B85A;
  --gold-deep: #9E7215;
  --silver: #E8EEF5;
  --muted-dark: #94A3B8;
  --muted-light: #526071;
  --estate: #D4A033;
  --food: #22A45D;
  --car: #F26B3A;
  --oil: #2F7BEA;
  --font-head: 'Cairo', system-ui, sans-serif;
  --font-body: 'Cairo', system-ui, sans-serif;
}}
html[lang="en"] {{
  --font-head: 'Manrope', system-ui, sans-serif;
  --font-body: 'Manrope', system-ui, sans-serif;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  background: #05070B;
  color: #F4F7FB;
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-x: hidden;
}}
button, a {{ font-family: inherit; color: inherit; text-decoration: none; cursor: pointer; border: 0; background: none; }}

/* Top Command Bar */
.topbar {{
  position: sticky; top: 0; z-index: 100;
  background: rgba(7, 9, 14, 0.90);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(212, 160, 51, 0.28);
  padding: 10px 20px;
}}
.topbar-inner {{
  max-width: 1480px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
}}
.brand-id {{ display: flex; align-items: center; gap: 12px; }}
.brand-id img {{ height: 38px; width: auto; object-fit: contain; }}
.brand-txt strong {{ display: block; font-family: var(--font-head); font-size: 15px; font-weight: 800; color: #fff; line-height: 1.2; }}
.brand-txt span {{ font-size: 11.5px; color: var(--gold-bright); font-weight: 600; }}

.controls {{ display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }}
.home-link {{ display: inline-flex; align-items: center; min-height: 40px; padding: 6px 12px; border: 1px solid rgba(212,160,51,.32); border-radius: 999px; color: var(--gold-bright); font-size: 12px; font-weight: 800; white-space: nowrap; }}
.home-link:hover {{ background: rgba(212,160,51,.1); }}
.pill-group {{
  display: inline-flex; background: #101622; border: 1px solid rgba(255,255,255,0.10);
  border-radius: 999px; padding: 3px;
}}
.pill-group button {{
  padding: 6px 13px; border-radius: 999px; font-size: 12.5px; font-weight: 700; color: var(--muted-dark); transition: .2s;
}}
.pill-group button.active {{ background: var(--gold); color: #07090E; font-weight: 800; }}
.dl-btn {{
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg, #E3B85A, #C58F24);
  color: #07090E; font-weight: 800; font-size: 12.5px;
  padding: 8px 15px; border-radius: 999px;
  box-shadow: 0 8px 22px -6px rgba(212,160,51,0.55);
}}
.dl-btn:hover {{ filter: brightness(1.06); }}

/* Downloads Modal / Bar */
.dl-drawer {{
  display: none; background: #0D131E; border-bottom: 1px solid rgba(212,160,51,0.3);
  padding: 16px 20px;
}}
.dl-drawer.open {{ display: block; }}
.dl-drawer[hidden] {{ display: none !important; }}
.dl-grid {{
  max-width: 1480px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;
}}
.dl-card {{
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  background: #131C2B; border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;
  padding: 11px 14px; transition: .2s;
}}
.dl-card:hover {{ border-color: var(--gold); transform: translateY(-1px); }}
.dl-card b {{ display: block; font-size: 13px; color: #fff; }}
.dl-card small {{ font-size: 11.5px; color: var(--muted-dark); }}
.dl-badge {{
  font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800;
  padding: 4px 9px; border-radius: 6px; background: rgba(212,160,51,0.18); color: var(--gold-bright);
  flex-shrink: 0;
}}
.dl-badge.pptx {{ background: rgba(242,107,58,0.2); color: #FF8E66; }}

/* Stage Container */
.workspace {{ max-width: 1480px; margin: 0 auto; padding: 20px; }}
.deck-nav {{
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-bottom: 14px; flex-wrap: wrap;
}}
.nav-btns {{ display: flex; align-items: center; gap: 8px; }}
.nav-btn {{
  background: #121A27; border: 1px solid rgba(255,255,255,0.12);
  color: #fff; padding: 7px 14px; border-radius: 999px; font-size: 12.5px; font-weight: 700;
}}
.nav-btn:hover:not(:disabled) {{ border-color: var(--gold); color: var(--gold-bright); }}
.nav-btn:disabled {{ opacity: 0.35; cursor: default; }}
.counter {{ font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; color: var(--gold-bright); padding: 0 8px; direction: ltr; }}

.thumbs {{
  display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; max-width: 100%;
  scrollbar-width: thin;
}}
.thumb-dot {{
  padding: 5px 10px; border-radius: 8px; background: #101622; border: 1px solid rgba(255,255,255,0.08);
  font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; color: var(--muted-dark); white-space: nowrap;
}}
.thumb-dot.active {{ background: rgba(212,160,51,0.2); border-color: var(--gold); color: var(--gold-bright); }}

/* Slide Canvas (16:9 on Desktop, Fluid on Mobile) */
.slides-wrap.mode-stage .slide-frame {{ display: none; }}
.slides-wrap.mode-stage .slide-frame.active {{ display: flex; }}
.slides-wrap.mode-scroll {{ display: flex; flex-direction: column; gap: 28px; }}
.slides-wrap.mode-scroll .slide-frame {{ display: flex; }}

.slide-frame {{
  position: relative; width: 100%; aspect-ratio: 16 / 9;
  border-radius: 20px; overflow: hidden;
  border: 1px solid rgba(212,160,51,0.28);
  box-shadow: 0 32px 80px -24px rgba(0,0,0,0.85);
  flex-direction: column; justify-content: space-between;
  padding: clamp(18px, 2.4vw, 36px) clamp(20px, 3.2vw, 48px);
}}
.slide-frame::before {{
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--gold);
}}
.slide-frame.dark {{ background: var(--obsidian); color: #F4F7FB; }}
.slide-frame.light {{ background: var(--ivory); color: #0B1018; border-color: rgba(169,122,18,0.35); }}

.s-hdr, .s-ftr {{
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding-bottom: 10px; border-bottom: 1px solid var(--obsidian-line); flex-shrink: 0;
}}
.slide-frame.light .s-hdr, .slide-frame.light .s-ftr {{ border-color: var(--ivory-line); }}
.s-ftr {{ padding-bottom: 0; padding-top: 10px; border-bottom: 0; border-top: 1px solid var(--obsidian-line); font-size: 11.5px; color: var(--muted-dark); }}
.slide-frame.light .s-ftr {{ color: var(--muted-light); }}
.s-hdr-lbl {{ font-size: 11.5px; font-weight: 800; color: var(--gold-bright); letter-spacing: 0.03em; }}
.slide-frame.light .s-hdr-lbl {{ color: var(--gold-deep); }}
.mini-chip {{
  background: #080B11; border: 1px solid rgba(212,160,51,0.45); border-radius: 9px;
  padding: 4px 12px; display: inline-flex; align-items: center;
}}
.mini-chip img {{ height: 24px; width: auto; }}

.s-body {{ flex: 1; display: flex; flex-direction: column; justify-content: center; gap: clamp(10px, 1.3vw, 18px); padding: 10px 0; min-height: 0; }}
.kicker {{
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-head); font-size: 12px; font-weight: 800; color: var(--gold-bright);
}}
.slide-frame.light .kicker {{ color: var(--gold-deep); }}
.kicker::before {{ content: ""; width: 20px; height: 2.5px; background: var(--gold); display: inline-block; }}
.s-title {{ font-family: var(--font-head); font-size: clamp(20px, 2.15vw, 31px); font-weight: 800; line-height: 1.22; }}
.s-sub {{ font-size: clamp(12.5px, 1.05vw, 15px); color: var(--muted-dark); max-width: 920px; line-height: 1.5; }}
.slide-frame.light .s-sub {{ color: var(--muted-light); }}

/* Grid helpers */
.g2 {{ display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 18px; align-items: stretch; }}
.g2-eq {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }}
.g3 {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }}
.g4 {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 13px; }}
.g5 {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 11px; }}

.card {{
  border-radius: 14px; padding: clamp(12px, 1.3vw, 18px);
  background: var(--obsidian-card); border: 1px solid var(--obsidian-line);
}}
.slide-frame.light .card {{ background: var(--ivory-card); border-color: var(--ivory-line); }}
.card.dashed {{ border-style: dashed; border-color: var(--gold); background: rgba(212,160,51,0.05); }}

.photo-card {{
  position: relative; border-radius: 16px; overflow: hidden; border: 1px solid var(--gold);
  background-size: cover; background-position: center; min-height: 180px;
}}
.visual-note {{ position:absolute; inset-inline-start:10px; inset-block-end:10px; z-index:1; max-width:calc(100% - 20px); padding:5px 9px; border:1px solid rgba(255,255,255,.22); border-radius:999px; color:#fff; background:rgba(7,9,14,.78); font-size:10px; line-height:1.4; backdrop-filter:blur(8px); }}
.profile-diagram {{ position:relative; min-height:270px; display:grid; place-content:center; gap:14px; padding:24px; border:1px solid var(--gold); border-radius:16px; background:radial-gradient(ellipse at center,rgba(212,160,51,.12),transparent 70%),var(--obsidian-card); }}
.profile-diagram > strong {{ text-align:center; color:var(--gold-bright); font-size:15px; }}
.profile-diagram-grid {{ display:grid; grid-template-columns:1fr 1fr; gap:9px; }}
.profile-diagram-grid span {{ display:grid; place-items:center; min-height:58px; padding:8px; border:1px solid var(--obsidian-line); border-radius:10px; color:var(--silver); background:var(--obsidian); font-size:11px; text-align:center; }}
.ltr {{ direction: ltr; unicode-bidi: isolate; font-family: 'Manrope', sans-serif; display: inline-block; }}
.badge {{
  display: inline-block; padding: 3px 10px; border-radius: 999px;
  font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 800; color: #fff;
}}

.bar-track {{ width: 100%; height: 9px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden; margin-top: 5px; }}
.bar-fill {{ height: 100%; border-radius: 99px; }}

@media (max-width: 1024px) {{
  .slide-frame {{ aspect-ratio: auto; min-height: auto; gap: 16px; padding: 20px 16px; }}
  .g2, .g2-eq, .g3, .g4, .g5 {{ grid-template-columns: 1fr; }}
  .photo-card {{ min-height: 220px; }}
}}
@media print {{
  body {{ background: #000; }}
  .topbar, .dl-drawer, .deck-nav {{ display: none !important; }}
  .workspace {{ max-width: none; padding: 0; }}
  .slides-wrap.mode-stage .slide-frame {{ display: flex !important; }}
  .slide-frame {{ page-break-after: always; border-radius: 0; border: 0; box-shadow: none; width: 100vw; height: 100vh; }}
}}
</style>
</head>
<body class="portfolio-page">
<a class="skip-link" id="skipLink" href="#slidesContainer" style="position:fixed;top:12px;inset-inline-start:12px;z-index:300;transform:translateY(-180%);padding:10px 16px;border-radius:8px;background:#D4A033;color:#071018;font-weight:800;">تجاوز إلى المحتوى</a>

<header class="topbar">
  <div class="topbar-inner">
    <div class="brand-id">
      <img src="assets/logo-transparent.png" alt="SAWA UNITED">
      <div class="brand-txt">
        <strong id="topBrand">مجموعة سوا يونيتد</strong>
        <span id="topSub">Corporate Profile & Business Portfolio · 2026</span>
      </div>
    </div>
    <div class="controls">
      <a class="home-link" id="homeLink" href="/">الصفحة الرئيسية</a>
      <div class="pill-group" id="languageGroup" role="group" aria-label="Language">
        <button type="button" id="btnAr" class="active" aria-pressed="true" onclick="setLang('ar')">العربية (RTL)</button>
        <button type="button" id="btnEn" aria-pressed="false" onclick="setLang('en')">English (LTR)</button>
      </div>
      <div class="pill-group" id="editionGroup" role="group" aria-label="Edition">
        <button type="button" id="btnFull" class="active" aria-pressed="true" onclick="setDeck('full')"><span id="lblFull">البورتفوليو الكامل (18)</span></button>
        <button type="button" id="btnExec" aria-pressed="false" onclick="setDeck('exec')"><span id="lblExec">الملف التنفيذي (6)</span></button>
      </div>
      <div class="pill-group" id="viewModeGroup" role="group" aria-label="View Mode">
        <button type="button" id="btnStage" class="active" aria-pressed="true" onclick="setMode('stage')"><span id="lblStage">عرض شرائح 16:9</span></button>
        <button type="button" id="btnScroll" aria-pressed="false" onclick="setMode('scroll')"><span id="lblScroll">عرض متتالي</span></button>
      </div>
      <button type="button" class="dl-btn" id="downloadToggle" aria-controls="dlDrawer" aria-expanded="false" onclick="toggleDownloads()">
        <span aria-hidden="true">⬇</span> <span id="lblDl">تحميل PDF & PPTX</span>
      </button>
    </div>
  </div>
</header>

<section class="dl-drawer" id="dlDrawer" aria-label="Download documents" hidden>
  <div class="dl-grid">
    <a class="dl-card" href="SAWA-UNITED-Corporate-Portfolio-AR.pdf" download>
      <div><b>البورتفوليو المؤسسي الكامل (عربي)</b><small>18 صفحة · 16:9 Vector High-Res</small></div>
      <span class="dl-badge">PDF · AR</span>
    </a>
    <a class="dl-card" href="SAWA-UNITED-Corporate-Portfolio-EN.pdf" download>
      <div><b>Full Corporate Portfolio (English)</b><small>18 Pages · 16:9 Vector High-Res</small></div>
      <span class="dl-badge">PDF · EN</span>
    </a>
    <a class="dl-card" href="SAWA-UNITED-Corporate-Portfolio-AR.pptx" download>
      <div><b>نسخة PowerPoint قابلة للتعديل (عربي)</b><small>18 شريحة قابلة للتحرير الكامل RTL</small></div>
      <span class="dl-badge pptx">PPTX · AR</span>
    </a>
    <a class="dl-card" href="SAWA-UNITED-Corporate-Portfolio-EN.pptx" download>
      <div><b>Editable PowerPoint Deck (English)</b><small>18 Native Editable Slides LTR</small></div>
      <span class="dl-badge pptx">PPTX · EN</span>
    </a>
    <a class="dl-card" href="SAWA-UNITED-Executive-Profile-AR.pdf" download>
      <div><b>الملف التنفيذي المختصر (عربي)</b><small>6 صفحات للاجتماعات السريعة</small></div>
      <span class="dl-badge">EXEC PDF · AR</span>
    </a>
    <a class="dl-card" href="SAWA-UNITED-Executive-Profile-EN.pdf" download>
      <div><b>Executive Summary Profile (English)</b><small>6 Pages for Fast B2B Briefings</small></div>
      <span class="dl-badge">EXEC PDF · EN</span>
    </a>
    <a class="dl-card" href="SAWA-UNITED-Executive-Profile-AR.pptx" download>
      <div><b>الملف التنفيذي القابل للتعديل (عربي)</b><small>6 شرائح PowerPoint RTL</small></div>
      <span class="dl-badge pptx">EXEC PPTX · AR</span>
    </a>
    <a class="dl-card" href="SAWA-UNITED-Executive-Profile-EN.pptx" download>
      <div><b>Editable Executive Profile (English)</b><small>6 Native PowerPoint Slides</small></div>
      <span class="dl-badge pptx">EXEC PPTX · EN</span>
    </a>
  </div>
</section>

<main class="workspace">
  <div class="deck-nav" id="deckNav">
    <div class="nav-btns">
      <button class="nav-btn" id="prevBtn" onclick="stepSlide(-1)">◀</button>
      <span class="counter" id="slideCounter">01 / 18</span>
      <button class="nav-btn" id="nextBtn" onclick="stepSlide(1)">▶</button>
      <button class="nav-btn" onclick="goFullscreen()" id="fsBtn">⛶ ملء الشاشة</button>
    </div>
    <div class="thumbs" id="thumbsBar"></div>
  </div>

  <div class="slides-wrap mode-stage" id="slidesContainer"></div>
</main>

<style>.portfolio-page .skip-link:focus{{transform:translateY(0)}}.portfolio-page :focus-visible{{outline:3px solid #E3B85A;outline-offset:3px}}.portfolio-page .pill-group button:focus-visible,.portfolio-page .nav-btn:focus-visible,.portfolio-page .thumb-dot:focus-visible{{position:relative;z-index:1}}</style>
<script>
const DATA = {data_json};
const COLORS = {{
  estate: "#D4A033", food: "#22A45D", car: "#F26B3A", oil: "#2F7BEA", gold: "#D4A033"
}};

let curLang = "ar";
let curDeck = "full"; // "full" | "exec"
let curMode = "stage"; // "stage" | "scroll"
let curIdx = 0;

function esc(s) {{
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}}

function toggleDownloads() {{
  const button = document.getElementById("downloadToggle");
  const drawer = document.getElementById("dlDrawer");
  const isOpen = drawer.classList.toggle("open");
  drawer.hidden = !isOpen;
  button.setAttribute("aria-expanded", String(isOpen));
}}


function setLang(l) {{
  curLang = l;
  try {{ localStorage.setItem("sawa_lang", l); }} catch (error) {{ /* Storage may be disabled; language still works for this visit. */ }}
  document.getElementById("metaDescription").content = l === "ar"
    ? "تعرّف على الملف التعريفي المؤسسي ومحفظة أعمال مجموعة سوا يونيتد باللغتين العربية والإنجليزية."
    : "Explore the SAWA UNITED GROUP corporate profile and business portfolio in Arabic and English.";
  document.getElementById("pageTitle").textContent = l === "ar"
    ? "مجموعة سوا يونيتد | الملف التعريفي ومحفظة الأعمال"
    : "SAWA UNITED GROUP | Corporate Profile & Business Portfolio";
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  document.getElementById("btnAr").classList.toggle("active", l === "ar");
  document.getElementById("btnEn").classList.toggle("active", l === "en");
  document.getElementById("btnAr").setAttribute("aria-pressed", String(l === "ar"));
  document.getElementById("btnEn").setAttribute("aria-pressed", String(l === "en"));
  document.getElementById("homeLink").textContent = l === "ar" ? "الصفحة الرئيسية" : "Home";
  document.getElementById("skipLink").textContent = l === "ar" ? "تجاوز إلى المحتوى" : "Skip to content";
  document.getElementById("languageGroup").setAttribute("aria-label", l === "ar" ? "اللغة" : "Language");
  document.getElementById("editionGroup").setAttribute("aria-label", l === "ar" ? "الإصدار" : "Edition");
  document.getElementById("viewModeGroup").setAttribute("aria-label", l === "ar" ? "طريقة العرض" : "View mode");
  document.getElementById("dlDrawer").setAttribute("aria-label", l === "ar" ? "تنزيل المستندات" : "Download documents");
  document.getElementById("topSub").textContent = l === "ar" ? "الملف التعريفي المؤسسي · 2026" : "Corporate Profile · 2026";
  document.getElementById("topBrand").textContent = DATA[l].group_name;
  document.getElementById("lblFull").textContent = l === "ar" ? "البورتفوليو الكامل (18)" : "Full Portfolio (18)";
  document.getElementById("lblExec").textContent = l === "ar" ? "الملف التنفيذي (6)" : "Executive Profile (6)";
  document.getElementById("lblStage").textContent = l === "ar" ? "عرض شرائح 16:9" : "16:9 Slide Deck";
  document.getElementById("lblScroll").textContent = l === "ar" ? "عرض متتالي" : "Scroll View";
  document.getElementById("lblDl").textContent = l === "ar" ? "تحميل PDF & PPTX" : "Download PDF & PPTX";
  document.getElementById("fsBtn").textContent = l === "ar" ? "⛶ ملء الشاشة" : "⛶ Fullscreen";
  renderDeck();
}}

function setDeck(dk) {{
  curDeck = dk;
  curIdx = 0;
  document.getElementById("btnFull").classList.toggle("active", dk === "full");
  document.getElementById("btnExec").classList.toggle("active", dk === "exec");
  document.getElementById("btnFull").setAttribute("aria-pressed", String(dk === "full"));
  document.getElementById("btnExec").setAttribute("aria-pressed", String(dk === "exec"));
  renderDeck();
}}

function setMode(m) {{
  curMode = m;
  document.getElementById("btnStage").classList.toggle("active", m === "stage");
  document.getElementById("btnScroll").classList.toggle("active", m === "scroll");
  document.getElementById("btnStage").setAttribute("aria-pressed", String(m === "stage"));
  document.getElementById("btnScroll").setAttribute("aria-pressed", String(m === "scroll"));
  const wrap = document.getElementById("slidesContainer");
  wrap.className = "slides-wrap mode-" + m;
  document.getElementById("deckNav").style.display = m === "stage" ? "flex" : "none";
}}

function goFullscreen() {{
  const el = document.querySelector(".slide-frame.active") || document.getElementById("slidesContainer");
  if (el.requestFullscreen) el.requestFullscreen();
}}

function hdrHTML(d, isExec) {{
  const lbl = isExec ? d.doc_label_exec : d.doc_label_full;
  return `<div class="s-hdr"><span class="s-hdr-lbl">${{esc(lbl)}}</span><span class="mini-chip"><img src="assets/logo-transparent.png" alt="SAWA UNITED"></span></div>`;
}}
function ftrHTML(d, n, tot) {{
  const pg = String(n).padStart(2,"0") + " / " + String(tot).padStart(2,"0");
  return `<div class="s-ftr"><span>${{esc(d.footer_right)}}</span><strong class="ltr" style="color:var(--gold);">${{pg}}</strong><span class="ltr">${{esc(d.footer_left)}}</span></div>`;
}}

function buildSlidesHTML(lang, isExec) {{
  const d = DATA[lang];
  const rtl = d.rtl;
  const tot = isExec ? 6 : 18;
  const slides = [];

  // 01 Cover
  const s1 = d.s01;
  slides.push({{
    label: rtl ? "01 الغلاف" : "01 Cover",
    dark: true,
    html: `
      <div class="s-body" style="justify-content:space-between; padding:0;">
        <div class="g2" style="flex:1; align-items:center;">
          <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
            <img src="assets/logo-transparent.png" alt="SAWA UNITED" style="height:108px; width:auto;">
            <span class="card" style="padding:5px 14px; border-radius:999px; border-color:var(--gold); font-size:11.5px; font-weight:800; color:var(--gold-bright);">${{esc(isExec ? d.doc_label_exec : s1.eyebrow)}}</span>
            <h1 class="s-title" style="font-size:clamp(26px,3vw,42px);">${{esc(s1.title)}}</h1>
            <div style="font-size:17px; font-weight:800; color:var(--gold-bright);">${{esc(s1.subtitle)}}</div>
            <p class="s-sub" style="color:var(--silver);">${{esc(s1.lead)}}</p>
            <div style="font-weight:800; color:var(--gold-bright); font-size:15px;">${{esc(d.tagline)}}</div>
          </div>
          <div class="photo-card" role="img" aria-label="${{rtl ? "صورة توضيحية" : "Illustrative image"}}" style="height:100%; min-height:280px; background-image:url('assets/ecosystem-hero.webp');"><span class="visual-note">${{rtl ? "صورة توضيحية" : "Illustrative image"}}</span></div>
        </div>
        <div class="g4" style="margin-top:14px;">
          ${{s1.sectors_bar.map(([nm, dm, ak]) => `
            <div class="card" style="border-top:3.5px solid ${{COLORS[ak]}}; padding:10px 14px;">
              <div style="font-weight:800; font-size:13px;">${{esc(nm)}}</div>
              <div class="ltr" style="font-size:11.5px; font-weight:700; color:${{COLORS[ak]}}; margin-top:3px;">${{esc(dm)}}</div>
            </div>
          `).join("")}}
        </div>
      </div>`
  }});

  // 02 About
  const s2 = d.s02;
  slides.push({{
    label: rtl ? "02 من نحن" : "02 About",
    dark: false,
    num: 2,
    html: `
      ${{hdrHTML(d, isExec)}}
      <div class="s-body">
        <div class="g2">
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div class="kicker">${{esc(s2.kicker)}}</div>
            <h2 class="s-title">${{esc(s2.title)}}</h2>
            <div class="card" style="display:flex; flex-direction:column; gap:10px; flex:1;">
              <p style="font-size:13.5px; font-weight:600; line-height:1.6;">${{esc(s2.p1)}}</p>
              <p style="font-size:12.8px; color:var(--muted-light); line-height:1.6;">${{esc(s2.p2)}}</p>
              <div style="background:var(--ivory2); border:1px solid var(--gold); border-radius:10px; padding:9px 13px; font-weight:700; font-size:12.5px; color:var(--gold-deep);">${{esc(s2.quote)}}</div>
            </div>
          </div>
          <div class="photo-card" role="img" aria-label="${{rtl ? "صورة توضيحية" : "Illustrative image"}}" style="background-image:url('assets/skyline-corporate.webp');"><span class="visual-note">${{rtl ? "صورة توضيحية" : "Illustrative image"}}</span></div>
        </div>
        <div class="g5">
          ${{s2.kpis.map(([v, l]) => `
            <div style="background:var(--obsidian); color:#fff; border:1px solid var(--gold); border-radius:12px; padding:12px 14px;">
              <div class="ltr" style="font-size:24px; font-weight:800; color:var(--gold-bright);">${{esc(v)}}</div>
              <div style="font-size:12px; color:var(--silver); margin-top:4px; font-weight:600;">${{esc(l)}}</div>
            </div>
          `).join("")}}
        </div>
        <div style="font-size:11px; color:var(--muted-light);">${{esc(s2.note)}}</div>
      </div>
      ${{ftrHTML(d, 2, tot)}}`
  }});

  if (!isExec) {{
    // 03 Vision & Mission
    const s3 = d.s03;
    slides.push({{
      label: rtl ? "03 الرؤية والرسالة" : "03 Vision & Mission",
      dark: true,
      html: `
        ${{hdrHTML(d, false)}}
        <div class="s-body">
          <div><div class="kicker">${{esc(s3.kicker)}}</div><h2 class="s-title">${{esc(s3.title)}}</h2></div>
          <div class="g2-eq">
            <div class="card" style="border-color:var(--gold);"><h3 style="color:var(--gold-bright); font-size:16px; margin-bottom:6px;">${{esc(s3.vision_t)}}</h3><p style="font-size:13px; color:var(--silver); line-height:1.55;">${{esc(s3.vision_p)}}</p></div>
            <div class="card" style="border-color:var(--gold);"><h3 style="color:var(--gold-bright); font-size:16px; margin-bottom:6px;">${{esc(s3.mission_t)}}</h3><p style="font-size:13px; color:var(--silver); line-height:1.55;">${{esc(s3.mission_p)}}</p></div>
          </div>
          <div class="g3">
            ${{s3.objectives.map(([ot, op], i) => `
              <div class="card" style="background:#0E1520;">
                <div style="width:32px; height:3px; background:${{[COLORS.estate, COLORS.food, COLORS.oil][i]}}; margin-bottom:7px;"></div>
                <strong style="font-size:14px;">${{esc(ot)}}</strong>
                <p style="font-size:12px; color:var(--muted-dark); margin-top:4px; line-height:1.45;">${{esc(op)}}</p>
              </div>
            `).join("")}}
          </div>
          <div class="g4">
            ${{s3.values.map(([vt, vp], i) => `
              <div class="card">
                <span class="ltr" style="font-size:11px; font-weight:800; color:var(--gold-bright); background:#1C2638; border:1px solid var(--gold); padding:2px 8px; border-radius:6px;">0${{i+1}}</span>
                <div style="font-weight:800; color:var(--gold-bright); font-size:13.5px; margin-top:7px;">${{esc(vt)}}</div>
                <p style="font-size:11.8px; color:var(--silver); margin-top:4px; line-height:1.45;">${{esc(vp)}}</p>
              </div>
            `).join("")}}
          </div>
        </div>
        ${{ftrHTML(d, 3, tot)}}`
    }});
  }}

  // Ecosystem (Slide 04 in full, Slide 03 in exec)
  const s4 = d.s04;
  const ecoPg = isExec ? 3 : 4;
  slides.push({{
    label: rtl ? `0${{ecoPg}} منظومة الأعمال` : `0${{ecoPg}} Ecosystem`,
    dark: false,
    html: `
      ${{hdrHTML(d, isExec)}}
      <div class="s-body">
        <div><div class="kicker">${{esc(s4.kicker)}}</div><h2 class="s-title">${{esc(s4.title)}}</h2><p class="s-sub">${{esc(s4.sub)}}</p></div>
        <div style="align-self:center; background:var(--obsidian); color:#fff; border:1.5px solid var(--gold); border-radius:14px; padding:10px 28px; text-align:center;">
          <div class="ltr" style="font-weight:800; color:var(--gold-bright); font-size:15px;">${{esc(s4.hub_title)}}</div>
          <div style="font-size:11.5px; color:var(--silver);">${{esc(s4.hub_sub)}}</div>
        </div>
        <div class="g4">
          ${{s4.sectors.map(([ns, nm, bs, dm, ak, ds]) => `
            <div class="card" style="border-top:4px solid ${{COLORS[ak]}}; display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge" style="background:${{COLORS[ak]}};">${{ns}}</span>
                <span class="ltr" style="font-size:11.5px; font-weight:800; color:${{COLORS[ak]}};">${{esc(dm)}}</span>
              </div>
              <strong style="font-size:14.5px; line-height:1.3;">${{esc(nm)}}</strong>
              <div style="font-size:11.8px; font-weight:700; color:var(--gold-deep);">${{esc(bs)}}</div>
              <p style="font-size:12px; color:var(--muted-light); line-height:1.5;">${{esc(ds)}}</p>
            </div>
          `).join("")}}
        </div>
        <div style="background:var(--ivory2); border:1px solid var(--gold); border-radius:10px; padding:9px 16px; text-align:center; font-weight:700; font-size:12.2px;">${{esc(s4.synergy)}}</div>
      </div>
      ${{ftrHTML(d, ecoPg, tot)}}`
  }});

  if (!isExec) {{
    // 05-08 Dedicated Sector Pages
    [["s05",5,true], ["s06",6,false], ["s07",7,true], ["s08",8,false]].forEach(([sk, pn, dk]) => {{
      const sc = d[sk];
      const acc = COLORS[sc.accent];
      slides.push({{
        label: `0${{pn}} ${{sc.domain.split('.')[0].toUpperCase()}}`,
        dark: dk,
        html: `
          ${{hdrHTML(d, false)}}
          <div class="s-body">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
              <div><div class="kicker">${{esc(sc.kicker)}}</div><h2 class="s-title">${{esc(sc.title)}}</h2></div>
              <a href="https://${{sc.domain}}" target="_blank" rel="noopener" class="badge" style="background:${{acc}}; padding:7px 16px; font-size:12.5px;">${{esc(sc.domain)}} ↗</a>
            </div>
            <div class="g2">
              <div style="display:flex; flex-direction:column; gap:9px;">
                <div class="card" style="padding:8px 14px; border-color:${{acc}}; font-weight:700; font-size:12.5px; color:${{acc}};">${{esc(sc.slogan)}}</div>
                <p style="font-size:12.6px; line-height:1.55; opacity:0.9;">${{esc(sc.about)}}</p>
                <div class="card" style="display:flex; flex-direction:column; gap:5px;">
                  ${{sc.services.map(it => `<div style="font-size:12.2px; font-weight:600;"><span style="color:${{acc}}; font-weight:800;">✦ </span>${{esc(it)}}</div>`).join("")}}
                </div>
                <div class="card" style="border-color:${{acc}};">
                  <strong style="font-size:12.5px; color:${{acc}};">${{esc(sc.value_t)}}</strong>
                  <p style="font-size:12px; margin-top:3px; line-height:1.45; opacity:0.88;">${{esc(sc.value)}}</p>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:9px;">
                <div class="photo-card" role="img" aria-label="${{rtl ? "صورة توضيحية وليست توثيقاً لمشروع" : "Illustrative image, not a project photograph"}}" style="flex:1; border-color:${{acc}}; background-image:url('assets/${{sc.photo}}');"><span class="visual-note">${{rtl ? "صورة توضيحية — ليست توثيقاً لمشروع" : "Illustrative image — not a project photo"}}</span></div>
                ${{sc.highlights.map(([hv, hl]) => `
                  <div class="card" style="padding:8px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; border-inline-start:4px solid ${{acc}};">
                    <strong style="color:${{acc}}; font-size:13px;">${{esc(hv)}}</strong>
                    <span style="font-size:11.8px; font-weight:600;">${{esc(hl)}}</span>
                  </div>
                `).join("")}}
              </div>
            </div>
          </div>
          ${{ftrHTML(d, pn, tot)}}`
      }});
    }});

    // 09 Services Matrix
    const s9 = d.s09;
    slides.push({{
      label: rtl ? "09 الخدمات والحلول" : "09 Solutions",
      dark: true,
      html: `
        ${{hdrHTML(d, false)}}
        <div class="s-body">
          <div><div class="kicker">${{esc(s9.kicker)}}</div><h2 class="s-title">${{esc(s9.title)}}</h2><p class="s-sub">${{esc(s9.sub)}}</p></div>
          <div class="g4" style="flex:1;">
            ${{s9.cols.map(([ct, ak, items, tg]) => `
              <div class="card" style="padding:0; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="background:${{COLORS[ak]}}; color:#fff; font-weight:800; font-size:13.5px; padding:12px; text-align:center;">${{esc(ct)}}</div>
                  <div style="padding:14px; display:flex; flex-direction:column; gap:9px;">
                    ${{items.map(x => `<div style="font-size:12.2px; color:var(--silver); line-height:1.45;"><span style="color:${{COLORS[ak]}};">● </span>${{esc(x)}}</div>`).join("")}}
                  </div>
                </div>
                <div style="margin:10px; padding:8px; border-radius:9px; background:#0B1018; border:1px solid ${{COLORS[ak]}}; color:${{COLORS[ak]}}; font-size:11px; font-weight:700; text-align:center;">${{esc(tg)}}</div>
              </div>
            `).join("")}}
          </div>
        </div>
        ${{ftrHTML(d, 9, tot)}}`
    }});

    // 10 Projects & Ventures
    const s10 = d.s10;
    const vPhotos = ["sector-realestate.webp","sector-food.webp","sector-automotive.webp","sector-petroleum.webp"];
    slides.push({{
      label: rtl ? "10 المشروعات" : "10 Ventures",
      dark: false,
      html: `
        ${{hdrHTML(d, false)}}
        <div class="s-body">
          <div><div class="kicker">${{esc(s10.kicker)}}</div><h2 class="s-title">${{esc(s10.title)}}</h2><p class="s-sub">${{esc(s10.sub)}}</p></div>
          <div class="g2-eq" style="flex:1;">
            ${{s10.ventures.map(([vt, vm, ak, vd], i) => `
              <div class="card" style="display:grid; grid-template-columns:130px 1fr; gap:14px; align-items:stretch;">
                <div class="photo-card" role="img" aria-label="${{rtl ? "صورة توضيحية وليست توثيقاً لمشروع" : "Illustrative image, not a project photograph"}}" style="min-height:120px; border-color:${{COLORS[ak]}}; background-image:url('assets/${{vPhotos[i]}}');"><span class="visual-note">${{rtl ? "توضيحية فقط" : "Illustrative only"}}</span></div>
                <div style="display:flex; flex-direction:column; gap:4px;">
                  <span style="font-size:11px; font-weight:800; color:${{COLORS[ak]}};">${{esc(vm)}}</span>
                  <strong class="ltr" style="font-size:14px;">${{esc(vt)}}</strong>
                  <p style="font-size:11.7px; color:var(--muted-light); line-height:1.45;">${{esc(vd)}}</p>
                </div>
              </div>
            `).join("")}}
          </div>
        </div>
        ${{ftrHTML(d, 10, tot)}}`
    }});

    // 11 Capabilities & Operating Model
    const s11 = d.s11, s12 = d.s12;
    slides.push({{
      label: rtl ? "11 نطاق المعلومات" : "11 Information scope",
      dark: true,
      html: `
        ${{hdrHTML(d, false)}}
        <div class="s-body">
          <div>
            <div class="kicker">${{esc(s11.kicker)}}</div>
            <h2 class="s-title">${{esc(s11.title)}}</h2>
            <p class="s-sub">${{esc(s11.sub)}}</p>
          </div>
          <div class="g2" style="flex:1;">
            <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
              <strong style="color:var(--gold-bright); font-size:14.5px;">${{rtl ? "عناصر المحتوى المدرجة" : "Listed website content"}}</strong>
              ${{s11.bars.map(([bl, bv, br, ak]) => `
                <div>
                  <div style="display:flex; justify-content:space-between; gap:8px; font-size:11.8px;">
                    <span style="color:var(--silver); font-weight:600;">${{esc(bl)}}</span>
                    <strong style="color:${{COLORS[ak]}};">${{esc(bv)}}</strong>
                  </div>
                  <div class="bar-track"><div class="bar-fill" style="width:${{br*100}}%; background:${{COLORS[ak]}};"></div></div>
                </div>
              `).join("")}}
            </div>
            <div class="card" style="border-color:var(--gold); display:flex; flex-direction:column; justify-content:space-between; gap:6px;">
              <strong style="color:var(--gold-bright); font-size:14.5px;">${{rtl ? "قائمة تحقق للقارئ" : "Reader verification checklist"}}</strong>
              ${{s12.steps.map(([sn, st, sp]) => `
                <div style="display:flex; gap:10px; align-items:center; background:#0C121C; padding:7px 10px; border-radius:10px; border:1px solid var(--obsidian-line);">
                  <span class="badge" style="background:var(--gold); color:#080B10; padding:6px 9px;">${{sn}}</span>
                  <div><strong style="font-size:12.5px; display:block;">${{esc(st)}}</strong><span style="font-size:11px; color:var(--muted-dark);">${{esc(sp)}}</span></div>
                </div>
              `).join("")}}
            </div>
          </div>
        </div>
        ${{ftrHTML(d, 11, tot)}}`
    }});

    // 12 Competitive Advantage
    const s13 = d.s13;
    slides.push({{
      label: rtl ? "12 ملاحظات الإفصاح" : "12 Disclosure notes",
      dark: false,
      html: `
        ${{hdrHTML(d, false)}}
        <div class="s-body">
          <div><div class="kicker">${{esc(s13.kicker)}}</div><h2 class="s-title">${{esc(s13.title)}}</h2><p class="s-sub">${{esc(s13.sub)}}</p></div>
          <div class="g3">
            ${{s13.pillars.slice(0,3).map(([pn, pt, pd], i) => `
              <div class="card" style="border-top:4px solid ${{[COLORS.gold, COLORS.oil, COLORS.estate][i]}};">
                <span class="badge" style="background:var(--obsidian); color:var(--gold-bright);">${{pn}}</span>
                <strong style="display:block; font-size:14.5px; margin:8px 0 5px;">${{esc(pt)}}</strong>
                <p style="font-size:12px; color:var(--muted-light); line-height:1.5;">${{esc(pd)}}</p>
              </div>
            `).join("")}}
          </div>
          <div class="g2-eq">
            ${{s13.pillars.slice(3).map(([pn, pt, pd], i) => `
              <div class="card" style="border-top:4px solid ${{[COLORS.food, COLORS.car][i]}};">
                <span class="badge" style="background:var(--obsidian); color:var(--gold-bright);">${{pn}}</span>
                <strong style="display:block; font-size:14.5px; margin:8px 0 5px;">${{esc(pt)}}</strong>
                <p style="font-size:12px; color:var(--muted-light); line-height:1.5;">${{esc(pd)}}</p>
              </div>
            `).join("")}}
          </div>
        </div>
        ${{ftrHTML(d, 12, tot)}}`
    }});

    // 13 Partners & Clients
    const s14 = d.s14;
    slides.push({{
      label: rtl ? "13 الشراكات والاعتمادات" : "13 Partnerships & Credentials",
      dark: true,
      html: `
        ${{hdrHTML(d, false)}}
        <div class="s-body">
          <div><div class="kicker">${{esc(s14.kicker)}}</div><h2 class="s-title">${{esc(s14.title)}}</h2><p class="s-sub">${{esc(s14.sub)}}</p></div>
          <div class="g3">
            ${{s14.verified_badges.map(([bt, bm, bd], i) => `
              <div class="card" style="border-color:${{[COLORS.oil, COLORS.food, COLORS.gold][i]}};">
                <span style="font-size:11px; font-weight:800; color:${{[COLORS.oil, COLORS.food, "#E3B85A"][i]}};">${{esc(bt)}}</span>
                <strong style="display:block; font-size:14px; margin:6px 0;">${{esc(bm)}}</strong>
                <p style="font-size:11.8px; color:var(--silver); line-height:1.45;">${{esc(bd)}}</p>
              </div>
            `).join("")}}
          </div>
          <div style="font-size:12.5px; font-weight:700; color:var(--gold-bright);">${{esc(s14.slots_title)}}</div>
          <div class="g3">
            ${{s14.slots.map(sl => `<div class="card dashed" style="text-align:center; padding:16px; color:var(--muted-dark); font-size:12px; font-weight:700;">${{esc(sl)}}</div>`).join("")}}
          </div>
        </div>
        ${{ftrHTML(d, 13, tot)}}`
    }});
  }}

  // Markets (Slide 14 in full, Slide 04 in exec)
  const s15 = d.s15;
  const mktPg = isExec ? 4 : 14;
  slides.push({{
    label: rtl ? `${{String(mktPg).padStart(2,'0')}} المواقع` : `${{String(mktPg).padStart(2,'0')}} Websites`,
    dark: true,
    html: `
      ${{hdrHTML(d, isExec)}}
      <div class="s-body">
        <div><div class="kicker">${{esc(s15.kicker)}}</div><h2 class="s-title">${{esc(s15.title)}}</h2><p class="s-sub">${{esc(s15.sub)}}</p></div>
        <div class="g2" style="flex:1;">
          <div style="display:flex; flex-direction:column; gap:6px; justify-content:space-between;">
            ${{s15.websites.map(([cn, cd, cs]) => `
              <div class="card" style="padding:7px 12px; display:flex; align-items:center; gap:10px; border-color:${{cd==='EXP'?COLORS.oil:'var(--obsidian-line)'}};">
                <span class="badge" style="background:${{cd==='EXP'?COLORS.oil:'var(--gold)'}}; color:${{cd==='EXP'?'#fff':'#080A0F'}}; min-width:40px; text-align:center;">${{cd}}</span>
                <div><strong style="font-size:12.5px; display:block;">${{esc(cn)}}</strong><span style="font-size:11px; color:var(--muted-dark);">${{esc(cs)}}</span></div>
              </div>
            `).join("")}}
          </div>
          <div class="profile-diagram" role="img" aria-label="${{rtl ? "مخطط توضيحي لروابط المواقع، وليس خريطة تشغيل" : "Illustrative website-link diagram, not an operating map"}}">
            <strong>SAWA UNITED GROUP</strong>
            <div class="profile-diagram-grid">${{s15.websites.map(([cn, cd, cs]) => `<span>${{esc(cn)}}<br><b class="ltr">${{esc(cs)}}</b></span>`).join("")}}</div>
            <span class="visual-note">${{rtl ? "مخطط توضيحي — لا يحدد مواقع التشغيل" : "Illustrative diagram — no operating locations shown"}}</span>
          </div>
        </div>
      </div>
      ${{ftrHTML(d, mktPg, tot)}}`
  }});

  if (!isExec) {{
    // 15 Quality & HSE
    const s17 = d.s17;
    slides.push({{
      label: rtl ? "15 التحقق المستقل" : "15 Independent review",
      dark: false,
      html: `
        ${{hdrHTML(d, false)}}
        <div class="s-body">
          <div><div class="kicker">${{esc(s17.kicker)}}</div><h2 class="s-title">${{esc(s17.title)}}</h2><p class="s-sub">${{esc(s17.sub)}}</p></div>
          <div class="g2-eq">
            ${{s17.standards.map(([st, sp], i) => `
              <div class="card" style="border-inline-start:5px solid ${{[COLORS.estate, COLORS.oil, COLORS.food, COLORS.car][i]}};">
                <strong style="font-size:14.5px; display:block; margin-bottom:5px;">${{esc(st)}}</strong>
                <p style="font-size:12.2px; color:var(--muted-light); line-height:1.5;">${{esc(sp)}}</p>
              </div>
            `).join("")}}
          </div>
          <div class="card dashed" style="text-align:center;">
            <strong style="color:var(--gold-deep); font-size:13px; display:block; margin-bottom:4px;">${{esc(s17.cert_placeholder_t)}}</strong>
            <span style="font-size:12px; color:var(--muted-light); font-weight:600;">${{esc(s17.cert_placeholder_p)}}</span>
          </div>
        </div>
        ${{ftrHTML(d, 15, tot)}}`
    }});
  }}

  // Partnerships & CTA (Slide 16 in full, Slide 05 in exec)
  const s16 = d.s16;
  const prtPg = isExec ? 5 : 16;
  slides.push({{
    label: rtl ? `${{String(prtPg).padStart(2,'0')}} الاستفسارات` : `${{String(prtPg).padStart(2,'0')}} Inquiries`,
    dark: true,
    html: `
      ${{hdrHTML(d, isExec)}}
      <div class="s-body">
        <div><div class="kicker">${{esc(s16.kicker)}}</div><h2 class="s-title">${{esc(s16.title)}}</h2><p class="s-sub">${{esc(s16.sub)}}</p></div>
        <div class="g2-eq">
          ${{s16.tracks.map(([tn, tt, ak, td]) => `
            <div class="card" style="border-top:4px solid ${{COLORS[ak]}};">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span class="badge" style="background:${{COLORS[ak]}};">${{tn}}</span>
                <strong style="font-size:14px;">${{esc(tt)}}</strong>
              </div>
              <p style="font-size:12px; color:var(--silver); line-height:1.5;">${{esc(td)}}</p>
            </div>
          `).join("")}}
        </div>
        <div class="card" style="background:#161F30; border-color:var(--gold); text-align:center; font-weight:800; color:var(--gold-bright); font-size:13.2px;">
          ${{rtl ? "للمعلومات الحالية، راجع الموقع المدرج للقطاع المعني. إدراج الروابط لا يؤكد توفر خدمة أو يمثل عرضاً تجارياً." : "For current information, visit the relevant listed sector website. Listing these links does not confirm service availability or constitute a commercial offer."}}
        </div>
      </div>
      ${{ftrHTML(d, prtPg, tot)}}`
  }});

  if (!isExec) {{
    // 17 Contacts
    const s18 = d.s18;
    slides.push({{
      label: rtl ? "17 التواصل الرسمي" : "17 Contacts",
      dark: false,
      html: `
        ${{hdrHTML(d, false)}}
        <div class="s-body">
          <div>
            <div class="kicker">${{rtl ? "معلومات الاتصال الرسمية · OFFICIAL CONTACT CHANNELS" : "OFFICIAL CONTACTS · DIGITAL PORTALS & DIRECT ACCESS"}}</div>
            <h2 class="s-title">${{rtl ? "قنوات التواصل الرسمية ومنصات المجموعة" : "Official Group Portals & Direct Communication Channels"}}</h2>
            <p class="s-sub">${{esc(s18.lead)}}</p>
          </div>
          <div class="g2-eq">
            ${{s18.contacts.slice(0,8).map(([cl, cv]) => `
              <div class="card" style="padding:10px 16px; border-inline-start:4px solid var(--gold);">
                <div style="font-size:11.5px; font-weight:700; color:var(--muted-light);">${{esc(cl)}}</div>
                <div class="ltr" style="font-size:13.5px; font-weight:800; margin-top:2px;">${{esc(cv)}}</div>
              </div>
            `).join("")}}
          </div>
          <div class="card dashed" style="text-align:center; padding:12px;">
            <strong style="color:var(--gold-deep); font-size:12.5px; display:block;">${{esc(s18.contacts[8][0])}}</strong>
            <span style="font-size:12px; color:var(--muted-light); font-weight:600;">${{esc(s18.contacts[8][1])}}</span>
          </div>
        </div>
        ${{ftrHTML(d, 17, tot)}}`
    }});
  }}

  // Closing Cover (Slide 18 in full, Slide 06 in exec)
  const clsPg = isExec ? 6 : 18;
  slides.push({{
    label: rtl ? `${{String(clsPg).padStart(2,'0')}} الختام` : `${{String(clsPg).padStart(2,'0')}} Closing`,
    dark: true,
    html: `
      <div class="s-body" style="align-items:center; text-align:center; justify-content:center; gap:14px;">
        <img src="assets/logo-transparent.png" alt="SAWA UNITED" style="height:150px; width:auto;">
        <h2 class="s-title" style="font-size:clamp(24px,2.6vw,36px);">${{esc(d.group_name)}}</h2>
        <div style="font-size:17px; font-weight:800; color:var(--gold-bright);">${{esc(d.tagline)}}</div>
        <p class="s-sub" style="text-align:center;">${{esc(d.sub_tagline)}}</p>
        <a href="https://wa.me/201011225592" target="_blank" rel="noopener noreferrer" class="card ltr" style="border-radius:999px; border-color:var(--gold); padding:10px 26px; font-weight:800; color:var(--gold-bright); font-size:14px;">
          ${{rtl ? "sawaunited.net | واتساب · رقم مدرج، تحقق قبل الاستخدام" : "sawaunited.net | WhatsApp — listed number; verify first"}}
        </a>
        <div class="g4" style="width:100%; max-width:820px; margin-top:8px;">
          <a href="https://sawa-united.net" target="_blank" class="card ltr" style="padding:9px; border-color:${{COLORS.estate}}; color:${{COLORS.estate}}; font-weight:800; font-size:12.5px;">sawa-united.net</a>
          <a href="https://sawafood.net" target="_blank" class="card ltr" style="padding:9px; border-color:${{COLORS.food}}; color:${{COLORS.food}}; font-weight:800; font-size:12.5px;">sawafood.net</a>
          <a href="https://masharycar.net" target="_blank" class="card ltr" style="padding:9px; border-color:${{COLORS.car}}; color:${{COLORS.car}}; font-weight:800; font-size:12.5px;">masharycar.net</a>
          <a href="https://startwalk.net" target="_blank" class="card ltr" style="padding:9px; border-color:${{COLORS.oil}}; color:${{COLORS.oil}}; font-weight:800; font-size:12.5px;">startwalk.net</a>
        </div>
      </div>`
  }});

  return slides;
}}

let currentSlides = [];

function renderDeck() {{
  currentSlides = buildSlidesHTML(curLang, curDeck === "exec");
  if (curIdx >= currentSlides.length) curIdx = 0;

  const container = document.getElementById("slidesContainer");
  container.innerHTML = currentSlides.map((sl, i) => `
    <article class="slide-frame ${{sl.dark ? 'dark' : 'light'}} ${{i === curIdx ? 'active' : ''}}" data-idx="${{i}}">
      ${{sl.html}}
    </article>
  `).join("");

  const thumbs = document.getElementById("thumbsBar");
  thumbs.innerHTML = currentSlides.map((sl, i) => `
    <button class="thumb-dot ${{i === curIdx ? 'active' : ''}}" onclick="goToSlide(${{i}})">${{esc(sl.label)}}</button>
  `).join("");

  updateNavState();
}}

function goToSlide(i) {{
  curIdx = Math.max(0, Math.min(currentSlides.length - 1, i));
  document.querySelectorAll(".slide-frame").forEach((el, k) => el.classList.toggle("active", k === curIdx));
  document.querySelectorAll(".thumb-dot").forEach((el, k) => el.classList.toggle("active", k === curIdx));
  updateNavState();
}}

function stepSlide(delta) {{
  goToSlide(curIdx + delta);
}}

function updateNavState() {{
  document.getElementById("slideCounter").textContent =
    String(curIdx + 1).padStart(2, "0") + " / " + String(currentSlides.length).padStart(2, "0");
  document.getElementById("prevBtn").disabled = (curIdx === 0);
  document.getElementById("nextBtn").disabled = (curIdx === currentSlides.length - 1);
}}

document.addEventListener("keydown", (e) => {{
  if (curMode !== "stage") return;
  const rtl = curLang === "ar";
  if (e.key === "ArrowRight") stepSlide(rtl ? -1 : 1);
  if (e.key === "ArrowLeft") stepSlide(rtl ? 1 : -1);
  if (e.key === " ") {{ e.preventDefault(); stepSlide(1); }}
}});

let initialLang = "ar";
try {{
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  const savedLang = localStorage.getItem("sawa_lang");
  initialLang = ["ar", "en"].includes(urlLang) ? urlLang : (["ar", "en"].includes(savedLang) ? savedLang : initialLang);
}} catch (error) {{ /* Continue with Arabic when browser storage is unavailable. */ }}
setLang(initialLang);
</script>
</body>
</html>
"""

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out_file = os.path.join(root_dir, "portfolio", "index.html")
with open(out_file, "w", encoding="utf-8") as f:
    f.write(html)
print("Generated interactive web portfolio:", out_file, len(html), "bytes")
