import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import {
  fetchPublishedContent,
  normalizeContent,
  render,
  metadataHtml,
  pageMetadata,
  serializeSnapshot,
  escapeHtml,
  SITE_URL,
} from '../build/server/entry-server.mjs';

const env = loadEnv('production', process.cwd(), '');
const source = env.PORTFOLIO_CONTENT_SOURCE ?? 'fixture';
if (!['fixture', 'sanity'].includes(source))
  throw new Error('PORTFOLIO_CONTENT_SOURCE must be fixture or sanity.');
let snapshot;
if (source === 'sanity') {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET)
    throw new Error(
      'Set SANITY_PROJECT_ID and SANITY_DATASET before a connected build.',
    );
  snapshot = await fetchPublishedContent({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
  });
} else {
  console.warn(
    'Building LOCAL FIXTURE CONTENT. Sanity is not connected. Netlify production requires PORTFOLIO_CONTENT_SOURCE=sanity.',
  );
  snapshot = normalizeContent(
    JSON.parse(await readFile('public/content-snapshot.json', 'utf8')),
    'fixture',
  );
}
const output = resolve('build/client');
const template = await readFile(resolve(output, 'index.html'), 'utf8');
if (
  !template.includes('<!--app-html-->') ||
  !template.includes('<!--content-snapshot-->')
)
  throw new Error('Build template markers are missing.');
const routes = [
  '/',
  '/projects',
  ...snapshot.projects.map((project) => `/projects/${project.slug}`),
  '/404',
];
for (const route of routes) {
  const metadata = pageMetadata(route, snapshot);
  const html = template
    .replace('<!--page-head-->', metadataHtml(metadata))
    .replace('<!--app-html-->', render(route, snapshot))
    .replace(
      '<!--content-snapshot-->',
      `<script>window.__PORTFOLIO_CONTENT__=${serializeSnapshot(snapshot)}</script>`,
    );
  const relative =
    route === '/'
      ? 'index.html'
      : route === '/404'
        ? '404.html'
        : `${route.slice(1)}/index.html`;
  const file = resolve(output, relative);
  await mkdir(resolve(file, '..'), { recursive: true });
  await writeFile(file, html);
}
// Replace the copied fixture with the exact published snapshot used for hydration.
await writeFile(
  resolve(output, 'content-snapshot.json'),
  JSON.stringify(snapshot),
);
const publishedRoutes = routes.filter((route) => route !== '/404');
await writeFile(
  resolve(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publishedRoutes.map((route) => `<url><loc>${escapeHtml(`${SITE_URL}${route === '/' ? '' : route}`)}</loc></url>`).join('')}</urlset>`,
);
await writeFile(resolve(output, '_redirects'), '/* /404.html 404\n');
await writeFile(
  resolve(output, 'build-info.json'),
  JSON.stringify({
    source: snapshot.source,
    generatedAt: snapshot.generatedAt,
    routes: publishedRoutes,
  }),
);
console.log(
  `Rendered ${publishedRoutes.length} published routes and a 404 from one ${source} snapshot.`,
);
