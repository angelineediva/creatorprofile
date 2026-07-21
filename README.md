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
| `--primary` | Creator | Send Tip, Subscribe, Unlock, Join, Direct Message (outline), active tab text, gradients (banner, exclusive filter, sticky bar, support widget) |
| `--secondary` (Accent) | Creator | Follow (outline), **link buttons** (outline), tab **active-underline**, chip **selected/hover** state |
| `--text` / `--text-secondary` | Auto (system) | All copy and icons — computed for contrast against `--background` |
| `--surface` / `--border` | Auto (system) | Cards, dividers, inputs, Share/Back buttons |
| `--yapp-fixed` | Fixed brand | Verified badge, exclusive-post lock badge, active nav icon — never affected by creator colors |
| `--yapp-avatar-fallback` | Fixed, per-user | Avatar initials circle (main profile, feed post author, membership tier) — hash-generated per user in the real app, never Primary/Secondary |

**Decided 2026-07-21** (updates to the original spec, reflected in the code above):
- Link buttons moved from Primary → **Secondary/Accent**.
- Tab active-underline moved from Primary → **Secondary/Accent** (the active tab's *text* color stays Primary — only the underline bar changed).
- Tag/badge hover-or-selected states → **Secondary/Accent**. This prototype's closest match is the amount-selector **chip** in the Support widget (`chip-selected`, `chip:hover`); there's no literal category-tag component in this simplified build.
- Analytics/chart highlight color is explicitly **out of scope** — not modeled here, and not Accent-driven if it's ever added.
- Avatar fallback (the initials circle) is a **fixed, hash-generated-per-user color** — not a creator token. This static demo only ever renders one user's initials ("TL"), so `--yapp-avatar-fallback` is hardcoded to one representative pink-orange gradient rather than actually hashing anything.
- Verified-badge tint is confirmed **fixed system color** (already implemented correctly pre-2026-07-21 via `--yapp-fixed`; no code change needed).
- Contrast enforcement is **warn-only**: the sidebar shows a non-blocking warning (`#contrastWarning`) when Primary or Secondary drops below a 3:1 contrast ratio against Background, but Save is never disabled.

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
- **Follow** → highlights **Secondary (Accent)**
- **Link buttons** (Links tab) → highlights **Secondary (Accent)**
- **Direct Message** → highlights **Primary** (called out as outline, not filled)
- **Avatar** → explains it's a **fixed, per-user color**, not a creator token
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
