---
name: design-asset-generator
description: Generates and maintains project visual assets (logos, banners, social images) from design briefs and style guides. Use when a project is missing required brand assets or when current assets need updating according to new brand guidelines.
---

# Design Asset Generator

This skill transforms textual design requirements and brand guidelines into high-fidelity visual assets using a browser-based Canvas rendering pipeline.

## Workflow

1.  **Analyze Context:** Read `ASSETS_BRIEF.md` (for requirements) and `Design_guide.md` (for brand tokens/styles).
2.  **Extract Tokens:** Identify color hex codes, font families (Google Fonts), spacing units, and SVG iconography.
3.  **Implement Generator:** Use the `assets/template.html` as a base to create a project-specific `assets_builder.html`.
4.  **Implement Renderers:** Write specialized JavaScript functions to draw each requested asset onto a `<canvas>`.
    *   **Logo:** SVG wordmark + icon.
    *   **Banners:** Gradients, abstract shapes, or watermark patterns.
    *   **OG Image:** Logo + Tagline + Background pattern.
5.  **Execution:** Instruct the user to open `assets_builder.html` in their browser to download the generated PNG/JPG files.

## Guidelines for Asset Rendering

*   **Colors:** Never use pure black/white. Always use the project's semantic tokens (e.g., `--up-forest`).
*   **Typography:** Load fonts via Google Fonts in the builder's `<head>`.
*   **Icons:** Use the project's SVG sprite as a reference for drawing paths manually onto the canvas context.
*   **Banners:** Use `createLinearGradient` or `createRadialGradient` to match project aesthetics. Add "visual noise" or abstract shapes to backgrounds to avoid flat color looks.

## Progressive Disclosure

*   **Template:** Use [assets/template.html](assets/template.html) for the boilerplate.
*   **Reference:** See `Design_guide.md` in the workspace for current brand tokens.
