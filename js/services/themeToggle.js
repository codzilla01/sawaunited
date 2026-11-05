/**
 * Toggles the dark/light theme, persisting the choice in localStorage
 * and exposing it via `document.documentElement.dataset.theme`.
 */
window.Luna = window.Luna || {};

Luna.ThemeToggle = (function () {
  const STORAGE_KEY = "luna-theme";
  const DEFAULT_THEME = "dark";
  // Kept local (not in the central i18n dictionary) since it's only two
  // short labels per language; mirrors how projectModal.js keeps its own
  // small per-language data rather than depending on LanguageToggle's
  // internals.
  const LABELS = {
    en: { light: "LIGHT MODE", dark: "DARK MODE" },
    ar: { light: "الوضع الفاتح", dark: "الوضع الداكن" },
    fr: { light: "MODE CLAIR", dark: "MODE SOMBRE" },
  };

  class ThemeToggle {
    constructor(themeBtn) {
      this.themeBtn = themeBtn;
      this.theme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    }

    init() {
      this.themeBtn.type = "button";
      this.themeBtn.setAttribute("aria-pressed", "false");
      this.themeBtn.addEventListener("click", () => this.toggle());
      window.addEventListener("luna:languagechange", () => this._apply());
      this._apply();
    }

    toggle() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      this._apply();
    }

    _apply() {
      document.documentElement.dataset.theme = this.theme;
      localStorage.setItem(STORAGE_KEY, this.theme);
      const lang = LABELS[document.documentElement.lang] ? document.documentElement.lang : "en";
      const isDark = this.theme === "dark";
      const icon = this.themeBtn.querySelector(".theme-toggle-icon");
      if (icon) icon.textContent = isDark ? "☀" : "☾";
      this.themeBtn.setAttribute("aria-label", isDark ? LABELS[lang].light : LABELS[lang].dark);
      this.themeBtn.setAttribute("aria-pressed", isDark ? "false" : "true");
    }
  }

  return ThemeToggle;
})();
