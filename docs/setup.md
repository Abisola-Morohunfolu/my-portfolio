# Connect Sanity and retain Netlify

The code and local fixtures work independently. A real Sanity project, authenticated Studio hosting, a Netlify project link, and domain configuration are still external setup. Do not treat the fixture build as a connected CMS.

## Sanity project

1. In Sanity Manage, create or select the intended project on the free plan and create a `production` dataset. Use a public dataset so the website can read **published** content without embedding a token. Draft access remains authenticated. Review current project quotas in Manage; no custom database is needed.
2. Copy the root `.env.example` to `.env.local` and set `PORTFOLIO_CONTENT_SOURCE=sanity`, `SANITY_PROJECT_ID`, and `SANITY_DATASET`. These two identifiers are public; no token is required for website builds or refreshes.
3. Copy `studio/.env.example` to `studio/.env` and set the same project and dataset, plus the intended unique Studio hostname. Install with `npm ci --prefix studio`, then run `npm run dev --prefix studio`.
4. Add the local Studio origin (normally `http://localhost:3333`) and the hosted Studio origin to the project's allowed CORS origins with credentials enabled. Add `https://abisola.xyz` and the chosen Netlify deploy-preview origin for public reads, without credentials. Avoid broad credentialed wildcard origins.
5. Run `npm run typecheck --prefix studio` and `npm run build --prefix studio`, then `npm run deploy --prefix studio` with the intended authenticated account. Studio hosts separately from the portfolio. Sanity's normal login controls access to editing and previews.

Studio contains an ordered project collection and one profile document for biography, contact links, and builder notes. Project sections support ordered rich text, optional how-it-works steps, and images with required alt text. Keep published slugs stable. Optional URLs, images, sections, and evidence can be omitted. The public site handles empty collections.

## Migrate the prepared content

Create a temporary write token for the intended dataset and set `SANITY_WRITE_TOKEN` in the terminal session. Keep it out of `VITE_*`, `SANITY_STUDIO_*`, browser storage, and source files.

```sh
npm run cms:seed
```

The command uploads real screenshot assets and creates **drafts**. It skips existing draft or published documents, so rerunning does not overwrite editorial work. An upload failure stops migration before the document transaction; previously uploaded assets may remain. Review asset usage before any later cleanup.

In Studio, review the profile and each project, including attribution and status, then publish the profile and intended projects. The case-study preview uses the shared website renderer and the logged-in Studio session. It reads assets with `useClient`; it does not expose a public draft endpoint or preview token. Unsaved fields are shown from the displayed document; incomplete required fields produce a useful preview message.

Use `npm run cms:seed -- --publish` only if you deliberately want to publish prepared documents directly. Import contains no internal commit hashes or repository paths. Internal source evidence stays in `docs/source-evidence.md`.

## Netlify build and webhook

Retain the existing Netlify project and domain. Link this repository/checkout to that project through its normal account workflow. Use:

- Build command: `npm run build`
- Publish directory: `build/client`
- Node: 24
- Environment: `PORTFOLIO_CONTENT_SOURCE=sanity`, `SANITY_PROJECT_ID`, `SANITY_DATASET`

The repository's `netlify.toml` already sets the command, output, Node version, and connected-content requirement. Set the two identifiers in the Netlify project. Do not override production to fixture mode just to pass a build.

Create a Netlify build hook for the deployment branch. In Sanity Manage's API webhooks, configure a POST to that hook URL. Select create, update, and delete; leave draft/version triggers off. Use this filter:

```groq
_type in ["project", "profile"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))
```

Unpublishing deletes the published document, so delete triggers must be enabled. Keep the build-hook URL in the service settings rather than public source. See [Sanity webhook behavior](https://www.sanity.io/docs/content-lake/webhooks) and [Netlify build hooks](https://docs.netlify.com/build/configure-builds/build-hooks/).

A connected build fetches the published dataset once. Invalid data or fetch failure aborts the build; it never silently substitutes fixtures. Netlify's deployment remains on its previous successful version when a build fails. Generated project files take precedence over the final 404 rule, and no catch-all 200 rewrite is used. A successful deletion build removes the route and sitemap entry.

For a CLI deploy preview after linking and building against Sanity, use `netlify deploy --dir=build/client`. Review that preview before `netlify deploy --prod --dir=build/client`. No deploy was performed during local implementation.

## Connected acceptance checks

1. Publish a draft project and check its direct route, title, canonical URL, social preview, and sitemap. Ensure the draft did not appear before publication.
2. Edit its summary and order; confirm the webhook creates a new successful build, and the viewer and collection reflect the change.
3. Unpublish that test project; after the successful rebuild, the direct URL must return 404 and disappear from the sitemap. A client refresh should also remove it without a full reload.
4. Cause a controlled build failure in a deploy-preview branch, then confirm the previous deployment stays available. Restore the preview configuration afterward.
5. Review desktop/mobile, keyboard tabs and links, reduced motion, real image alternatives, and case-study credits.
6. Restore DNS for `abisola.xyz` through the current domain/Netlify account and verify HTTPS plus the existing Umami project before production release. DNS resolution failed in this session on 14 October 2026.
