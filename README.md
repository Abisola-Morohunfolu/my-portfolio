# Abisola's working studio

React 18 + Vite 5 + TypeScript portfolio for [abisola.xyz](https://abisola.xyz), hosted on Netlify. Sanity is the intended published-content backend; its authenticated Studio is a separate application in `studio/`.

## Local review

```sh
yarn install --frozen-lockfile
npm run dev
# Or review the rendered production output:
npm run build
npm run preview
```

The current checkout uses **local fixture content**, not a connected Sanity dataset. `public/content-snapshot.json` contains nine project entries, prepared from existing portfolio material and verified local repositories. Production builds on Netlify are configured to require Sanity and fail if it is unavailable or unconfigured.

Run `npm run check` for strict type checking, lint, content/rendering tests, a production build, and generated-artifact verification. Build output goes to `build/client`; the pre-existing untracked `dist/` and `server.js` are preserved.

The site supports `/`, `/projects`, and `/projects/:slug`. A Vite server entry renders every published route from one build-time snapshot. The client hydrates that exact snapshot, then refreshes published content; a failed refresh keeps the rendered content. Each route includes useful HTML, its own metadata, and a canonical URL. Unknown routes return an actual 404 rather than a successful SPA shell.

## Content and deployment

Follow [the setup runbook](docs/setup.md) to connect Sanity, migrate content as drafts, host Studio separately, wire Netlify rebuilds, and review a deploy preview. No draft or write credentials belong in the public bundle.

[Verification notes](docs/verification.md) record what was checked locally and what needs a connected account. [Internal source notes](docs/source-evidence.md) record release evidence separately from CMS documents.
