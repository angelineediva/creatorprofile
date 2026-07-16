# Yapp — Appearance Customization Prototype

A static HTML/CSS/JS prototype of the Profile Color System described in
`Yapp — Profile Color System & Component Spec`. No build step, no
frameworks, no external requests — open `index.html` in any browser.

```
index.html   structure: sidebar controls + live profile preview
style.css    design tokens (CSS custom properties) + every component
script.js    color math, state, event wiring, the "click to learn a token" feature
```

## The rule this prototype enforces

The creator only ever sets **three colors** (+ a banner style):

- `--background`
- `--primary`
- `--secondary`

Everything else — text color, icon color, card surfaces, borders, hover
and disabled states — is **derived** in `computeDerivedTokens()` in
`script.js`, never hand-picked. No component in `style.css` references a
raw hex; every rule reads `var(--token)`.

| Token | Who sets it | What reads it |
|---|---|---|
| `--background` | Creator | Page background, cards, surfaces (via derived `--surface`) |
| `--primary` | Creator | Send Tip, Subscribe, Unlock, Join, Direct Message (outline), link buttons (outline), active tab |
| `--secondary` | Creator | Follow (outline), gradients (banner, exclusive filter, sticky bar) |
| `--text` / `--text-secondary` | Auto (system) | All copy and icons — computed for contrast against `--background` |
| `--surface` / `--border` | Auto (system) | Cards, dividers, inputs, Share/Back buttons |
| `--yapp-fixed` | Fixed brand | Verified badge, exclusive-post lock badge, active nav icon — never affected by creator colors |

Auto-contrast uses the real WCAG relative-luminance formula and picks
whichever of black/white clears a higher contrast ratio against the
background — not a naive midpoint check.

## Curated vs. Custom

Picking a preset (Default / Sunset / Ocean / Forest / Midnight) just
writes the same three seed values a manual edit would. Editing any color
picker afterward flips the active card to **Custom** automatically —
there's a single render path, no branching between "theme mode" and
"custom mode" (per spec §6).

## Bonus: click-to-learn

Click things in the live preview and the sidebar tells you which token
they're wired to, then highlights that control:

- **Banner** → opens the Banner section (Gradient vs. Solid)
- **Send Tip / Subscribe / Unlock / Join** → highlights **Primary**
- **Follow** → highlights **Secondary**
- **Direct Message** → highlights **Primary** (called out as outline, not filled)
- **Share / Back** → explains these are neutral **Surface**, not brand color
- Empty page background → highlights **Background**

## Responsive

Breakpoints at 1024px (sidebar moves above the preview) and 520px
(single-column mobile layout, stacked action buttons). Focus states are
visible for keyboard users, and `prefers-reduced-motion` disables all
transitions/animations.

## Known simplifications vs. the full spec

- Shop tab is a lightweight placeholder (spec doesn't detail Shop
  components beyond the tab itself).
- The "Support / Tip widget container" open decision (§8) is resolved
  here as **Primary**, per the spec's own recommendation.
- Secondary is a manual picker here for demo purposes; the spec's
  open decision recommends eventually auto-recommending it from
  Primary, with manual override later.
