/**
 * Sawa United — EN / AR / FR internationalization.
 * Keeps the existing HTML/CSS structure and only swaps text + document direction.
 */
window.Luna = window.Luna || {};

Luna.LanguageToggle = (function () {
  const STORAGE_KEY = "luna-language";
  const LANGS = ["en", "ar", "fr"];

  const translations = {
    en: {
      "page.title":"Sawa United",
      "page.description":"We build, operate and invest across key markets for sustainable growth and long-term value.",
      "sector.food":"FOOD","sector.automotive":"AUTOMOTIVE","sector.realEstate":"REAL ESTATE","sector.energy":"ENERGY","sector.foodDesc":"Building and operating focused platforms with a long-term approach to growth and value.","sector.automotiveDesc":"Connected capabilities and partnerships designed to create practical opportunities across markets.","sector.realEstateDesc":"Developing assets and business platforms with disciplined execution and a long-term view.","sector.energyDesc":"Creating scalable platforms that connect investment, operations and sustainable growth.","location.egypt":"EGYPT","location.uae":"UAE","location.mena":"MENA","stats.years":"YEARS OF GROWTH","stats.sectors":"BUSINESS SECTORS","stats.markets":"MARKETS","stats.projects":"PROJECTS","stats.people":"PEOPLE","contact.emailLabel":"EMAIL","contact.phoneLabel":"PHONE","contact.addressLabel":"ADDRESS","form.fullNamePlaceholder":"Your name","form.phonePlaceholder":"01011225592","form.companyPlaceholder":"Company","form.countryPlaceholder":"Country","form.messagePlaceholder":"Tell us how we can help","footer.emailPlaceholder":"Your email address","common.close":"Close",
      "nav.who":"WHO WE ARE","nav.businesses":"BUSINESSES","nav.projects":"PROJECTS","nav.impact":"IMPACT","nav.presence":"GLOBAL PRESENCE","nav.news":"NEWS","nav.careers":"CAREERS",
      "common.getInTouch":"GET IN TOUCH","common.visitWebsite":"Visit Website","common.changeLanguage":"Change language","alt.food":"Food business","alt.automotive":"Automotive business","alt.realEstate":"Real estate business","alt.energy":"Energy business","alt.petroleum":"Petroleum business","alt.corporate":"Modern corporate environment","alt.property":"Contemporary business property","alt.map":"Global presence map showing Morocco, Saudi Arabia, United Arab Emirates and Kuwait","alt.sawa":"SAWA UNITED","alt.northstar":"MASHARY CARS","alt.horizon":"START WALK","alt.crossmarket":"SAWA FOOD",
"common.sector":"SECTOR","common.learnMore":"Learn More","common.scroll":"SCROLL","common.contact":"Contact","common.home":"HOME","common.backHome":"BACK TO HOME",
      "hero.eyebrow":"GLOBAL BUSINESS GROUP","hero.line1":"We Build Businesses.","hero.line2":"","hero.line3":"","hero.impact":"You See the Impact.",
      "hero.description":"We build, operate and invest across key markets for sustainable growth and long-term value.",
      "hero.explore":"EXPLORE OUR BUSINESSES","hero.trusted":"Trusted","hero.businessGroup":"Business Group","hero.connected":"Connected","hero.marketsPartners":"Markets & Partners",
      "business.eyebrow":"OUR BUSINESS ECOSYSTEM","business.our":"Our","business.business":"Business","business.sectors":"Sectors",
      "business.description":"Focused businesses. One standard for performance, trust and long-term growth.",
      "why.eyebrow":"WHY SAWA UNITED?","why.built":"Built for","why.growth":"Growth.","why.designed":"Designed for","why.value":"Value.",
      "why.item1":"Experienced multi-sector leadership","why.item2":"Connected markets and capabilities","why.item3":"Long-term investment mindset","why.item4":"Responsible, transparent operations","why.item5":"Partnerships built to last","why.learn":"LEARN MORE ABOUT US",
      "about.eyebrow":"ABOUT SAWA UNITED","about.title":"We Take Care<br/><span>So You Can Build.</span>","about.description":"A diversified group building businesses, developing assets and creating practical opportunities across markets—with disciplined execution and a long-term view.","about.discover":"DISCOVER OUR STORY",
      "projects.eyebrow":"FEATURED PROJECTS","projects.selected":"Selected","projects.projects":"Projects","projects.description":"A selection of assets, ventures and development initiatives across our ecosystem.",
      "filters.all":"ALL","filters.food":"FOOD","filters.automotive":"AUTOMOTIVE","filters.realEstate":"REAL ESTATE","filters.energy":"ENERGY","filters.petroleum":"PETROLEUM",
      "presence.eyebrow":"GLOBAL PRESENCE","presence.connected":"Connected by","presence.opportunity":"Opportunity.","presence.description":"A connected network of markets, partners and capabilities that creates new routes for growth.","presence.work":"WORK WITH US",
      "contact.eyebrow":"CONTACT SAWA UNITED","contact.title":"Let's Build<br/><span>What's Next.</span>","contact.description":"Partner with us, explore an opportunity, or discover our businesses.",
      "form.fullName":"FULL NAME","form.phone":"PHONE NUMBER","form.company":"COMPANY","form.country":"COUNTRY","form.message":"MESSAGE","form.send":"SEND MESSAGE",
      "footer.tagline":"Building businesses. Creating impact.","footer.quickLinks":"QUICK LINKS","footer.ourSectors":"OUR SECTORS","footer.usefulLinks":"USEFUL LINKS","footer.privacy":"Privacy Policy","footer.newsletter":"NEWSLETTER","footer.subscribe":"Subscribe for occasional updates on Sawa United.","footer.subscribeBtn":"SUBSCRIBE","footer.rights":"ALL RIGHTS RESERVED.","hero.pill1":"BUILD","hero.pill2":"OPERATE","hero.pill3":"INVEST","projects.viewAll":"VIEW ALL PROJECTS","projects.pageTitle":"Our <span>Projects</span>","contact.whatsapp":"WhatsApp","contact.whatsappText":"Start a direct conversation","contact.emailCta":"Email","contact.emailText":"Send us your inquiry",
      "projects.metaTitle":"Sawa United — Projects","projects.metaDescription":"Explore Sawa United projects across real estate, automotive, petroleum and food."
    },
    ar: {
      "page.title":"سوا يونايتد","page.description":"نبني وندير ونستثمر في أسواق رئيسية لتحقيق نمو مستدام وقيمة طويلة الأجل.",
      "sector.food":"الأغذية","sector.automotive":"السيارات","sector.realEstate":"العقارات","sector.energy":"الطاقة","sector.foodDesc":"نبني وندير منصات متخصصة بمنهج طويل الأجل للنمو وتحقيق القيمة.","sector.automotiveDesc":"قدرات وشراكات مترابطة لخلق فرص عملية عبر الأسواق.","sector.realEstateDesc":"نطور الأصول ومنصات الأعمال بتنفيذ منضبط ورؤية طويلة الأجل.","sector.energyDesc":"ننشئ منصات قابلة للتوسع تربط بين الاستثمار والتشغيل والنمو المستدام.","sector.petroleum":"البترول","sector.petroleumDesc":"نبني عمليات وفرص توريد في قطاع البترول بمنهج عملي ورؤية طويلة الأجل للنمو وتحقيق القيمة.","location.egypt":"مصر","location.uae":"الإمارات","location.mena":"منطقة الشرق الأوسط وشمال أفريقيا","stats.years":"سنوات من النمو","stats.sectors":"قطاعات أعمال","stats.markets":"أسواق","stats.projects":"مشروعات","stats.people":"موظفًا","contact.emailLabel":"البريد الإلكتروني","contact.phoneLabel":"الهاتف","contact.addressLabel":"العنوان","form.fullNamePlaceholder":"اكتب اسمك","form.phonePlaceholder":"01011225592","form.companyPlaceholder":"الشركة","form.countryPlaceholder":"الدولة","form.messagePlaceholder":"أخبرنا كيف يمكننا مساعدتك","footer.emailPlaceholder":"بريدك الإلكتروني","common.close":"إغلاق",
      "nav.who":"من نحن","nav.businesses":"قطاعات الأعمال","nav.projects":"المشروعات","nav.impact":"الأثر","nav.presence":"الحضور العالمي","nav.news":"الأخبار","nav.careers":"الوظائف",
      "common.getInTouch":"تواصل معنا","common.visitWebsite":"زيارة الموقع","common.changeLanguage":"تغيير اللغة","alt.food":"قطاع الأغذية","alt.automotive":"قطاع السيارات","alt.realEstate":"قطاع العقارات","alt.energy":"قطاع الطاقة","alt.petroleum":"قطاع البترول","alt.corporate":"بيئة أعمال عصرية","alt.property":"عقار أعمال معاصر","alt.map":"خريطة للحضور العالمي توضح المغرب والسعودية والإمارات والكويت","alt.sawa":"سوا يونايتد","alt.northstar":"ماشيري كارز","alt.horizon":"ستارت ووك","alt.crossmarket":"سوا فود",
"common.sector":"قطاع","common.learnMore":"اعرف المزيد","common.scroll":"مرر للأسفل","common.contact":"تواصل","common.home":"الرئيسية","common.backHome":"العودة للرئيسية",
      "hero.eyebrow":"مجموعة أعمال عالمية","hero.line1":"نبني الأعمال.","hero.line2":"","hero.line3":"","hero.impact":"ونصنع الأثر.",
      "hero.description":"نبني وندير ونستثمر عبر أسواق رئيسية لنحقق نموًا مستدامًا وقيمة طويلة الأجل.",
      "hero.explore":"استكشف قطاعات أعمالنا","hero.trusted":"مجموعة","hero.businessGroup":"أعمال موثوقة","hero.connected":"أسواق","hero.marketsPartners":"وشركاء مترابطون",
      "business.eyebrow":"منظومة أعمالنا","business.our":"قطاعات","business.business":"أعمال","business.sectors":"متنوعة",
      "business.description":"أعمال متخصصة، ومعيار واحد للأداء والثقة والنمو طويل الأجل.",
      "why.eyebrow":"لماذا سوا يونايتد؟","why.built":"نبني من أجل","why.growth":"النمو.","why.designed":"ونصمم من أجل","why.value":"القيمة.",
      "why.item1":"قيادة وخبرة متعددة القطاعات","why.item2":"أسواق وقدرات مترابطة","why.item3":"رؤية استثمارية طويلة الأجل","why.item4":"تشغيل مسؤول وشفاف","why.item5":"شراكات تدوم طويلًا","why.learn":"اعرف المزيد عنا",
      "about.eyebrow":"عن سوا يونايتد","about.title":"نهتم بالتفاصيل<br/><span>لتبني أنت المستقبل.</span>","about.description":"مجموعة متنوعة نبني فيها الأعمال ونطور الأصول ونخلق فرصًا عملية عبر الأسواق، بتنفيذ منضبط ورؤية طويلة الأجل.","about.discover":"اكتشف قصتنا",
      "projects.eyebrow":"مشروعات مميزة","projects.selected":"مشروعات","projects.projects":"مختارة","projects.description":"مجموعة مختارة من الأصول والمشروعات والمبادرات ضمن منظومتنا.",
      "filters.all":"الكل","filters.food":"الأغذية","filters.automotive":"السيارات","filters.realEstate":"العقارات","filters.energy":"الطاقة","filters.petroleum":"البترول",
      "presence.eyebrow":"حضور عالمي","presence.connected":"نترابط من خلال","presence.opportunity":"الفرص.","presence.description":"شبكة مترابطة من الأسواق والشركاء والقدرات تفتح مسارات جديدة للنمو.","presence.work":"اعمل معنا",
      "contact.eyebrow":"تواصل مع سوا يونايتد","contact.title":"لنبنِ معًا<br/><span>ما هو قادم.</span>","contact.description":"شاركنا شراكة، أو استكشف فرصة، أو تعرف أكثر على أحد قطاعات أعمالنا.",
      "form.fullName":"الاسم بالكامل","form.phone":"رقم الهاتف","form.company":"الشركة","form.country":"الدولة","form.message":"الرسالة","form.send":"إرسال الرسالة",
      "footer.tagline":"نبني الأعمال. نصنع الأثر.","footer.quickLinks":"روابط سريعة","footer.ourSectors":"قطاعاتنا","footer.usefulLinks":"روابط مفيدة","footer.privacy":"سياسة الخصوصية","footer.newsletter":"النشرة البريدية","footer.subscribe":"اشترك للحصول على تحديثات دورية من لونا جلوبال.","footer.subscribeBtn":"اشترك","footer.rights":"جميع الحقوق محفوظة.","hero.pill1":"نبني","hero.pill2":"ندير","hero.pill3":"نستثمر","projects.viewAll":"عرض كل المشروعات","projects.pageTitle":"مشروعاتنا <span>المميزة</span>","contact.whatsapp":"واتساب","contact.whatsappText":"ابدأ محادثة مباشرة","contact.emailCta":"البريد الإلكتروني","contact.emailText":"أرسل استفسارك",
      "projects.metaTitle":"لونا جلوبال — المشروعات","projects.metaDescription":"استكشف مشروعات لونا جلوبال في العقارات والسيارات والطاقة والأغذية."
    },
    fr: {
      "page.title":"Sawa United — Construire des entreprises. Créer de l'impact.","page.description":"Sawa United — Construire des entreprises et créer de l'impact.",
      "sector.food":"AGROALIMENTAIRE","sector.automotive":"AUTOMOBILE","sector.realEstate":"IMMOBILIER","sector.energy":"ÉNERGIE","sector.foodDesc":"Nous développons et opérons des plateformes ciblées avec une vision de croissance et de valeur à long terme.","sector.automotiveDesc":"Des capacités et partenariats connectés pour créer des opportunités concrètes sur les marchés.","sector.realEstateDesc":"Nous développons des actifs et plateformes d’affaires avec une exécution rigoureuse et une vision à long terme.","sector.energyDesc":"Nous créons des plateformes évolutives reliant investissement, opérations et croissance durable.","sector.petroleum":"PÉTROLE","sector.petroleumDesc":"Nous développons des opérations et opportunités d’approvisionnement pétrolier avec une vision de croissance à long terme.","location.egypt":"ÉGYPTE","location.uae":"ÉMIRATS ARABES UNIS","location.mena":"MOYEN-ORIENT ET AFRIQUE DU NORD","stats.years":"ANNÉES DE CROISSANCE","stats.sectors":"SECTEURS D’ACTIVITÉ","stats.markets":"MARCHÉS","stats.projects":"PROJETS","stats.people":"COLLABORATEURS","contact.emailLabel":"E-MAIL","contact.phoneLabel":"TÉLÉPHONE","contact.addressLabel":"ADRESSE","form.fullNamePlaceholder":"Votre nom","form.phonePlaceholder":"01011225592","form.companyPlaceholder":"Entreprise","form.countryPlaceholder":"Pays","form.messagePlaceholder":"Dites-nous comment nous pouvons vous aider","footer.emailPlaceholder":"Votre adresse e-mail","common.close":"Fermer",
      "nav.who":"QUI SOMMES-NOUS","nav.businesses":"ACTIVITÉS","nav.projects":"PROJETS","nav.impact":"IMPACT","nav.presence":"PRÉSENCE MONDIALE","nav.news":"ACTUALITÉS","nav.careers":"CARRIÈRES",
      "common.getInTouch":"NOUS CONTACTER","common.visitWebsite":"Visiter le site","common.changeLanguage":"Changer de langue","alt.food":"Activité agroalimentaire","alt.automotive":"Activité automobile","alt.realEstate":"Activité immobilière","alt.energy":"Activité énergétique","alt.petroleum":"Activité pétrolière","alt.corporate":"Environnement d’entreprise moderne","alt.property":"Actif immobilier contemporain","alt.map":"Carte de présence mondiale montrant le Maroc, l’Arabie saoudite, les Émirats arabes unis et le Koweït","alt.sawa":"SAWA UNITED","alt.northstar":"MASHARY CARS","alt.horizon":"START WALK","alt.crossmarket":"SAWA FOOD",
"common.sector":"SECTEUR","common.learnMore":"En savoir plus","common.scroll":"DÉFILER","common.contact":"Contact","common.home":"ACCUEIL","common.backHome":"RETOUR À L'ACCUEIL",
      "hero.eyebrow":"GROUPE D'ENTREPRISES MONDIAL","hero.line1":"Nous construisons des entreprises.","hero.line2":"","hero.line3":"","hero.impact":"Vous voyez l’impact.",
      "hero.description":"Nous construisons, opérons et investissons sur des marchés clés pour une croissance durable et une valeur à long terme.",
      "hero.explore":"DÉCOUVRIR NOS ACTIVITÉS","hero.trusted":"Groupe","hero.businessGroup":"d'affaires de confiance","hero.connected":"Marchés","hero.marketsPartners":"et partenaires connectés",
      "business.eyebrow":"NOTRE ÉCOSYSTÈME D'ACTIVITÉS","business.our":"Nos","business.business":"secteurs","business.sectors":"d'activité",
      "business.description":"Des activités ciblées, un même standard de performance, de confiance et de croissance à long terme.",
      "why.eyebrow":"POURQUOI SAWA UNITED ?","why.built":"Conçu pour la","why.growth":"croissance.","why.designed":"Pensé pour la","why.value":"valeur.",
      "why.item1":"Une direction expérimentée dans plusieurs secteurs","why.item2":"Des marchés et compétences connectés","why.item3":"Une vision d'investissement à long terme","why.item4":"Des opérations responsables et transparentes","why.item5":"Des partenariats conçus pour durer","why.learn":"EN SAVOIR PLUS SUR NOUS",
      "about.eyebrow":"À PROPOS DE SAWA UNITED","about.title":"Nous prenons soin<br/><span>pour vous permettre de construire.</span>","about.description":"Un groupe diversifié qui construit des entreprises et développe des actifs sur plusieurs marchés, avec une exécution rigoureuse et une vision à long terme.","about.discover":"DÉCOUVRIR NOTRE HISTOIRE",
      "projects.eyebrow":"PROJETS À L'AFFICHE","projects.selected":"Projets","projects.projects":"sélectionnés","projects.description":"Une sélection d'actifs, d'entreprises et d'initiatives de développement de notre écosystème.",
      "filters.all":"TOUS","filters.food":"AGROALIMENTAIRE","filters.automotive":"AUTOMOBILE","filters.realEstate":"IMMOBILIER","filters.energy":"ÉNERGIE","filters.petroleum":"PÉTROLE",
      "presence.eyebrow":"PRÉSENCE MONDIALE","presence.connected":"Connectés par","presence.opportunity":"l'opportunité.","presence.description":"Un réseau connecté de marchés, de partenaires et de compétences qui ouvre de nouvelles voies de croissance.","presence.work":"TRAVAILLER AVEC NOUS",
      "contact.eyebrow":"CONTACTER SAWA UNITED","contact.title":"Construisons<br/><span>la suite.</span>","contact.description":"Devenez partenaire, explorez une opportunité ou découvrez nos activités.",
      "form.fullName":"NOM COMPLET","form.phone":"NUMÉRO DE TÉLÉPHONE","form.company":"ENTREPRISE","form.country":"PAYS","form.message":"MESSAGE","form.send":"ENVOYER LE MESSAGE",
      "footer.tagline":"Construire des entreprises. Créer de l'impact.","footer.quickLinks":"LIENS RAPIDES","footer.ourSectors":"NOS SECTEURS","footer.usefulLinks":"LIENS UTILES","footer.privacy":"Politique de confidentialité","footer.newsletter":"NEWSLETTER","footer.subscribe":"Recevez occasionnellement les actualités de Sawa United.","footer.subscribeBtn":"S'ABONNER","footer.rights":"TOUS DROITS RÉSERVÉS.","hero.pill1":"CONSTRUIRE","hero.pill2":"OPÉRER","hero.pill3":"INVESTIR","projects.viewAll":"VOIR TOUS LES PROJETS","projects.pageTitle":"Nos <span>projets</span>","contact.whatsapp":"WhatsApp","contact.whatsappText":"Démarrer une conversation","contact.emailCta":"E-mail","contact.emailText":"Envoyer votre demande",
      "projects.metaTitle":"Sawa United — Projets","projects.metaDescription":"Découvrez les projets de Sawa United dans l'immobilier, l'automobile, le pétrole et l'agroalimentaire."
    }
  };

  class LanguageToggle {
    constructor(elements) {
      this.langBtn = elements.langBtn;
      this.footerLangBtn = elements.footerLangBtn;
      this.lang = new URLSearchParams(location.search).get("lang") || localStorage.getItem(STORAGE_KEY) || "en";
      if (!LANGS.includes(this.lang)) this.lang = "en";
    }
    init() {
      this.langBtn?.addEventListener("click", () => this.toggleMenu());
      this.footerLangBtn?.addEventListener("click", () => this.next());
      document.querySelectorAll("[data-language-option]").forEach(btn => btn.addEventListener("click", () => { this.set(btn.dataset.languageOption); this.closeMenu(); }));
      document.addEventListener("click", e => { if (!e.target.closest("#languageSwitcher")) this.closeMenu(); });
      document.addEventListener("keydown", e => {
        if (e.key === "Escape") this.closeMenu();
      });
      this.apply();
    }
    next() {
      const i = LANGS.indexOf(this.lang);
      this.set(LANGS[(i + 1) % LANGS.length]);
    }
    set(lang) { if (!LANGS.includes(lang)) return; this.lang = lang; this.apply(); }
    toggleMenu() { document.getElementById("languageSwitcher")?.classList.toggle("open"); this.langBtn?.setAttribute("aria-expanded", document.getElementById("languageSwitcher")?.classList.contains("open") ? "true" : "false"); }
    closeMenu() { document.getElementById("languageSwitcher")?.classList.remove("open"); this.langBtn?.setAttribute("aria-expanded","false"); }
    apply() {
      const dict = translations[this.lang];
      document.documentElement.lang = this.lang;
      document.documentElement.dir = this.lang === "ar" ? "rtl" : "ltr";
      document.documentElement.dataset.lang = this.lang;
      // Pages other than the homepage set data-i18n-page (e.g. "projects")
      // on <html> so they get their own <title>/description instead of
      // silently inheriting the homepage's.
      const page = document.documentElement.dataset.i18nPage;
      const titleKey = page ? `${page}.metaTitle` : "page.title";
      const descKey = page ? `${page}.metaDescription` : "page.description";
      document.title = dict[titleKey] || dict["page.title"];
      const meta = document.getElementById("metaDescription");
      if (meta) meta.setAttribute("content", dict[descKey] || dict["page.description"]);

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (Object.prototype.hasOwnProperty.call(dict, key)) el.innerHTML = dict[key];
      });

      document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
        const key = el.dataset.i18nAlt;
        if (Object.prototype.hasOwnProperty.call(dict, key)) el.setAttribute("alt", dict[key]);
      });

      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (Object.prototype.hasOwnProperty.call(dict, key)) el.setAttribute("placeholder", dict[key]);
      });

      document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        const key = el.dataset.i18nAriaLabel;
        if (Object.prototype.hasOwnProperty.call(dict, key)) el.setAttribute("aria-label", dict[key]);
      });

      const next = LANGS[(LANGS.indexOf(this.lang) + 1) % LANGS.length];
      if (this.langBtn) {
        this.langBtn.innerHTML = this.lang.toUpperCase() + ' <span class="lang-chevron">⌄</span>';
        this.langBtn.setAttribute("aria-label", `${dict["common.changeLanguage"] || "Change language"} (${next.toUpperCase()})`);
      }
      document.querySelectorAll("[data-language-option]").forEach(btn => btn.classList.toggle("active", btn.dataset.languageOption === this.lang));
      if (this.footerLangBtn) this.footerLangBtn.textContent = LANGS.map(x => x.toUpperCase()).join(" / ");
      localStorage.setItem(STORAGE_KEY, this.lang);
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
