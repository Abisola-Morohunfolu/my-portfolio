# Portfolio Lighthouse audit — 16 October 2026

Audited a fresh local production build at http://127.0.0.1:4173 using Lighthouse 13.5.0 and Chrome 155. The build successfully fetched a published Sanity snapshot containing nine projects and prerendered eleven routes plus the 404 page. These are local lab results, not measurements of the deployed domain or real visitor Core Web Vitals. No application source or external settings were changed.

## Scores

| Page / device | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| [Homepage · mobile](home-mobile.report.html) | 79 | 100 | 96 | 100 |
| [Homepage · desktop](home-desktop.report.html) | 92 | 100 | 96 | 100 |
| [Projects · mobile](projects-mobile.report.html) | 79 | 100 | 96 | 100 |
| [Equally.ai case study · mobile](case-study-mobile.report.html) | 90 | 100 | 96 | 100 |

## Load metrics

| Page / device | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: |
| Homepage · mobile | 2.7 s | 4.7 s | 0 ms | 0.001 |
| Homepage · desktop | 0.6 s | 1.8 s | 0 ms | 0.001 |
| Projects · mobile | 2.4 s | 4.8 s | 0 ms | 0.002 |
| Equally.ai case study · mobile | 2.7 s | 3.0 s | 0 ms | 0.037 |

The mobile homepage and collection LCP values are poor; the case-study LCP needs improvement. Desktop LCP is good. CLS is good on every run, and no blocking time was measured. The case study's score of 90 still includes a 3.0-second LCP. INP was not measured by these navigation audits. Passing automated accessibility checks does not replace a manual accessibility review.

[Google's Core Web Vitals guidance](https://web.dev/articles/vitals) defines good LCP as at most 2.5 seconds and good CLS as at most 0.1; field compliance also requires INP and real visitor measurements.

## Prioritized findings

1. **High: serve responsive project images.** The homepage transfers about 1,168 KiB in total. Its image-delivery audit estimates **693 KiB** of image savings and **1,100 ms** of LCP improvement; the collection estimates **967 KiB** and **1,100 ms**. These estimates overlap with other opportunities and should not be added together.

   The homepage LCP element is the Equally.ai cover. Its source is a 1728×961 PNG weighing approximately 238 KiB, displayed at about 331 CSS pixels wide in this mobile run. Lighthouse estimates about 212 KiB of savings for that asset alone. Other homepage opportunities include Room Planner (approximately 245 KiB saved), Flowy (184 KiB), and TestAssessify (51 KiB).

   Source: [ProjectImage.tsx](../../../src/components/portfolio/ProjectImage.tsx), particularly the raw picture.src passed to img. There is no srcSet or sizes attribute and no Sanity width/format transformation. Generate a finite set of width variants, choose sizes per placement, and retain intrinsic dimensions and useful alt text. A candidate URL transformation is ?w=640&auto=format&fit=max; width must account for the rendered slot and device pixel ratio. [Sanity documents these transformations](https://www.sanity.io/docs/apis-and-sdks/image-urls).

2. **Medium: reduce the CSS that blocks first paint.** The shared stylesheet is about 18.1 KiB transferred without compression by this preview server. Lighthouse estimates **900 ms FCP savings** on the mobile homepage, **600 ms** on the collection, and **900 ms FCP/LCP savings** on the case study. Review critical above-the-fold CSS and defer route-specific styles; verify deployed compression before investing in inlining. Desktop render-blocking savings are **0 ms**, so this is a mobile priority.

3. **Medium: review route loading and JavaScript coverage.** One client bundle transfers about 182 KiB here; Lighthouse reports 75–81 KiB unused during initial navigation, estimating **300–500 ms LCP savings** on mobile depending on route. App.tsx eagerly imports the case-study renderer and shared content validation. Investigate route-specific splitting and client-only validation needs while preserving prerendering/hydration. Coverage from a single navigation does not prove code is safe to delete. Vite's production build already minifies JavaScript; build output reports about 59.8 kB gzipped for the client bundle.

4. **Medium, local configuration: Sanity browser refresh fails CORS.** All four runs lose best-practices points solely because the browser refresh from http://127.0.0.1:4173 is rejected without an Access-Control-Allow-Origin header. The prerendered snapshot remains visible because refreshContent catches fetch failure. If this preview origin is intended to refresh content, configure that exact origin in Sanity. Verify the deployed origin separately before treating this as a production defect. Source: [App.tsx](../../../src/App.tsx) refresh effect and [api.ts](../../../src/content/api.ts).

5. **Low follow-up: image loading priority.** The homepage cover is eager and discoverable in initial HTML but lacks fetchpriority=high. The collection passes no priority prop, so even its first visible cover is loading=lazy. Make the first visible collection cover eager and consider high fetch priority for the confirmed LCP image. Lighthouse estimates **0 ms** for the discovery insight in these runs, so prioritize measured image byte savings first.

## Environment effects and limits

- One cold navigation per page/device was run sequentially, with no parallel Lighthouse workloads. Scores are snapshots and can vary; see [Lighthouse scoring guidance](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring).
- Mobile: simulated throttling, 150 ms RTT, 1,638.4 Kbps throughput, 4× CPU slowdown; 412×823 viewport at 1.75× scale. Desktop: simulated 40 ms RTT, 10,240 Kbps throughput, 1× CPU slowdown; 1350×940 viewport.
- The local preview serves files without gzip/Brotli and sends Cache-Control: no-store for every response. It causes missing document compression and back/forward-cache findings. These are confirmed in [preview.mjs](../../../scripts/preview.mjs), not evidence of the Netlify configuration. Server timing is also local and cannot establish deployed TTFB.
- Images and analytics were loaded from their real external hosts. Image requests succeeded. Sanity's browser refresh was CORS-blocked, while the build-time published read succeeded.
- Tiny font-related shifts were observed; the resulting CLS values are within the good range. No font/preconnect change is prioritized from this evidence.
- All runs completed without Lighthouse run warnings. The reports include the measured network inventory, accessibility checks, and trace-derived performance findings. No Chrome DevTools MCP was available; equivalent Lighthouse navigation traces and DevTools logs were saved.

## Artifacts and reproduction

Each run has an HTML report, JSON report, Chrome trace, and DevTools network log beside this file. HTML reports are self-contained.

Build and serve:

```sh
npm run build
npm run preview
```

Audit command (repeat with /projects or /projects/equally-ai; add --preset=desktop for desktop):

```sh
npx --yes lighthouse@13.5.0 http://127.0.0.1:4173/ \
  --chrome-flags='--headless=new --disable-gpu' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html --output=json --save-assets \
  --output-path=docs/lighthouse/2026-10-16/home-mobile --quiet
```
