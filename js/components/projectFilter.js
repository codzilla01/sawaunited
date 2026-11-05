/**
 * Handles project filter interactions.
 * Project cards live directly in index.html; JavaScript only changes visibility.
 */
window.Luna = window.Luna || {};

Luna.ProjectFilter = (function () {
  class ProjectFilter {
    constructor({ filtersEl, gridEl }) {
      this.filtersEl = filtersEl;
      this.gridEl = gridEl;
      this.buttons = Array.from(filtersEl.querySelectorAll("[data-filter]"));
      this.cards = Array.from(gridEl.querySelectorAll(".property-card"));
    }

    init() {
      this.buttons.forEach((button) => {
        button.addEventListener("click", () => this.setFilter(button.dataset.filter));
      });
    }

    setFilter(filter) {
      this.buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === filter);
      });

      this.cards.forEach((card) => {
        const visible = filter === "ALL" || card.dataset.sector === filter;
        card.hidden = !visible;
      });
    }
  }

  return ProjectFilter;
})();
