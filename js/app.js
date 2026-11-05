/**
 * Main entry point.
 * Repeated content is intentionally kept in HTML so pages are easy to
 * edit without generating cards through JavaScript.
 *
 * Every component is only initialized when the elements it needs are
 * present in the current page, so this single script can run safely on
 * any page (home, projects, future pages) without every section having
 * to exist everywhere.
 */
(function () {
  "use strict";

  const dom = {
    header: document.getElementById("header"),
    mobileMenu: document.getElementById("mobileMenu"),
    menuBtn: document.getElementById("menuBtn"),
    langBtn: document.getElementById("langBtn"),
    footerLangBtn: document.getElementById("footerLangBtn"),
    themeBtn: document.getElementById("themeBtn"),
    filters: document.getElementById("filters"),
    propertyGrid: document.getElementById("propertyGrid"),
    contactForm: document.getElementById("contactForm"),
    hero: document.querySelector(".hero"),
    heroInner: document.querySelector(".hero-inner"),
  };

  if (dom.menuBtn && dom.mobileMenu && window.Luna && Luna.MobileMenu) {
    new Luna.MobileMenu({
      menuBtn: dom.menuBtn,
      mobileMenu: dom.mobileMenu,
    }).init();
  }

  if (dom.filters && dom.propertyGrid && window.Luna && Luna.ProjectFilter) {
    new Luna.ProjectFilter({
      filtersEl: dom.filters,
      gridEl: dom.propertyGrid,
    }).init();
  }

  if (dom.header && window.Luna && Luna.HeaderScroll) {
    new Luna.HeaderScroll(dom.header).init();
  }

  if (dom.langBtn && window.Luna && Luna.LanguageToggle) {
    new Luna.LanguageToggle({
      langBtn: dom.langBtn,
      footerLangBtn: dom.footerLangBtn,
    }).init();
  }

  if (dom.themeBtn && window.Luna && Luna.ThemeToggle) {
    new Luna.ThemeToggle(dom.themeBtn).init();
  }

  if (dom.contactForm) {
    dom.contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const values = new FormData(form);
      const name = (values.get("name") || "").toString().trim();
      const phone = (values.get("phone") || "").toString().trim();
      const company = (values.get("company") || "").toString().trim();
      const country = (values.get("country") || "").toString().trim();
      const message = (values.get("message") || "").toString().trim();

      // Build a clean WhatsApp message with real line breaks (not literal \\n text).
      const lines = [
        "Hello Sawa United ",
        "I would like to get in touch.",
        "",
        "Name: " + name,
        company ? "Company: " + company : null,
        country ? "Country: " + country : null,
        phone ? "Phone: " + phone : null,
        "",
        "Message:",
        message,
      ].filter((line) => line !== null);

      const text = lines.join("\n");

      const whatsappUrl =
        "https://api.whatsapp.com/send?phone=201011225592&text=" +
        encodeURIComponent(text);

      window.open(whatsappUrl, "_blank");
    });
  }

  // Scroll progress + subtle parallax: motion responds continuously to scrolling.
  const progress = document.getElementById("scrollProgress");
  let ticking = false;
  const updateScrollMotion = () => {
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const ratio = Math.min(1, Math.max(0, window.scrollY / max));
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    document.documentElement.style.setProperty(
      "--scroll-y",
      `${window.scrollY}px`,
    );
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollMotion);
      }
    },
    { passive: true },
  );
  updateScrollMotion();

  if (window.Luna && Luna.ScrollReveal) {
    const scrollReveal = new Luna.ScrollReveal();
    scrollReveal.observe();

    if (dom.hero && dom.heroInner) {
      if (scrollReveal.reduceMotion) {
        dom.hero.classList.add("hero-ready");
        dom.heroInner.classList.add("in-view");
      } else {
        requestAnimationFrame(() => dom.hero.classList.add("hero-ready"));
      }
    }
  }
})();
