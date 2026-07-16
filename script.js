/* ==========================================================================
   Yapp — Appearance Customization Prototype
   All logic revolves around THREE creator-picked seed colors:
      state.background / state.primary / state.secondary
   Every other visual property (--text, --surface, --border, hover states,
   disabled states) is DERIVED from those three in computeDerivedTokens()
   and written to CSS custom properties. Components never receive a raw hex.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     1. THEME PRESETS
     Each preset supplies the 3 seed colors. Picking one just fills the
     same three inputs a "Custom" edit would — there is no separate
     code path for curated vs custom (per spec §6).
  --------------------------------------------------------------------- */
  const PRESETS = {
    default:  { background: "#FFFFFF", primary: "#6D3EF5", secondary: "#B56CFF" },
    sunset:   { background: "#FFF7ED", primary: "#F97316", secondary: "#FB7185" },
    ocean:    { background: "#EFF8FF", primary: "#2563EB", secondary: "#06B6D4" },
    forest:   { background: "#F0FDF4", primary: "#16A34A", secondary: "#65A30D" },
    midnight: { background: "#111827", primary: "#7C3AED", secondary: "#EC4899" },
  };

  const DEFAULTS = {
    ...PRESETS.default,
    autoText: true,
    bannerStyle: "gradient",
    theme: "default",
  };

  let state = { ...DEFAULTS };

  /* ---------------------------------------------------------------------
     2. COLOR MATH
     Everything downstream of the 3 seeds is computed here — nothing is
     hand-picked. This is what "Auto" means in the token spec.
  --------------------------------------------------------------------- */
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const num = parseInt(full, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function rgbToHex(r, g, b) {
    const c = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return `#${c(r)}${c(g)}${c(b)}`;
  }

  // WCAG relative luminance
  function relativeLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    const chan = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
  }

  function contrastRatio(hexA, hexB) {
    const L1 = relativeLuminance(hexA) + 0.05;
    const L2 = relativeLuminance(hexB) + 0.05;
    return L1 > L2 ? L1 / L2 : L2 / L1;
  }

  // pick whichever of black/white clears the higher contrast ratio against bg
  function autoTextColor(bgHex) {
    const white = "#FFFFFF", black = "#0F0D15";
    return contrastRatio(bgHex, white) >= contrastRatio(bgHex, black) ? white : black;
  }

  function mix(hexA, hexB, weight) {
    const a = hexToRgb(hexA), b = hexToRgb(hexB);
    return rgbToHex(
      a.r + (b.r - a.r) * weight,
      a.g + (b.g - a.g) * weight,
      a.b + (b.b - a.b) * weight
    );
  }

  function computeDerivedTokens(s) {
    const isDark = relativeLuminance(s.background) < 0.5;
    const text = s.autoText ? autoTextColor(s.background) : "#0F0D15";
    const textRgb = hexToRgb(text);

    // surface: background nudged toward the opposite pole so cards separate
    // from the page without introducing a fourth hand-picked color
    const surface = isDark ? mix(s.background, "#FFFFFF", 0.08) : mix(s.background, "#000000", 0.035);
    const border = isDark ? mix(s.background, "#FFFFFF", 0.16) : mix(s.background, "#000000", 0.1);

    return {
      text,
      textSecondary: `rgba(${textRgb.r}, ${textRgb.g}, ${textRgb.b}, 0.62)`,
      surface,
      border,
      primaryHover: mix(s.primary, "#000000", 0.14),
      secondaryHover: mix(s.secondary, "#000000", 0.14),
      primaryDisabled: mix(s.primary, s.background, 0.55),
    };
  }

  /* ---------------------------------------------------------------------
     3. APPLY STATE → CSS custom properties + inputs
  --------------------------------------------------------------------- */
  const preview = document.getElementById("preview");
  const els = {
    bg: document.getElementById("input-background"),
    primary: document.getElementById("input-primary"),
    secondary: document.getElementById("input-secondary"),
    hexBg: document.getElementById("hex-background"),
    hexPrimary: document.getElementById("hex-primary"),
    hexSecondary: document.getElementById("hex-secondary"),
    autoText: document.getElementById("autoTextToggle"),
  };

  function render() {
    const derived = computeDerivedTokens(state);
    const root = document.documentElement.style;
    root.setProperty("--background", state.background);
    root.setProperty("--primary", state.primary);
    root.setProperty("--secondary", state.secondary);
    root.setProperty("--text", derived.text);
    root.setProperty("--text-secondary", derived.textSecondary);
    root.setProperty("--surface", derived.surface);
    root.setProperty("--border", derived.border);
    root.setProperty("--primary-hover", derived.primaryHover);
    root.setProperty("--secondary-hover", derived.secondaryHover);
    root.setProperty("--primary-disabled", derived.primaryDisabled);

    preview.classList.toggle("banner-solid", state.bannerStyle === "solid");

    els.bg.value = state.background;
    els.primary.value = state.primary;
    els.secondary.value = state.secondary;
    els.hexBg.textContent = state.background.toUpperCase();
    els.hexPrimary.textContent = state.primary.toUpperCase();
    els.hexSecondary.textContent = state.secondary.toUpperCase();
    els.autoText.checked = state.autoText;

    document.querySelectorAll(".theme-card").forEach((card) => {
      card.classList.toggle("is-active", card.dataset.theme === state.theme);
    });
    document.querySelectorAll("#bannerStyleToggle .segmented-opt").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.bannerStyle === state.bannerStyle);
    });
  }

  // initialize the little conic-gradient swatches on each theme card from
  // the actual preset values, so the sidebar never hardcodes a color either
  function paintThemeSwatches() {
    document.querySelectorAll("[data-theme-swatch]").forEach((swatch) => {
      const p = PRESETS[swatch.dataset.themeSwatch];
      if (!p) return;
      swatch.style.setProperty("--c1", p.background);
      swatch.style.setProperty("--c2", p.primary);
      swatch.style.setProperty("--c3", p.secondary);
    });
  }

  /* ---------------------------------------------------------------------
     4. EVENT WIRING — theme presets, color pickers, auto-text, banner style
  --------------------------------------------------------------------- */
  function setSeeds(seeds, themeName) {
    state = { ...state, ...seeds, theme: themeName || "custom" };
    render();
  }

  document.getElementById("themeGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".theme-card");
    if (!card) return;
    const key = card.dataset.theme;
    if (key === "custom") {
      state.theme = "custom";
      render();
      return;
    }
    setSeeds(PRESETS[key], key);
  });

  function onColorInput(key, hexEl) {
    return (e) => {
      state[key] = e.target.value;
      state.theme = "custom";
      hexEl.textContent = e.target.value.toUpperCase();
      render();
    };
  }
  els.bg.addEventListener("input", onColorInput("background", els.hexBg));
  els.primary.addEventListener("input", onColorInput("primary", els.hexPrimary));
  els.secondary.addEventListener("input", onColorInput("secondary", els.hexSecondary));

  els.autoText.addEventListener("change", (e) => {
    state.autoText = e.target.checked;
    render();
  });

  document.getElementById("bannerStyleToggle").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-banner-style]");
    if (!btn) return;
    state.bannerStyle = btn.dataset.bannerStyle;
    render();
  });

  /* ---------------------------------------------------------------------
     5. RESET / SAVE
  --------------------------------------------------------------------- */
  const toast = document.getElementById("saveToast");
  let toastTimer = null;
  function showSaved() {
    clearTimeout(toastTimer);
    toast.classList.add("is-visible");
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
  }

  function resetAll() {
    state = { ...DEFAULTS };
    render();
  }

  [document.getElementById("resetBtn"), document.getElementById("resetBtnTop")].forEach((b) =>
    b.addEventListener("click", resetAll)
  );
  [document.getElementById("saveBtn"), document.getElementById("saveBtnTop")].forEach((b) =>
    b.addEventListener("click", showSaved)
  );

  /* ---------------------------------------------------------------------
     6. TABS
  --------------------------------------------------------------------- */
  document.getElementById("tabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t === tab));
    const name = tab.dataset.tab;
    document.querySelectorAll(".tab-panel").forEach((p) =>
      p.classList.toggle("is-active", p.dataset.panel === name)
    );
  });

  /* ---------------------------------------------------------------------
     7. BONUS — click the preview to learn the token system
     Clicking a live element highlights the sidebar control that drives it
     and drops a one-line explanation into the token teacher banner.
  --------------------------------------------------------------------- */
  const teacher = document.getElementById("tokenTeacher");
  const teacherDot = document.getElementById("tokenTeacherDot");
  const teacherText = document.getElementById("tokenTeacherText");
  document.getElementById("tokenTeacherClose").addEventListener("click", () => {
    teacher.hidden = true;
  });

  function teach(tokenColorVar, html) {
    teacherDot.style.background = tokenColorVar;
    teacherText.innerHTML = html;
    teacher.hidden = false;
  }

  function highlightRow(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    row.classList.remove("row-highlight");
    // restart animation
    void row.offsetWidth;
    row.classList.add("row-highlight");
    setTimeout(() => row.classList.remove("row-highlight"), 2800);
  }

  function highlightSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove("row-highlight");
    void el.offsetWidth;
    el.classList.add("row-highlight");
    setTimeout(() => el.classList.remove("row-highlight"), 2800);
  }

  preview.addEventListener("click", (e) => {
    // 1. Banner → open Banner settings
    if (e.target.closest("#bannerEl") && !e.target.closest("[data-action]")) {
      highlightSection("bannerSection");
      teach("var(--primary)", "You clicked the <b>Banner</b>. It reads Background (Solid) or Primary → Secondary (Gradient) — edit that below.");
      return;
    }

    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) {
      // clicking empty preview chrome = the Background token
      if (e.target === preview || e.target.classList.contains("tab-panel") || e.target.classList.contains("profile-header")) {
        highlightRow("row-background");
        teach("var(--background)", "You clicked the page <b>Background</b>. Every surface and card derives from this color.");
      }
      return;
    }

    const action = actionEl.dataset.action;
    if (action === "subscribe" || action === "tip" || action === "unlock" || action === "join" || action === "unlock-bar") {
      highlightRow("row-primary");
      teach("var(--primary)", `<b>${actionEl.textContent.trim()}</b> is a money action — it always reads the <b>Primary</b> token, filled.`);
    } else if (action === "follow") {
      highlightRow("row-secondary");
      teach("var(--secondary)", "<b>Follow</b> reads the <b>Secondary</b> token, outlined — kept quieter than Primary on purpose.");
    } else if (action === "dm") {
      highlightRow("row-primary");
      teach("var(--primary)", "<b>Direct Message</b> reads <b>Primary</b> too, but at outline emphasis — a supporting action, not the main one.");
    } else if (action === "back" || action === "share") {
      highlightSection("colors-section");
      teach("var(--text)", `<b>${actionEl.textContent.trim()}</b> is a utility action — it uses the neutral <b>Surface</b> token, not your brand colors.`);
    }
  });

  /* ---------------------------------------------------------------------
     8. INIT
  --------------------------------------------------------------------- */
  paintThemeSwatches();
  render();
})();
