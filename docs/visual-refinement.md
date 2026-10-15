# Visual refinement, 15 October 2026

Checkpoint: `f048ed4` on `codex/portfolio-visual-refinement` saves the previous portfolio and CMS work before the visual pass. The pre-existing generated `dist/` directory remains untracked.

## Design audit and direction

Preserve-mode refinement of a product engineer portfolio for hiring teams and collaborators. The existing BDO Grotesk typography, `abisola.` wordmark, off-white/ink/cobalt palette, selected-project viewer, content, navigation, routes, anchor IDs, metadata, structured rendering, and analytics remain the foundation. No search ranking data was available locally; route metadata and generated pages were checked through the existing suite.

Existing dials: variance 6, motion 3, density 3. Revised: DESIGN_VARIANCE 6, MOTION_INTENSITY 4, VISUAL_DENSITY 3. Native CSS implements the studio aesthetic; no official design-system package is implied.

The main weaknesses were shallow screenshot crops, a numbered list with a weak selected state, repeated small section labels, and similar visual weight across the lower sections. The pass introduces full screenshot framing, cobalt selection surfaces, compact hero art, clearer spacing, a grouped notes surface, and restrained entry/interaction feedback. Primary navigation and project copy are preserved. Redundant “How I work” and “Get in touch” labels were removed above their existing headings.

Light tokens remain `#f7f8fa`, `#17191d`, `#3155d9`. Dark tokens use `#171a21`, `#edeff4`, `#9aadff`; surfaces and secondary text use the same cool-neutral family. Both themes cover every route. System preference is the default; the footer toggle cycles system/light/dark and stores an explicit preference when storage is available. The radius scale is 12px for controls and surfaces, 5px for screenshot edges, and 3px for inline code.

## Verification

- `npm run check`: TypeScript, ESLint, nine content/rendering tests, production build, and four generated-artifact tests pass. Eleven published routes plus the 404 render successfully.
- `git diff --check` passes.
- Browser review: homepage, collection, and Equally case study; desktop 1280×800, compact laptop 1280×720, phone 390×844; light and dark themes. No horizontal overflow in the reviewed views. Desktop hero occupies two lines and the case-study link remains inside the initial viewport.
- Project selection, ArrowRight, Home, focus, route changes, and theme persistence were exercised. Original keyboard tabs, skip link, descriptive screenshot alternatives, image failure/empty states, and reduced-motion guards remain present.
- Mechanical pre-flight: no visible em/en dashes in the active page components or fixture content; one brand accent per theme; no new decorative eyebrows, numbering, scroll cues, fake screenshots, marquees, icons, or metrics. Existing longer case-study copy is intentionally retained under preserve-mode scope. Irrelevant form, testimonial, bento, and scroll-pinning checks do not apply.
- Original local screenshots remain intact. Six screenshot sources have 640px/1200px WebP variants with original-format fallbacks. CMS image URLs remain unchanged. The default mobile screenshot now transfers about 13KB instead of the original 243KB PNG.
- Lighthouse 11.7.1, mobile simulation against the local production preview: **89 performance / 100 accessibility / 100 best practices / 100 SEO**. FCP 2.6s, LCP 3.2s, CLS 0.05, total blocking time 0ms. Before image optimization: performance 79 and LCP 4.8s. These are local lab measurements; LCP still exceeds the 2.5s target, and the local preview does not compress text responses. No real-user INP or production Core Web Vitals claim is made.

## Generated artwork

Built-in image generation was used for a decorative cobalt assembly beside the introduction. Project screenshots remain real. Workspace assets: `public/images/connected-parts.jpg` (JPEG fallback) and `public/images/connected-parts.webp` (preferred image). The image is hidden on phones, lazy loaded, and excluded from the accessibility tree.

Final generation prompt:

> Use case: stylized-concept. Asset type: compact hero artwork for a product engineer portfolio, square composition. Create a premium photoreal studio still life of two precision-machined cobalt-blue anodized aluminium components joined by a short brushed aluminium connector, forming one beautifully simple continuous offset bridge. The joined components have rectangular, softly bevelled block forms with a few fine machined grooves, very restrained and tangible industrial design, no cables, no circuit boards. Three-quarter view, entire assembly fully visible, generous breathing space, pale cool grey seamless surface and background #f7f8fa, soft directional daylight, realistic contact shadows, subtly tactile material, rich restrained cobalt #3155d9 and brushed silver only. Compact grounded composition centered in the frame. It should communicate how well-made pieces connect, without looking like a generic abstract torus or futuristic AI illustration. No text, numbers, logos, watermarks, UI, borders or labels. Generate at 1024x1024.

Review captures: [Light desktop](visual-desktop-light.jpg), [dark desktop](visual-desktop-dark.jpg), [dark mobile](visual-mobile-dark.jpg).
