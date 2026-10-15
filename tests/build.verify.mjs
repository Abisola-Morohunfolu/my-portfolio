import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const root = 'build/client';
const snapshot = JSON.parse(
  await readFile(`${root}/content-snapshot.json`, 'utf8'),
);
await test('generated pages carry useful HTML, route metadata, and the same hydration snapshot', async () => {
  for (const path of [
    '/',
    '/projects',
    ...snapshot.projects.map((project) => `/projects/${project.slug}`),
  ]) {
    const file =
      path === '/' ? `${root}/index.html` : `${root}${path}/index.html`;
    const html = await readFile(file, 'utf8');
    assert.match(html, /<h1>/);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /98fe9c82-12aa-4e90-bfd2-1b02c32c5499/);
    const serialized = html.match(
      /window\.__PORTFOLIO_CONTENT__=(.*?)<\/script>/s,
    )[1];
    assert.deepEqual(JSON.parse(serialized), snapshot);
    assert.doesNotMatch(html, /<!--(?:app-html|page-head|content-snapshot)-->/);
  }
});
await test('sitemap includes published routes only and fallback keeps the 404 status', async () => {
  const sitemap = await readFile(`${root}/sitemap.xml`, 'utf8');
  for (const project of snapshot.projects)
    assert.ok(sitemap.includes(`/projects/${project.slug}</loc>`));
  assert.doesNotMatch(sitemap, /drafts\.|versions\.|\/404/);
  assert.match(await readFile(`${root}/404.html`, 'utf8'), /noindex, follow/);
  assert.equal(
    await readFile(`${root}/_redirects`, 'utf8'),
    '/* /404.html 404\n',
  );
});
await test('a failed connected content build stops before replacing rendered files', async () => {
  const before = await readFile(`${root}/index.html`, 'utf8');
  const result = spawnSync(process.execPath, ['scripts/prerender.mjs'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      PORTFOLIO_CONTENT_SOURCE: 'sanity',
      SANITY_PROJECT_ID: '',
      SANITY_DATASET: '',
    },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /SANITY_PROJECT_ID/);
  assert.equal(await readFile(`${root}/index.html`, 'utf8'), before);
});
await test('public JavaScript contains no Studio code or credential variable names', async () => {
  const html = await readFile(`${root}/index.html`, 'utf8');
  const asset = html.match(/src="(\/assets\/[^"]+\.js)"/)[1];
  const code = await readFile(root + asset, 'utf8');
  assert.doesNotMatch(
    code,
    /SANITY_WRITE_TOKEN|SANITY_STUDIO_|CaseStudyPreview|Bearer /,
  );
});
