# Targeted performance fixes — 16 October 2026

Responsive Sanity images and loading priority are implemented. The local production preview now supports negotiated Brotli/gzip, cache headers, HEAD, image MIME types, and safe direct-route/404 handling. Application layout, content schemas, published content, and client refresh behavior are preserved. No deployment or content migration was performed.

## Performance comparison

The original audit used an uncompressed, no-store preview and one run per scenario. The corrected-preview baseline and optimized-image results each use three sequential cold-browser runs per scenario. Values below are medians per metric; original scores are single-run references.

| Scenario | Original score | Corrected preview | Optimized images | Baseline LCP | Optimized LCP |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home · mobile | 79 | 86 | **97** | 4.09 s | **2.41 s** |
| Home · desktop | 92 | 92 | **99** | 1.85 s | **0.95 s** |
| Projects · mobile | 79 | 86 | **98** | 4.21 s | **2.41 s** |
| Equally.ai · mobile | 90 | 99 | **99** | 1.66 s | **1.66 s** |

The corrected preview separates measurement-environment gains from the image implementation. Comparing the two three-run stages isolates the image/loading changes under the same server configuration. The normalized published-content SHA-256 is identical in both stages: `c4cb4fa31f69b30f53c057402d685ace0f116f9ae6595f1bd3a53956ffa0e4db`.

| Scenario | Baseline image transfer | Optimized image transfer | Reduction | Final FCP | Final TBT | Final CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home · mobile | 776.6 KiB | 51.9 KiB | 93.3% | 1.51 s | 0 ms | 0.001 |
| Home · desktop | 776.5 KiB | 60.7 KiB | 92.2% | 0.37 s | 0 ms | 0.001 |
| Projects · mobile | 1236.3 KiB | 145.2 KiB | 88.3% | 1.51 s | 0 ms | 0.002 |
| Equally.ai · mobile | 238.5 KiB | 15.5 KiB | 93.5% | 1.51 s | 0 ms | 0.037 |

Accessibility and SEO scored **100 on every run**. Best practices remains **96**, solely because the local Sanity browser refresh is CORS-blocked. These are local lab results; they do not establish production performance or real visitor Core Web Vitals. External CDN conditions can vary, and Sanity may generate/cache formats between runs.

## Checks and browser review

- `npm run check` passed: root TypeScript, ESLint, 12 content/image/HTTP tests, the connected production build, and four generated-build checks.
- Studio TypeScript and production build passed using Node 24 and the shared image renderer. Its existing CSS-generation step was run for validation; the generated tracked file was restored to its pre-task contents to keep unrelated style changes out of this patch.
- Image tests cover candidate widths, no upscaling, query preservation, non-Sanity/fixture URLs, slot sizes, first-cover loading priority, and retained intrinsic dimensions.
- HTTP tests cover Brotli/gzip/identity, quality values, 406 responses, Vary and Content-Length, HEAD, cache policies, image MIME types, direct routes, actual 404s, rejected traversal/symlinks/malformed paths, and unsupported methods.
- Browser review covered home, collection, and Equally.ai at 390×844 and 1280×800. Reviewed pages had no horizontal overflow; covers loaded from responsive Sanity URLs, cropping/layout remained consistent, and Room Planner screenshot switching updated the image and pressed state. No hydration or unknown-prop warnings were observed. The temporary viewport override was reset.

## Remaining account step

Sanity CLI returned: **You must login first — run sanity login.** No CORS settings were changed. With an authenticated account, add `http://127.0.0.1:4173` to project `wo8xbxgq` with credentials disabled, then confirm a successful published query from the preview browser. [Exact command and verification](../../setup.md). The prerendered published snapshot remains usable while refresh is blocked.

## Reports

All 24 comparison audits retain HTML and JSON files in `baseline-preview/` and `after-images/`. Each scenario’s report below corresponds to its median LCP run; performance-score medians are calculated independently.

- Home · mobile: [corrected-preview baseline](baseline-preview/home-mobile-1.report.html) · [optimized images](after-images/home-mobile-3.report.html); optimized performance runs: 97, 97, 98.
- Home · desktop: [corrected-preview baseline](baseline-preview/home-desktop-3.report.html) · [optimized images](after-images/home-desktop-2.report.html); optimized performance runs: 99, 99, 99.
- Projects · mobile: [corrected-preview baseline](baseline-preview/projects-mobile-3.report.html) · [optimized images](after-images/projects-mobile-1.report.html); optimized performance runs: 97, 98, 98.
- Equally.ai · mobile: [corrected-preview baseline](baseline-preview/case-study-mobile-2.report.html) · [optimized images](after-images/case-study-mobile-2.report.html); optimized performance runs: 99, 99, 99.

[Machine-readable medians](comparison.json) · [Original audit](README.md). Lighthouse was pinned to 13.5.0, using the original mobile/desktop presets. CSS restructuring and JavaScript splitting remain deferred.
