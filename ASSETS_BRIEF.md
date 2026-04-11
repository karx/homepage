# Urban Prana — Design Assets Brief

> For: Design Team
> Status: Pending delivery
> Context: All Urban Prana brand images are currently missing from the repository.
> The site runs on CSS gradient fallbacks until assets are delivered.
> Deliver assets to: `assets/images/` (see exact filename in each brief)

---

## Priority Key

| Symbol | Meaning |
|---|---|
| `[CRITICAL]` | Site currently broken or visually empty without this |
| `[HIGH]` | Degrades experience significantly; CSS fallback in place |
| `[MEDIUM]` | Enhances quality; placeholder in use |
| `[LOW]` | Nice to have; no visible gap currently |

---

## 1. Logo `[CRITICAL]`

| Field | Spec |
|---|---|
| **Filename** | `urban-prana-logo.png` + `urban-prana-logo.svg` |
| **Path** | `assets/images/urban-prana-logo.png` |
| **Usage** | Masthead top-left on all pages |
| **Dimensions** | PNG: 200×50px · SVG: scalable |
| **Format** | PNG (transparent bg) + SVG source |
| **Direction** | Wordmark or icon+wordmark. Should read well on white and on dark forest green (`#1E2D2A`). Can incorporate the lotus motif from our SVG icon set. |
| **Fallback in use** | Site title "Urban Prana" renders as plain text |

---

## 2. Hero Background `[CRITICAL]`

| Field | Spec |
|---|---|
| **Filename** | `urban-vastu-banner.jpg` |
| **Path** | `assets/images/urban-vastu-banner.jpg` |
| **Usage** | Hero section background overlay (opacity 0.18 on dark forest gradient) |
| **Dimensions** | 1440×900px minimum · 2:1 landscape ratio |
| **Format** | JPEG progressive · max 300KB |
| **Direction** | Interior or aerial photo of a nature-integrated urban dwelling. Warm, green-toned. Soft focus or slightly blurred acceptable — it will be overlaid with text. Think: apartment with plants, natural light, wooden surfaces, open Brahmasthan. No faces, no branding, no text in image. |
| **Fallback in use** | CSS gradient (`#1E2D2A → #243d2e`) renders without image |

---

## 3. Page Banners `[HIGH]`

All banners share the same spec. Used as `header.overlay_image` on content pages with a `0.5` dark overlay filter. The image is partially obscured — composition should work with text centered over it.

**Shared Spec:**
- Dimensions: 1440×400px (16:4)
- Format: JPEG progressive · max 150KB each
- Overlay: 50% black will be applied in CSS — shoot accordingly (slightly brighter than final result)

| # | Filename | Path | Page | Direction |
|---|---|---|---|---|
| 3a | `vastu-banner.jpg` | `assets/images/vastu-banner.jpg` | /vastu/ | Compass, floor plan, directional arrows, architectural detail. Neutral/clinical but warm. |
| 3b | `naturopathy-banner.jpg` | `assets/images/naturopathy-banner.jpg` | /naturopathy/ | Plants, herbs, botanical close-ups. Green-dominant. Tulsi or Areca palm preferred. |
| 3c | `elements-banner.jpg` | `assets/images/elements-banner.jpg` | /elements/ | Abstract composition of the 5 elements: earth (stone/soil), water (drop or still water), fire (candle/warm light), air (leaves in motion/window), space (open room center). |
| 3d | `cases-banner.jpg` | `assets/images/cases-banner.jpg` | /cases/ | Aerial or wide shot of a green urban development — tree canopy over towers, or a rooftop garden. Delhi NCR preferred but any Indian metro works. |
| 3e | `contact-banner.jpg` | `assets/images/contact-banner.jpg` | /contact/ | Calm, minimal interior. Natural light through a window onto a clean surface. Inviting and grounded. |
| 3f | `philosophy-banner.jpg` | `assets/images/philosophy-banner.jpg` | /philosophy/ | Abstract mandala or geometric pattern inspired by Vastu Purusha Mandala. Earthy tones. |

---

## 4. Hero Visual Panel `[HIGH]`

| Field | Spec |
|---|---|
| **Filename** | `hero-visual.jpg` |
| **Path** | `assets/images/hero-visual.jpg` |
| **Usage** | Right column of landing page hero (replaces 3D model when model fails to load) |
| **Dimensions** | 600×700px · 6:7 portrait ratio |
| **Format** | JPEG progressive · max 120KB |
| **Direction** | A serene, composed image of a Vastu-compliant or biophilic interior. Tall plants (Areca palm or Tulsi), natural light, warm wooden tones. Portrait orientation. Could also be an architectural illustration/render. No people. |
| **Fallback in use** | CSS decorative panel with brand pattern and lotus icon |

---

## 5. Journal / Blog Post Thumbnails `[MEDIUM]`

| Field | Spec |
|---|---|
| **Usage** | Teaser images for Journal post cards on landing page and /journal/ archive |
| **Dimensions** | 600×400px · 3:2 landscape |
| **Format** | JPEG · max 80KB each |
| **Naming** | Named per post, referenced in post front matter as `header.teaser` |
| **Direction** | Each post should have a relevant thematic image. Tone: warm, natural, editorial. Categories: Vastu diagrams, plant photography, architectural details, abstract elemental compositions. |
| **Fallback in use** | Posts render without thumbnail image |

---

## 6. Open Graph / Social Sharing Image `[MEDIUM]`

| Field | Spec |
|---|---|
| **Filename** | `urban-prana-og.jpg` |
| **Path** | `assets/images/urban-prana-og.jpg` |
| **Usage** | `og:image` meta tag — shown when the site is shared on WhatsApp, LinkedIn, Twitter |
| **Dimensions** | 1200×630px |
| **Format** | JPEG · max 200KB |
| **Direction** | Brand card: Logo + tagline "Holistic Urban Living" on a forest green or cream background. Clean, legible at thumbnail size. |
| **Fallback in use** | No social preview image (link shares appear without image) |

---

## 7. Favicon / App Icons `[LOW]`

| Field | Spec |
|---|---|
| **Source** | Provide a 512×512 PNG of the brand mark (logo icon only, no wordmark) |
| **Path** | `assets/images/` |
| **Note** | Existing generic favicons are in place. Update when brand mark is finalised. |

---

## Delivery Checklist

```
[ ] urban-prana-logo.png + .svg          CRITICAL
[ ] urban-vastu-banner.jpg               CRITICAL
[ ] vastu-banner.jpg                     HIGH
[ ] naturopathy-banner.jpg               HIGH
[ ] elements-banner.jpg                  HIGH
[ ] cases-banner.jpg                     HIGH
[ ] contact-banner.jpg                   HIGH
[ ] philosophy-banner.jpg                HIGH
[ ] hero-visual.jpg                      HIGH
[ ] urban-prana-og.jpg                   MEDIUM
[ ] Post thumbnail images (per post)     MEDIUM
[ ] Favicon source 512×512 PNG          LOW
```

---

## Notes for Design Team

- The site uses a **warm cream** background (`#F8F5EF`) and **dark forest green** (`#1E2D2A`) — all photography should feel complementary to these tones. Avoid cool-blue or highly saturated palettes.
- SVG icons for the five elements (Prithvi, Jal, Agni, Vayu, Akasha) are already in the codebase as stroke-line art. Photography does not need to literally depict these — the icons handle symbolism.
- The design system is documented in `Design_guide.md` — please read the Color System and Typography sections before producing assets.
- Deliver as web-optimised files (no PSDs or RAWs in the repo). Source files can be shared via Drive/Figma separately.
