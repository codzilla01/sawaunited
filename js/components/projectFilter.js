/**
 * Filters the four business-platform cards on projects.html.
 * Cards remain in HTML; this module only controls visibility and status text.
 */
window.Luna = window.Luna || {};

Luna.ProjectFilter = (function () {
  const STATUS = {
    en: {
      all: "Showing all four business platforms",
      one: "Showing the {name} business platform",
      none: "No business platforms match this filter",
    },
    ar: {
      all: "عرض منصات الأعمال الأربع",
      one: "عرض منصة الأعمال: {name}",
      none: "لا توجد منصة أعمال تطابق هذا المرشح",
    },
    fr: {
      all: "Les quatre plateformes d’activité sont affichées",
      one: "Plateforme d’activité affichée : {name}",
      none: "Aucune plateforme d’activité ne correspond à ce filtre",
    },
  };

  class ProjectFilter {
    constructor({ filtersEl, gridEl }) {
      this.filtersEl = filtersEl;
      this.gridEl = gridEl;
      this.statusEl = document.getElementById("filterStatus");
      this.buttons = Array.from(filtersEl.querySelectorAll("[data-filter]"));
      this.cards = Array.from(gridEl.querySelectorAll(".property-card[data-sector]"));
      this.activeFilter = "ALL";
    }

    init() {
      this.buttons.forEach((button) => {
        button.addEventListener("click", () => this.setFilter(button.dataset.filter));
      });
      window.addEventListener("luna:languagechange", () => this.updateStatus());
      this.setFilter("ALL");
    }

    setFilter(filter) {
      const requested = String(filter || "ALL").toUpperCase();
      const isKnown = this.buttons.some((button) => button.dataset.filter === requested);
      this.activeFilter = isKnown ? requested : "ALL";

      this.buttons.forEach((button) => {
        const selected = button.dataset.filter === this.activeFilter;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      this.cards.forEach((card) => {
        card.hidden = this.activeFilter !== "ALL" && card.dataset.sector !== this.activeFilter;
      });

      this.updateStatus();
    }

    updateStatus() {
      if (!this.statusEl) return;
      const lang = Object.prototype.hasOwnProperty.call(STATUS, document.documentElement.lang)
        ? document.documentElement.lang
        : "en";
      const messages = STATUS[lang];
      const visibleCards = this.cards.filter((card) => !card.hidden);

      if (this.activeFilter === "ALL") {
        this.statusEl.textContent = messages.all;
        return;
      }
      if (visibleCards.length === 0) {
        this.statusEl.textContent = messages.none;
        return;
      }

      const selectedButton = this.buttons.find((button) => button.dataset.filter === this.activeFilter);
      const name = selectedButton?.textContent.trim() || "";
      this.statusEl.textContent = messages.one.replace("{name}", name);
    }
  }

  return ProjectFilter;
})();
