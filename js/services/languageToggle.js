/*
 * SAWA UNITED — language support for the business-platforms page.
 * Homepage translations live in js/home.js; this module keeps the projects
 * page in sync with the shared language preference without stale legacy claims.
 */
window.Luna = window.Luna || {};

Luna.LanguageToggle = (function () {
  const STORAGE_KEY = "sawa_lang";
  const LANGS = ["en", "ar", "fr"];
  const translations = {
    en: {
      "page.title": "SAWA UNITED | Business platforms",
      "page.description": "This page lists four business sectors and links to their websites.",
      "projects.metaTitle": "SAWA UNITED | Business platforms",
      "projects.metaDescription": "Four business sectors and their listed websites. Illustrative images are not project records.",
      "projects.eyebrow": "BUSINESS PLATFORMS",
      "projects.pageTitle": "One group.<br><span>Four listed sectors.</span>",
      "projects.description": "This page lists four sector websites. The images are illustrative; no project case studies are presented.",
      "projects.filterLabel": "Filter by business sector",
      "projects.showingAll": "Showing all four listed business platforms",
      "filters.all": "All",
      "filters.realEstate": "Real estate",
      "filters.food": "Food",
      "filters.automotive": "Automotive",
      "filters.petroleum": "Petroleum",
      "business.realEstateTitle": "SAWA UNITED REAL ESTATE",
      "business.foodTitle": "SAWA FOOD",
      "business.automotiveTitle": "MASHARY CARS",
      "business.petroleumTitle": "START WALK",
      "business.realEstateSummary": "Website listed under the real-estate sector.",
      "business.foodSummary": "Website listed under the food sector.",
      "business.automotiveSummary": "Website listed under the automotive sector.",
      "business.petroleumSummary": "Website listed under the petroleum-products sector.",
      "business.illustrative": "Illustrative image — not a project photo.",
      "business.website": "LISTED WEBSITE",
      "business.realEstateImageAlt": "Illustrative real-estate concept image; not a documented project.",
      "business.foodImageAlt": "Illustrative food-sector concept image; not a documented project.",
      "business.automotiveImageAlt": "Illustrative automotive concept image; not a documented project.",
      "business.petroleumImageAlt": "Illustrative petroleum-sector concept image; not a documented project.",
      "access.skip": "Skip to content",
      "nav.label": "Primary navigation",
      "nav.about": "About",
      "nav.businesses": "Sectors",
      "nav.profile": "Corporate profile",
      "nav.platforms": "Business platforms",
      "nav.contact": "Contact",
      "common.home": "Home",
      "common.backHome": "Back to home",
      "common.close": "Close",
      "common.visitWebsite": "Visit website",
      "common.changeLanguage": "Change language",
      "common.languageOptions": "Choose language",
      "menu.open": "Open menu",
      "menu.close": "Close menu",
      "theme.light": "Switch to light mode",
      "theme.dark": "Switch to dark mode",
      "contact.whatsapp": "WhatsApp · verify number",
      "contact.whatsappAction": "The WhatsApp number listed in site files is unverified; confirm it before use",
      "footer.rights": "All rights reserved.",
    },
    ar: {
      "page.title": "سوا يونايتد | منصات الأعمال",
      "page.description": "تعرض هذه الصفحة أربعة قطاعات وروابط مواقعها المدرجة.",
      "projects.metaTitle": "سوا يونايتد | منصات الأعمال",
      "projects.metaDescription": "أربعة قطاعات وروابط مواقعها المدرجة. الصور توضيحية وليست سجلاً للمشروعات.",
      "projects.eyebrow": "منصات الأعمال",
      "projects.pageTitle": "مجموعة واحدة.<br><span>أربعة قطاعات مدرجة.</span>",
      "projects.description": "تعرض هذه الصفحة أربعة مواقع قطاعية. الصور توضيحية، ولا تُعرض فيها دراسات حالة لمشروعات.",
      "projects.filterLabel": "تصفية حسب قطاع الأعمال",
      "projects.showingAll": "عرض منصات الأعمال الأربع المدرجة",
      "filters.all": "الكل",
      "filters.realEstate": "العقارات",
      "filters.food": "الأغذية",
      "filters.automotive": "السيارات",
      "filters.petroleum": "البترول",
      "business.realEstateTitle": "سوا يونايتد للعقارات",
      "business.foodTitle": "سوا فود",
      "business.automotiveTitle": "ماشيري كارز",
      "business.petroleumTitle": "ستارت ووك",
      "business.realEstateSummary": "موقع مدرج تحت قطاع العقارات.",
      "business.foodSummary": "موقع مدرج تحت قطاع الأغذية.",
      "business.automotiveSummary": "موقع مدرج تحت قطاع السيارات.",
      "business.petroleumSummary": "موقع مدرج تحت قطاع مشتقات البترول.",
      "business.illustrative": "صورة توضيحية — ليست صورة مشروع.",
      "business.website": "الموقع المدرج",
      "business.realEstateImageAlt": "صورة توضيحية لمفهوم العقارات؛ وليست توثيقاً لمشروع.",
      "business.foodImageAlt": "صورة توضيحية لمفهوم قطاع الأغذية؛ وليست توثيقاً لمشروع.",
      "business.automotiveImageAlt": "صورة توضيحية لمفهوم السيارات؛ وليست توثيقاً لمشروع.",
      "business.petroleumImageAlt": "صورة توضيحية لمفهوم قطاع البترول؛ وليست توثيقاً لمشروع.",
      "access.skip": "تخطَّ إلى المحتوى",
      "nav.label": "التنقل الرئيسي",
      "nav.about": "نبذة",
      "nav.businesses": "القطاعات",
      "nav.profile": "الملف المؤسسي",
      "nav.platforms": "منصات الأعمال",
      "nav.contact": "تواصل معنا",
      "common.home": "الرئيسية",
      "common.backHome": "العودة إلى الرئيسية",
      "common.close": "إغلاق",
      "common.visitWebsite": "زيارة الموقع",
      "common.changeLanguage": "تغيير اللغة",
      "common.languageOptions": "اختر اللغة",
      "menu.open": "فتح القائمة",
      "menu.close": "إغلاق القائمة",
      "theme.light": "التبديل إلى الوضع الفاتح",
      "theme.dark": "التبديل إلى الوضع الداكن",
      "contact.whatsapp": "واتساب · تحقق من الرقم",
      "contact.whatsappAction": "رقم واتساب المدرج في ملفات الموقع غير متحقق؛ تأكد منه قبل الاستخدام",
      "footer.rights": "جميع الحقوق محفوظة.",
    },
    fr: {
      "page.title": "SAWA UNITED | Plateformes d’activité",
      "page.description": "Cette page répertorie quatre secteurs et les liens vers leurs sites.",
      "projects.metaTitle": "SAWA UNITED | Plateformes d’activité",
      "projects.metaDescription": "Quatre secteurs et les liens vers leurs sites. Les images sont illustratives et ne documentent pas des projets.",
      "projects.eyebrow": "PLATEFORMES D’ACTIVITÉ",
      "projects.pageTitle": "Un seul groupe.<br><span>Quatre secteurs répertoriés.</span>",
      "projects.description": "Cette page répertorie quatre sites sectoriels. Les images sont illustratives ; aucune étude de projet n’est présentée.",
      "projects.filterLabel": "Filtrer par secteur d’activité",
      "projects.showingAll": "Les quatre plateformes répertoriées sont affichées",
      "filters.all": "Tout",
      "filters.realEstate": "Immobilier",
      "filters.food": "Agroalimentaire",
      "filters.automotive": "Automobile",
      "filters.petroleum": "Pétrole",
      "business.realEstateTitle": "SAWA UNITED REAL ESTATE",
      "business.foodTitle": "SAWA FOOD",
      "business.automotiveTitle": "MASHARY CARS",
      "business.petroleumTitle": "START WALK",
      "business.realEstateSummary": "Site répertorié dans le secteur immobilier.",
      "business.foodSummary": "Site répertorié dans le secteur alimentaire.",
      "business.automotiveSummary": "Site répertorié dans le secteur automobile.",
      "business.petroleumSummary": "Site répertorié dans le secteur des produits pétroliers.",
      "business.illustrative": "Image illustrative — pas une photo de projet.",
      "business.website": "SITE RÉPERTORIÉ",
      "business.realEstateImageAlt": "Image illustrative liée à l’immobilier ; elle ne documente pas un projet.",
      "business.foodImageAlt": "Image illustrative liée au secteur alimentaire ; elle ne documente pas un projet.",
      "business.automotiveImageAlt": "Image illustrative liée à l’automobile ; elle ne documente pas un projet.",
      "business.petroleumImageAlt": "Image illustrative liée au pétrole ; elle ne documente pas un projet.",
      "access.skip": "Aller au contenu",
      "nav.label": "Navigation principale",
      "nav.about": "À propos",
      "nav.businesses": "Secteurs",
      "nav.profile": "Profil institutionnel",
      "nav.platforms": "Plateformes d’activité",
      "nav.contact": "Contact",
      "common.home": "Accueil",
      "common.backHome": "Retour à l’accueil",
      "common.close": "Fermer",
      "common.visitWebsite": "Visiter le site",
      "common.changeLanguage": "Changer de langue",
      "common.languageOptions": "Choisir la langue",
      "menu.open": "Ouvrir le menu",
      "menu.close": "Fermer le menu",
      "theme.light": "Passer au thème clair",
      "theme.dark": "Passer au thème sombre",
      "contact.whatsapp": "WhatsApp · vérifier le numéro",
      "contact.whatsappAction": "Le numéro WhatsApp indiqué dans les fichiers du site n’a pas été vérifié ; confirmez-le avant usage",
      "footer.rights": "Tous droits réservés.",
    },
  };

  class LanguageToggle {
    constructor(elements) {
      this.langBtn = elements.langBtn;
      this.footerLangBtn = elements.footerLangBtn;
      let storedLanguage = "";
      try { storedLanguage = localStorage.getItem(STORAGE_KEY) || ""; } catch (error) { /* Storage may be disabled. */ }
      this.lang = new URLSearchParams(location.search).get("lang") || storedLanguage || "en";
      if (!LANGS.includes(this.lang)) this.lang = "en";
    }

    init() {
      this.langBtn?.addEventListener("click", () => this.toggleMenu());
      this.footerLangBtn?.addEventListener("click", () => this.next());
      document.querySelectorAll("[data-language-option]").forEach((button) => {
        button.addEventListener("click", () => {
          this.set(button.dataset.languageOption);
          this.closeMenu();
        });
      });
      document.addEventListener("click", (event) => {
        if (!event.target.closest("#languageSwitcher")) this.closeMenu();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") this.closeMenu();
      });
      this.apply();
    }

    next() {
      const index = LANGS.indexOf(this.lang);
      this.set(LANGS[(index + 1) % LANGS.length]);
    }

    set(lang) {
      if (!LANGS.includes(lang)) return;
      this.lang = lang;
      this.apply();
    }

    toggleMenu() {
      const menu = document.getElementById("languageSwitcher");
      menu?.classList.toggle("open");
      this.langBtn?.setAttribute("aria-expanded", String(menu?.classList.contains("open") || false));
    }

    closeMenu() {
      document.getElementById("languageSwitcher")?.classList.remove("open");
      this.langBtn?.setAttribute("aria-expanded", "false");
    }

    apply() {
      const dictionary = translations[this.lang];
      document.documentElement.lang = this.lang;
      document.documentElement.dir = this.lang === "ar" ? "rtl" : "ltr";
      document.documentElement.dataset.lang = this.lang;

      const page = document.documentElement.dataset.i18nPage;
      const titleKey = page ? `${page}.metaTitle` : "page.title";
      const descriptionKey = page ? `${page}.metaDescription` : "page.description";
      document.title = dictionary[titleKey] || dictionary["page.title"];
      const description = document.getElementById("metaDescription");
      if (description) description.setAttribute("content", dictionary[descriptionKey] || dictionary["page.description"]);

      document.querySelectorAll("[data-i18n]").forEach((element) => {
        const value = dictionary[element.dataset.i18n];
        if (value !== undefined) element.innerHTML = value;
      });
      document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
        const value = dictionary[element.dataset.i18nAlt];
        if (value !== undefined) element.setAttribute("alt", value);
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const value = dictionary[element.dataset.i18nPlaceholder];
        if (value !== undefined) element.setAttribute("placeholder", value);
      });
      document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        const value = dictionary[element.dataset.i18nAriaLabel];
        if (value !== undefined) element.setAttribute("aria-label", value);
      });

      const nextLanguage = LANGS[(LANGS.indexOf(this.lang) + 1) % LANGS.length];
      if (this.langBtn) {
        this.langBtn.innerHTML = `${this.lang.toUpperCase()} <span class="lang-chevron" aria-hidden="true">⌄</span>`;
        this.langBtn.setAttribute("aria-label", `${dictionary["common.changeLanguage"]} (${nextLanguage.toUpperCase()})`);
      }
      document.querySelectorAll("[data-language-option]").forEach((button) => {
        const selected = button.dataset.languageOption === this.lang;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-selected", String(selected));
      });
      if (this.footerLangBtn) this.footerLangBtn.textContent = LANGS.map((language) => language.toUpperCase()).join(" / ");

      try { localStorage.setItem(STORAGE_KEY, this.lang); } catch (error) { /* Continue without persistence. */ }
      if (location.protocol === "http:" || location.protocol === "https:") {
        const url = new URL(location.href);
        url.searchParams.set("lang", this.lang);
        history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
      window.dispatchEvent(new CustomEvent("luna:languagechange", { detail: { lang: this.lang } }));
    }
  }

  return LanguageToggle;
})();
