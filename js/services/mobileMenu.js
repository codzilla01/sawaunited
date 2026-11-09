/**
 * Responsive navigation toggle with synchronized ARIA state, Escape handling,
 * outside-click dismissal and translated labels.
 */
window.Luna = window.Luna || {};

Luna.MobileMenu = (function () {
  const LABELS = {
    en: { open: "Open menu", close: "Close menu" },
    ar: { open: "فتح القائمة", close: "إغلاق القائمة" },
    fr: { open: "Ouvrir le menu", close: "Fermer le menu" },
  };

  class MobileMenu {
    constructor(elements) {
      this.menuBtn = elements.menuBtn;
      this.mobileMenu = elements.mobileMenu;
      this.iconMenu = this.menuBtn.querySelector(".icon-menu");
      this.iconClose = this.menuBtn.querySelector(".icon-close");
      this.isOpen = false;
      this.onKeydown = (event) => {
        if (event.key === "Escape" && this.isOpen) this.close(true);
      };
      this.onDocumentClick = (event) => {
        if (this.isOpen && !this.mobileMenu.contains(event.target) && !this.menuBtn.contains(event.target)) {
          this.close(false);
        }
      };
      this.onResize = () => {
        if (window.innerWidth > 860 && this.isOpen) this.close(false);
      };
    }

    init() {
      this.menuBtn.setAttribute("aria-controls", this.mobileMenu.id);
      this.mobileMenu.setAttribute("aria-hidden", "true");
      this.menuBtn.addEventListener("click", () => (this.isOpen ? this.close(false) : this.open()));
      this.mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => this.close(false));
      });
      document.addEventListener("keydown", this.onKeydown);
      document.addEventListener("click", this.onDocumentClick);
      window.addEventListener("resize", this.onResize, { passive: true });
      window.addEventListener("luna:languagechange", () => this.syncState());
      this.syncState();
    }

    syncState() {
      const lang = Object.prototype.hasOwnProperty.call(LABELS, document.documentElement.lang)
        ? document.documentElement.lang
        : "en";
      const label = this.isOpen ? LABELS[lang].close : LABELS[lang].open;
      this.menuBtn.setAttribute("aria-expanded", String(this.isOpen));
      this.menuBtn.setAttribute("aria-label", label);
      this.menuBtn.title = label;
      if (this.iconMenu) this.iconMenu.style.display = this.isOpen ? "none" : "block";
      if (this.iconClose) this.iconClose.style.display = this.isOpen ? "block" : "none";
    }

    open() {
      this.isOpen = true;
      this.mobileMenu.classList.add("is-open");
      this.mobileMenu.setAttribute("aria-hidden", "false");
      this.syncState();
    }

    close(returnFocus = false) {
      this.isOpen = false;
      this.mobileMenu.classList.remove("is-open");
      this.mobileMenu.setAttribute("aria-hidden", "true");
      this.syncState();
      if (returnFocus) this.menuBtn.focus({ preventScroll: true });
    }
  }

  return MobileMenu;
})();
