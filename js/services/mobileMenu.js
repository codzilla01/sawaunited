/**
 * Opens/closes the mobile nav drawer and keeps the menu button's
 * icon + aria attributes in sync with the open state.
 */
window.Luna = window.Luna || {};

Luna.MobileMenu = (function () {
  class MobileMenu {
    constructor(elements) {
      this.menuBtn = elements.menuBtn;
      this.mobileMenu = elements.mobileMenu;
      this.iconMenu = this.menuBtn.querySelector(".icon-menu");
      this.iconClose = this.menuBtn.querySelector(".icon-close");
      this.isOpen = false;
      this._onKeydown = (event) => {
        if (event.key === "Escape" && this.isOpen) this.close();
      };
    }

    init() {
      this.menuBtn.setAttribute("aria-expanded", "false");
      this.menuBtn.setAttribute("aria-controls", this.mobileMenu.id);
      this.menuBtn.addEventListener("click", () => (this.isOpen ? this.close() : this.open()));
      this.mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => this.close());
      });
      document.addEventListener("keydown", this._onKeydown);
    }

    open() {
      this.isOpen = true;
      this.mobileMenu.classList.add("is-open");
      this.mobileMenu.setAttribute("aria-hidden", "false");
      this.menuBtn.setAttribute("aria-expanded", "true");
      this.iconMenu.style.display = "none";
      this.iconClose.style.display = "block";
    }

    close() {
      this.isOpen = false;
      this.mobileMenu.classList.remove("is-open");
      this.mobileMenu.setAttribute("aria-hidden", "true");
      this.menuBtn.setAttribute("aria-expanded", "false");
      this.iconMenu.style.display = "block";
      this.iconClose.style.display = "none";
      this.menuBtn.focus({ preventScroll: true });
    }
  }

  return MobileMenu;
})();
