/**
 * Adds the `.in-view` class to `.reveal` elements as they scroll into
 * view. Falls back to marking everything visible immediately when
 * IntersectionObserver is unavailable or the user prefers reduced motion.
 */
window.Luna = window.Luna || {};

Luna.ScrollReveal = (function () {
  const OBSERVER_OPTIONS = { threshold: 0.14, rootMargin: "0px 0px -6% 0px" };

  class ScrollReveal {
    constructor() {
      this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.observer =
        "IntersectionObserver" in window && !this.reduceMotion
          ? new IntersectionObserver((entries) => this._onIntersect(entries), OBSERVER_OPTIONS)
          : null;
    }

    _onIntersect(entries) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        this.observer.unobserve(entry.target);
      });
    }

    observe(root) {
      const scope = root || document;
      const items = Array.from(scope.querySelectorAll(".reveal:not(.in-view)"));
      items.forEach((el, index) => {
        // Alternate entrance direction and add a gentle stagger per visual group.
        if (!el.classList.contains("reveal-left") && !el.classList.contains("reveal-right") && !el.classList.contains("reveal-zoom")) {
          const mode = index % 3;
          if (mode === 0) el.classList.add("reveal-left");
          else if (mode === 1) el.classList.add("reveal-zoom");
          else el.classList.add("reveal-right");
        }
        if (!el.style.getPropertyValue("--reveal-delay")) {
          el.style.setProperty("--reveal-delay", `${Math.min((index % 6) * 70, 350)}ms`);
        }
        if (this.observer) this.observer.observe(el);
        else el.classList.add("in-view");
      });
    }
  }

  return ScrollReveal;
})();
