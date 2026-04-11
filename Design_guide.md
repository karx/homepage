# Urban Prana — Design System & Brand Guidelines

> Living reference for developers and designers maintaining the Urban Prana web presence.
> Keep this document up to date whenever tokens, components, or patterns change.

---

## 1. Brand Identity

| Attribute | Value |
|---|---|
| **Brand Name** | Urban Prana |
| **Tagline** | Holistic Urban Living through Vastu Shastra & Naturopathy |
| **Mission** | Build the Nature Living toolkit for the modern city dweller — grounded in science and ancient tradition |
| **Tone** | Calm authority. Precise, unhurried prose. No hyperbole or informal shorthand |
| **Visual Persona** | Premium wellness. Think architectural journal meets Ayurvedic retreat — structured, earthy, quietly luxurious |

**What we are not:** harsh contrast, tech-startup energy, excessive decoration, or emoji-driven communication.

---

## 2. Color System

All tokens are declared as CSS custom properties in `assets/css/main.scss` under `:root`.

### Primary Palette

| Token | Hex | Role |
|---|---|---|
| `--up-forest` | `#3A6351` | Primary color. Links, active states, CTA backgrounds, icon default |
| `--up-sage` | `#7DAA92` | Secondary green. Hover accents, gradient endpoints, dividers |
| `--up-gold` | `#C5A55A` | Accent. Eyebrow tags, decorative dividers, pillar icons, hover arrows |
| `--up-gold-light` | `#E8D5A0` | Tinted gold for subtle backgrounds or badge fills |
| `--up-cream` | `#F8F5EF` | Page background. Warm off-white, not pure white |

### Secondary Palette

| Token | Hex | Role |
|---|---|---|
| `--up-earth` | `#8B6847` | Tertiary accent. Tables, blockquotes, warm contrast |
| `--up-terra` | `#C4622D` | Alert/emphasis. Use sparingly |
| `--up-charcoal` | `#252525` | Primary text |
| `--up-muted` | `#6B6860` | Body copy, card descriptions |
| `--up-mist` | `#EDF2EE` | Light section backgrounds (labs, alternating sections) |
| `--up-dark` | `#1E2D2A` | Dark sections (what-section, footer, dark CTAs) |
| `--up-border` | `#E0DBD0` | Card borders, dividers, table rules |

### Usage Rules

- **Never use pure black (`#000`) or pure white (`#fff`)** as page backgrounds or body text — always use `--up-charcoal` and `--up-cream`.
- **Gold is an accent, not a primary action color.** Use `--up-forest` for interactive elements; gold for decorative highlights.
- **Section backgrounds alternate** to create rhythm: cream → dark → cream → mist → white → forest.
- **Text on dark backgrounds** uses `#F8F5EF` at full opacity, body copy at `rgba(248, 245, 239, 0.72)`.

---

## 3. Typography

### Font Stack

| Variable | Family | Use |
|---|---|---|
| `$font-heading` | DM Serif Display, Cormorant Garamond (fallback), Georgia | H1, H2, display text, hero headings |
| `$font-subheading` | Cormorant Garamond, Georgia | H3, H4, card titles, Sanskrit names |
| `$font-body` | Inter, system-ui sans-serif | Body copy, labels, buttons, metadata |

Fonts are loaded from Google Fonts in `_includes/head.html`.

### Type Scale

| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Hero H1 | DM Serif Display | `clamp(2.4rem, 5vw, 4rem)` | 400 | Italic on hero |
| Section H2 | DM Serif Display | `clamp(1.9rem, 3.5vw, 2.8rem)` | 400 | |
| Card H3 | Cormorant Garamond | `1.3–1.4rem` | 600 | |
| Body | Inter | `1rem` | 400 | `line-height: 1.8` |
| Eyebrow/Tag | Inter | `0.7rem` | 600 | `letter-spacing: 0.15em`, uppercase |
| Button | Inter | `0.82rem` | 600 | `letter-spacing: 0.08em`, uppercase |
| Muted/Caption | Inter | `0.88rem` | 400 | `color: --up-muted` |

### Typography Rules

- **Headings use the serif stack.** Body uses Inter exclusively.
- **Letter-spacing on small caps/eyebrows** is `0.12–0.18em` — never apply to large headings.
- **Italic headings** (`font-style: italic`) are reserved for hero H1 and pull-quotes only.
- **Line height:** `1.2` for headings, `1.7–1.8` for body, `1.6` for compact UI text.

---

## 4. Iconography

### SVG Sprite System

All project icons live in a single SVG sprite file: `assets/images/icons.svg`.

Each icon is a `<symbol>` element on a `24×24` viewBox with:
- `fill="none"` — stroke-only style
- `stroke="currentColor"` — inherits CSS color
- `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`

### Rendering an Icon

Use the Liquid partial `_includes/icon.html`:

```liquid
{% include icon.html id="leaf" size="24" %}
{% include icon.html id="compass" size="36" class="service-icon" %}
{% include icon.html id="arrow-right" size="14" label="Navigate to Vastu page" %}
```

| Parameter | Required | Default | Description |
|---|---|---|---|
| `id` | Yes | — | Icon ID (without `icon-` prefix) |
| `size` | No | `24` | Width & height in pixels |
| `class` | No | — | Additional CSS classes on the `<svg>` |
| `label` | No | — | Accessible label. Omit for decorative icons (adds `aria-hidden="true"`) |

### CSS Modifiers

```scss
// Size utilities
.up-icon--sm   // 16px
.up-icon--md   // 24px
.up-icon--lg   // 36px
.up-icon--xl   // 48px

// Color utilities
.up-icon--forest    // var(--up-forest)
.up-icon--gold      // var(--up-gold)
.up-icon--sage      // var(--up-sage)
.up-icon--muted     // var(--up-muted)
```

### Icon Catalogue

#### Five Elements (Pancha Mahabhutas)

| ID | Name | Element | Context |
|---|---|---|---|
| `prithvi` | Mountain peaks | Earth | Element cards, elements page |
| `jal` | Water drop | Water | Element cards, elements page |
| `agni` | Flame | Fire | Element cards, elements page |
| `vayu` | Wind waves | Air | Element cards, elements page |
| `akasha` | Radiant 8-point star | Space | Element cards, pillar — also used for "Pancha Mahabhutas" pillar |

#### Services & Pillars

| ID | Name | Context |
|---|---|---|
| `compass` | Vastu compass (N/S needle) | Vastu consultation service card |
| `leaf` | Single leaf with vein | Naturopathy service, botanical pillar |
| `sprout` | Two-leaf seedling | Biophilic design service, biophilic pillar |
| `grid` | 3×3 Vastu mandala grid | Magnetic geomancy pillar |

#### Brand

| ID | Name | Context |
|---|---|---|
| `lotus` | Five-petal lotus | Brand mark, decorative dividers |
| `sun` | Sun with rays | Energy/vitality, Agni's cosmic form |

#### UI

| ID | Name | Context |
|---|---|---|
| `arrow-right` | Rightward arrow | Service links, read more, inline CTAs |
| `arrow-up` | Upward arrow | Back-to-top links |
| `envelope` | Email envelope | Contact section |
| `location` | Map pin | Location in contact section |
| `music` | Music note | Poem visualiser play button (hidden by default) |

### Adding a New Icon

1. Draw the icon on a `24×24` grid using stroke-based paths.
2. Add a `<symbol id="icon-[name]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">` block to `assets/images/icons.svg` in the appropriate category section.
3. Document the new icon in the catalogue table above.
4. Use `{% include icon.html id="[name]" %}` anywhere in Liquid templates.

---

## 5. Spacing & Grid

### Spacing Scale

Spacing follows an 8px base unit:

| Token | Value | Use |
|---|---|---|
| `4px` | `0.25rem` | Icon gap, tight inline spacing |
| `8px` | `0.5rem` | Micro gaps, badge padding |
| `16px` | `1rem` | Element internal padding |
| `24px` | `1.5rem` | Card gap, small section gutter |
| `32px` | `2rem` | Card padding, form elements |
| `40px` | `2.5rem` | Button / CTA breathing room |
| `56px` | `3.5rem` | Section header bottom margin |
| `80–100px` | `5–6.25rem` | Section vertical padding |

### Section Padding

All sections use the `--section-pad` custom property:
```css
--section-pad: clamp(60px, 8vw, 100px) clamp(20px, 6%, 80px);
```

This scales from `60px/20px` on mobile to `100px/80px` on wide viewports.

### Content Max-Width

| Context | Max-width |
|---|---|
| Section content grids | `1200px` |
| Section headers, text | `560px` (for readable line length) |
| Hero inner | `1280px` |

### Grid System

Cards and grids use CSS Grid with `repeat(auto-fit, minmax(..., 1fr))` — no manual breakpoints required.

| Grid | Min column | Gap |
|---|---|---|
| Elements (5 cards) | `220px` | `24px` |
| Services / Labs / Retreats | `280px` | `28–32px` |
| What pillars | `200px` | `2px` (flush, deliberately tight) |

---

## 6. Component Patterns

### Buttons

Three variants, all using the `.btn` base from Minimal Mistakes with Urban Prana overrides:

```html
<!-- Primary (Forest Green) -->
<a href="..." class="btn btn--primary">Label</a>

<!-- Inverse (outlined) -->
<a href="..." class="btn btn--inverse">Label</a>

<!-- Gold CTA (contact section only) -->
<a href="..." class="btn btn--primary btn--large">Label</a>
```

- Font: Inter, `0.82rem`, `600` weight, `0.08em` letter-spacing, uppercase
- Hover: lifts `translateY(-1px)` with green shadow on primary
- Contact section CTAs use gold-on-dark styling via `.contact-section .btn--primary` override

### Section Header

Every section opens with a `.section-header` block:

```html
<div class="section-header">
    <span class="section-tag">Category Label</span>
    <h2>Section Title</h2>
    <p>Supporting description, max ~80 words.</p>
    <div class="divider"></div>
</div>
```

- `.section-tag` — gold uppercase eyebrow (Inter, 0.7rem, 0.15em letter-spacing)
- `<h2>` — DM Serif Display
- `.divider` — 48px wide, 2px tall gold-to-sage gradient bar

### Cards

Three card patterns in use:

**Element Card** (`.element-card`)
- White background, `1px --up-border` border
- Animated bottom gradient bar on hover (`:after` pseudo)
- Lifts `translateY(-6px)` on hover
- Contains: SVG icon, Sanskrit name, English label, description

**Service Card** (`.service-card`)
- Cream background, inverts to `--up-dark` on hover
- Text colors transition on hover (white copy, gold link)
- Contains: SVG icon, H3, description, `.service-link` with arrow icon

**Retreat Card** (`.retreat-card`)
- White card, category badge (pill), body with feature callout
- Shadow elevation on hover

### Section Tag / Eyebrow

```html
<span class="section-tag">Vastu Science</span>
```

Always placed above the section H2. Uses `--up-gold` color. Never applied to headings directly.

---

## 7. Page Templates

### Landing Page (`layout: landing`)

Sections in order — defined in `_layouts/landing.html`:

| Order | File | Class | Background |
|---|---|---|---|
| 1 | `landing/intro.html` | `.intro-section` | Dark forest gradient + banner image overlay |
| 2 | `landing/what.html` | `.what-section` | `--up-dark` |
| 3 | `landing/expertise.html` | `.expertise-section` | `--up-cream` |
| 4 | `landing/labs.html` | `.labs-section` | `--up-mist` |
| 5 | `landing/services.html` | `.services-section` | `#fff` |
| 6 | `landing/blogs.html` | (standard) | — |
| 7 | `landing/partners.html` | (standard) | — |
| 8 | `landing/contact.html` | `.contact-section` | Forest green gradient |

Alternating light/dark rhythm is intentional — do not break it.

### Content Pages (`layout: single`)

Used by: `/vastu/`, `/naturopathy/`, `/elements/`, `/cases/`, `/contact/`

All content pages include:
- `header.overlay_image` — page-specific banner (see `assets/images/`)
- `header.overlay_filter: 0.5` — consistent darkness
- `excerpt` — used as the hero subheading

**Heading conventions for content pages:**
- No emojis in headings. Headings must be plain text.
- H2 — major sections
- H3 — subsections within an H2
- Tables use standard Markdown pipe syntax

### Front Matter Checklist

```yaml
---
title: "Descriptive Page Title"
layout: single
permalink: /slug/
header:
  overlay_image: /assets/images/page-banner.jpg
  overlay_filter: 0.5
excerpt: "One-sentence summary used as hero subheading."
---
```

---

## 8. Writing & Content Guidelines

- **No emojis** anywhere in the codebase — HTML templates, Liquid includes, or Markdown content. Use SVG icons via `{% include icon.html %}` in templates; plain descriptive text in Markdown headings.
- **Tone:** Authoritative but accessible. Avoid jargon without explanation. Scientific terms are welcomed when paired with practical application.
- **Sanskrit names** are always followed by the English translation on first use: *Jal (Water)*, *Akasha (Space)*.
- **Ampersands (`&amp;`)** — use the HTML entity in templates; `&` is acceptable in Markdown prose.
- **Blockquotes** are reserved for attributed quotes from Vastu philosophy, Urban Prana philosophy statements, or research findings.

---

## 9. File Structure Quick Reference

```
assets/
  css/
    main.scss           ← Global styles, CSS tokens, all component CSS
  images/
    icons.svg           ← SVG sprite (all project icons)

_sass/
  main.scss             ← Legacy component styles (non-landing pages)
  minimal-mistakes/
    skins/
      _urbanprana.scss  ← Brand skin (color tokens for MM theme)

_includes/
  icon.html             ← SVG icon rendering partial
  landing/
    intro.html          ← Hero section
    what.html           ← Four pillars section
    expertise.html      ← Pancha Mahabhutas cards
    labs.html           ← Urban Retreats
    services.html       ← Service cards
    contact.html        ← CTA section

_pages/                 ← All content pages (single layout)
_layouts/
  landing.html          ← Landing page layout
```

---

## 10. Design Tokens Reference

Quick copy-paste for SCSS/CSS work:

```css
/* Colors */
var(--up-forest)     /* #3A6351 */
var(--up-sage)       /* #7DAA92 */
var(--up-gold)       /* #C5A55A */
var(--up-gold-light) /* #E8D5A0 */
var(--up-cream)      /* #F8F5EF */
var(--up-earth)      /* #8B6847 */
var(--up-terra)      /* #C4622D */
var(--up-charcoal)   /* #252525 */
var(--up-muted)      /* #6B6860 */
var(--up-mist)       /* #EDF2EE */
var(--up-dark)       /* #1E2D2A */
var(--up-border)     /* #E0DBD0 */

/* Utility */
var(--radius-sm)     /* 6px */
var(--radius-md)     /* 12px */
var(--radius-lg)     /* 20px */
var(--shadow-card)   /* 0 2px 20px rgba(37,37,37,0.06) */
var(--shadow-hover)  /* 0 8px 40px rgba(37,37,37,0.12) */
var(--transition)    /* 0.3s cubic-bezier(0.4,0,0.2,1) */
var(--section-pad)   /* clamp(60px,8vw,100px) clamp(20px,6%,80px) */
```
