/**
 * Accessible, language-aware details dialog for the four business platforms.
 * Uses only local illustrative images and links to the sector websites already
 * listed by the group; no remote image proxy or speculative project metadata.
 */
(() => {
  const data = {
    realEstate: {
      sector: { en: "REAL ESTATE", ar: "العقارات", fr: "IMMOBILIER" },
      title: { en: "SAWA UNITED REAL ESTATE", ar: "سوا يونايتد للعقارات", fr: "SAWA UNITED REAL ESTATE" },
      description: {
        en: "A business platform focused on real estate.",
        ar: "منصة أعمال متخصصة في العقارات.",
        fr: "Une plateforme d’activité consacrée à l’immobilier.",
      },
      imageAlt: {
        en: "Illustrative real-estate concept image",
        ar: "صورة توضيحية لمفهوم العقارات",
        fr: "Image illustrative liée à l’immobilier",
      },
      domain: "sawa-united.net",
      image: "portfolio/assets/sector-realestate.webp",
      url: "https://sawa-united.net/",
    },
    food: {
      sector: { en: "FOOD", ar: "الأغذية", fr: "AGROALIMENTAIRE" },
      title: { en: "SAWA FOOD", ar: "سوا فود", fr: "SAWA FOOD" },
      description: {
        en: "A business platform focused on food supplies.",
        ar: "منصة أعمال متخصصة في توريد المواد الغذائية.",
        fr: "Une plateforme d’activité consacrée à l’approvisionnement alimentaire.",
      },
      imageAlt: {
        en: "Illustrative food-supply concept image",
        ar: "صورة توضيحية لمفهوم توريد الأغذية",
        fr: "Image illustrative liée à l’approvisionnement alimentaire",
      },
      domain: "sawafood.net",
      image: "portfolio/assets/sector-food.webp",
      url: "https://sawafood.net/",
    },
    automotive: {
      sector: { en: "AUTOMOTIVE", ar: "السيارات والتنقل", fr: "AUTOMOBILE" },
      title: { en: "MASHARY CARS", ar: "ماشيري كارز", fr: "MASHARY CARS" },
      description: {
        en: "A business platform focused on automotive mobility.",
        ar: "منصة أعمال في قطاع السيارات والتنقل.",
        fr: "Une plateforme d’activité dédiée à la mobilité automobile.",
      },
      imageAlt: {
        en: "Illustrative automotive concept image",
        ar: "صورة توضيحية لمفهوم السيارات والتنقل",
        fr: "Image illustrative liée à la mobilité automobile",
      },
      domain: "masharycar.net",
      image: "portfolio/assets/sector-automotive.webp",
      url: "https://masharycar.net/",
    },
    petroleum: {
      sector: { en: "PETROLEUM", ar: "البترول", fr: "PÉTROLE" },
      title: { en: "START WALK", ar: "ستارت ووك", fr: "START WALK" },
      description: {
        en: "A platform focused on petroleum products and industrial services.",
        ar: "منصة أعمال في مجال مشتقات البترول والخدمات الصناعية.",
        fr: "Une plateforme d’activité dédiée aux produits pétroliers et aux services industriels.",
      },
      imageAlt: {
        en: "Illustrative petroleum-services concept image",
        ar: "صورة توضيحية لمفهوم الخدمات البترولية",
        fr: "Image illustrative liée aux services pétroliers",
      },
      domain: "startwalk.net",
      image: "portfolio/assets/sector-petroleum.webp",
      url: "https://startwalk.net/",
    },
  };

  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const dialog = modal.querySelector('[role="dialog"]');
  const closeButton = modal.querySelector(".project-modal-close");
  const sectorEl = document.getElementById("projectModalSector");
  const titleEl = document.getElementById("projectModalTitle");
  const descriptionEl = document.getElementById("projectModalDescription");
  const imageEl = document.getElementById("projectModalImage");
  const domainEl = document.getElementById("projectModalDomain");
  const mediaEl = modal.querySelector(".project-modal-media");
  const ctaEl = document.getElementById("projectModalCta");
  let currentId = null;
  let lastTrigger = null;

  const getLanguage = () => {
    const lang = document.documentElement.lang;
    return lang === "ar" || lang === "fr" ? lang : "en";
  };

  const localized = (value, lang) => value?.[lang] || value?.en || "";

  const render = () => {
    const item = data[currentId];
    if (!item) return;
    const lang = getLanguage();
    const title = localized(item.title, lang);

    sectorEl.textContent = localized(item.sector, lang);
    titleEl.textContent = title;
    descriptionEl.textContent = localized(item.description, lang);
    domainEl.textContent = item.domain;
    imageEl.alt = localized(item.imageAlt, lang);
    imageEl.hidden = false;
    imageEl.onerror = () => {
      imageEl.hidden = true;
      mediaEl?.classList.add("image-unavailable");
    };
    imageEl.onload = () => mediaEl?.classList.remove("image-unavailable");
    imageEl.src = item.image;
    ctaEl.href = item.url;
    const ctaLabel = ctaEl.querySelector("[data-i18n]")?.textContent.trim() || "Visit website";
    ctaEl.setAttribute("aria-label", `${title} — ${ctaLabel}`);
  };

  const open = (trigger) => {
    const id = trigger?.dataset.project;
    if (!id || !data[id]) return;
    currentId = id;
    lastTrigger = trigger;
    render();
    modal.inert = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("project-modal-active");
    requestAnimationFrame(() => {
      if (modal.classList.contains("open")) closeButton?.focus({ preventScroll: true });
    });
  };

  const close = (restoreFocus = true) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modal.inert = true;
    document.body.classList.remove("modal-open");
    document.documentElement.classList.remove("project-modal-active");
    if (restoreFocus && lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
  };

  const getFocusable = () => Array.from(
    dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  ).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");

  document.querySelectorAll(".project-open[data-project]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      open(trigger);
    });
  });

  modal.querySelectorAll("[data-close-project]").forEach((element) => {
    element.addEventListener("click", () => close());
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = getFocusable();
    if (focusable.length === 0) {
      event.preventDefault();
      closeButton?.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("luna:languagechange", () => {
    if (currentId) render();
  });
})();
