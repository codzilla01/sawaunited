/**
 * Toggles the header's "solid" background once the page scrolls past a
 * threshold. Scroll handling is throttled to one check per animation frame.
 */
window.Luna = window.Luna || {};

Luna.HeaderScroll = (function () {
  const SOLID_THRESHOLD_PX = 25;

  class HeaderScroll {
    constructor(headerEl) {
      this.headerEl = headerEl;
      this._ticking = false;
      this._onScroll = this._onScroll.bind(this);
    }

    init() {
      window.addEventListener("scroll", this._onScroll, { passive: true });
      this._update();
    }

    _onScroll() {
      if (this._ticking) return;
      this._ticking = true;
      requestAnimationFrame(() => {
        this._update();
        this._ticking = false;
      });
    }

    _update() {
      this.headerEl.classList.toggle("header--solid", window.scrollY > SOLID_THRESHOLD_PX);
    }
  }

  return HeaderScroll;
})();
