/**
 * Shared dark/light theme toggle for the projects page.
 * Uses the same `sawa_theme` preference as the homepage and tolerates blocked storage.
 */
window.Luna = window.Luna || {};

Luna.ThemeToggle = (function () {
  const STORAGE_KEY = "sawa_theme";
  const DEFAULT_THEME = "dark";
  const LABELS = {
    en: { light: "Switch to light mode", dark: "Switch to dark mode" },
    ar: { light: "التبديل إلى الوضع الفاتح", dark: "التبديل إلى الوضع الداكن" },
    fr: { light: "Passer au thème clair", dark: "Passer au thème sombre" },
  };

  class ThemeToggle {
    constructor(themeBtn) {
      this.themeBtn = themeBtn;
      let storedTheme = "";
      try { storedTheme = localStorage.getItem(STORAGE_KEY) || ""; } catch (error) { /* Storage may be disabled. */ }
      const initialTheme = storedTheme || document.documentElement.dataset.theme || DEFAULT_THEME;
      this.theme = initialTheme === "light" ? "light" : "dark";
    }

    init() {
      this.themeBtn.type = "button";
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
      try { localStorage.setItem(STORAGE_KEY, this.theme); } catch (error) { /* Continue without persistence. */ }
      const lang = Object.prototype.hasOwnProperty.call(LABELS, document.documentElement.lang)
        ? document.documentElement.lang
        : "en";
      const isDark = this.theme === "dark";
      const icon = this.themeBtn.querySelector(".theme-toggle-icon");
      if (icon) icon.textContent = isDark ? "☼" : "☾";
      this.themeBtn.setAttribute("aria-label", isDark ? LABELS[lang].light : LABELS[lang].dark);
      this.themeBtn.setAttribute("aria-pressed", String(!isDark));
    }
  }

  return ThemeToggle;
})();
