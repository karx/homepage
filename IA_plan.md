# Urban Prana — Information Architecture Plan

> Status: Approved for implementation · Branch: kaaro/add/nature
> Last updated: 2026-04-11

---

## 1. Sitemap

```
/ (Landing — 9 sections)
├── /philosophy/        Our Philosophy  [NEW]
│   └── references → /elements/, /vastu/, /naturopathy/
├── /vastu/             Vastu & Spaces
├── /naturopathy/       Naturopathy
├── /cases/             Case Studies
├── /journal/           Journal         [RENAMED from /blogs.html]
└── /contact/           Book a Session  [CTA, not standard nav link]

Secondary (not in primary nav):
└── /elements/          The Five Elements  (internal, SEO content)
```

---

## 2. Primary Navigation

```
[Urban Prana]  Philosophy  Vastu & Spaces  Naturopathy  Case Studies  Journal  [Book a Session ↗]
```

| Slot | Old Label | New Label | URL | Change Reason |
|---|---|---|---|---|
| 1 | The 5 Elements | Philosophy | /philosophy/ | First-visit legibility. Elements is a subsection, not a destination. |
| 2 | Vastu Shastra | Vastu & Spaces | /vastu/ | Benefit signal added ("Spaces") |
| 3 | Naturopathy | Naturopathy | /naturopathy/ | No change |
| 4 | Urban Case Studies | Case Studies | /cases/ | Shorter; "Urban" implied by brand |
| 5 | *(absent)* | Journal | /journal/ | New destination from renamed /blogs/ |
| 6 | Consultation | Book a Session | /contact/ | Styled as button; imperative verb |

**Mobile:** Hamburger drawer + full-width "Book a Session" button at bottom of drawer.
**Mobile sticky:** Fixed gold bar at bottom of viewport on all mobile landing page views.

---

## 3. Landing Page Section Order

| # | Section Include | Class | Background | Status |
|---|---|---|---|---|
| 1 | `landing/intro.html` | `.intro-section` | Dark forest gradient | Updated |
| 2 | `landing/trust-bar.html` | `.trust-bar` | Sage mist | NEW |
| 3 | `landing/what.html` | `.what-section` | `--up-dark` | Updated |
| 4 | `landing/services.html` | `.services-section` | `#fff` | Unchanged |
| 5 | `landing/howitworks.html` | `.how-section` | `--up-cream` | NEW |
| 6 | `landing/expertise.html` | `.expertise-section` | `--up-cream` | Unchanged |
| 7 | `landing/labs.html` | `.labs-section` | `--up-mist` | Unchanged |
| 8 | `landing/blogs.html` | `.journal-section` | `#fff` | Updated |
| 9 | `landing/contact.html` | `.contact-section` | Forest gradient | Minor update |

**Removed:** `landing/partners.html` (was commented out — dead slot deleted)

---

## 4. Section Wireframes

### Section 1 — Hero (Z-Pattern above fold)
```
MASTHEAD: [Logo]  Nav links  [Book a Session ↗]

  Eyebrow: "Vastu Shastra & Naturopathy"

  H1: "Your Urban Home,         │  [Right panel:
       Harmonized."             │   CSS decorative /
                                │   model-viewer when
  Lead: Transform how you       │   available]
  sleep, work, and heal.        │
                                │
  [Book a Vastu Audit]  [Explore Our Approach ↓]
```

### Section 2 — Trust Bar (new)
```
Vastu · Naturopathy · Biophilic Design  ·  Noida, Delhi NCR  ·  Ancient Wisdom, Modern Living
```

### Section 3 — What We Do
```
[Our Approach]  H2  divider
4 icon pillars — no body paragraph (removed)
```

### Section 4 — Services (moved up from slot 5)
```
[What We Offer]  H2  divider
3 service cards with outcome-first copy
```

### Section 5 — How It Works (new)
```
[The Process]  H2  divider
Step 1: Assess → Step 2: Blueprint → Step 3: Integrate
```

### Section 6 — Expertise (moved down from slot 3)
```
[Vastu Science]  H2  divider
5 element cards + [Explore the Elements →]
```

### Section 7 — Case Studies
```
[Case Studies]  H2  divider
3 retreat cards + [View All Case Studies →]
```

### Section 8 — Journal (was Blog)
```
[Journal]  H2: "Insights from the Field"  divider
3 post cards + [Visit the Journal →]
```

### Section 9 — Contact CTA
```
Forest green gradient
H2: "Begin Your Journey"
Contact items + [Book a Session ↗]
```

---

## 5. Footer Structure

### 3-Column Layout
```
Col 1: Brand          Col 2: Navigate         Col 3: Get in Touch
─────────────         ───────────────         ───────────────────
[Lotus icon]          Philosophy              hello@urbanprana.life
Tagline               Vastu & Spaces          Noida, India
                      Naturopathy             Mon–Sat 10am–7pm IST
[Social icons]        Case Studies
                      Journal
                      Book a Session

Bottom: © 2025 Urban Prana · Privacy Policy · Terms
```

---

## 6. Content Strategy

### Copy Changes

| Location | Old | New |
|---|---|---|
| Hero H1 | "Harmonizing Urban Spaces with Vastu Shastra & Naturopathy" | "Your Urban Home, Harmonized." |
| Hero CTA | "Get a Vastu Audit" | "Book a Vastu Audit" |
| Blog H2 | "Blogs" / "What are we upto?" | "Insights from the Field" |
| Blog link | "More.." | "Visit the Journal →" |
| Contact title | "Begin Your Urban Zen Journey" | "Book a Consultation" |
| Contact nav label | "Consultation" | "Book a Session" |

### Pages to Create
- `/philosophy/` — consolidates Elements approach as brand framing; links to /vastu/, /naturopathy/, /elements/

### Pages to Update
- `/cases/` — move data table above case study sections
- Every content page — add `Book a Session` CTA block at bottom

---

## 7. Internal Linking Map

```
Landing (/)
  → /philosophy/     (nav + "Explore Our Approach" hero CTA)
  → /vastu/          (services card)
  → /naturopathy/    (services card × 2)
  → /elements/       (expertise section CTA)
  → /cases/          (labs section CTA)
  → /journal/        (journal section CTA)
  → /contact/        (nav button + contact section CTA)

/philosophy/         → /elements/, /vastu/, /naturopathy/
/vastu/              → /elements/, /contact/
/naturopathy/        → /vastu/, /contact/
/elements/           → /philosophy/, /contact/
/cases/              → /contact/
Journal posts        → relevant service pages, /contact/
```

---

## 8. Implementation Priority

| Priority | Work | Blocks |
|---|---|---|
| P0 | Fix broken image paths (CSS fallbacks), remove dead partners slot | Site stability |
| P1 | Navigation labels + CTA button styling | Conversion |
| P2 | Landing section reorder + new sections (trust bar, how it works) | User flow |
| P3 | Hero dual CTAs, remove model-viewer dependency | Above-fold |
| P4 | Content page updates (contact rename, cases table, end CTAs) | Conversion |
| P5 | Footer 3-column redesign | Trust / wayfinding |
| P6 | New /philosophy/ page, /journal/ rename | IA completeness |
