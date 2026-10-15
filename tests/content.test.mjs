import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { build } from 'vite';
await build({
  logLevel: 'silent',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'build/tests',
    emptyOutDir: true,
  },
});
const api = await import('../build/tests/entry-server.mjs');
const seed = JSON.parse(await readFile('public/content-snapshot.json', 'utf8'));
const snapshot = api.normalizeContent(seed, 'fixture');

await test('published reads explicitly exclude drafts and releases', () => {
  const url = new URL(
    api.sanityQueryUrl({ projectId: 'example123', dataset: 'production' }),
  );
  assert.equal(url.searchParams.get('perspective'), 'published');
  assert.match(url.searchParams.get('query'), /drafts\.\*\*/);
  assert.match(url.searchParams.get('query'), /versions\.\*\*/);
  const drafts = [
    { ...seed.projects[0], _id: 'drafts.private' },
    { ...seed.projects[0], _id: 'versions.release.private' },
  ];
  assert.equal(
    api.normalizeContent(
      { ...seed, projects: [...seed.projects, ...drafts] },
      'sanity',
    ).projects.length,
    9,
  );
});
await test('ordering, featured selection and direct slug lookup', () => {
  const shuffled = api.normalizeContent(
    { ...seed, projects: [...seed.projects].reverse() },
    'fixture',
  );
  assert.deepEqual(
    api.listProjects(shuffled, true).map((project) => project.slug),
    ['equally-ai', 'testassessify', 'room-planner', 'flowy'],
  );
  assert.equal(api.getProject(shuffled, 'equally-ai').title, 'Equally.ai');
  assert.equal(api.getProject(shuffled, 'missing'), undefined);
  assert.throws(
    () =>
      api.normalizeContent(
        { ...seed, projects: [seed.projects[0], seed.projects[0]] },
        'fixture',
      ),
    /unique/,
  );
});
await test('all routes render useful copy, approved intro and 404 without client JS', () => {
  for (const project of snapshot.projects) {
    const path = `/projects/${project.slug}`;
    assert.ok(api.render(path, snapshot).includes(project.title));
    assert.equal(api.pageMetadata(path, snapshot).notFound, false);
    assert.equal(
      api.pageMetadata(path, snapshot).canonical,
      `https://abisola.xyz${path}`,
    );
  }
  const equally = api.render('/projects/equally-ai', snapshot);
  assert.match(equally, /bringing AI into accessibility work/);
  assert.match(equally, /AWS Bedrock/);
  assert.ok(
    equally.indexOf('id="recommendations"') <
      equally.indexOf('id="reconciliation"'),
  );
  assert.doesNotMatch(equally, /locally stored|main branch|deployment is unverified/);
  assert.doesNotMatch(equally, /With the team/);
  assert.match(api.render('/projects/unknown', snapshot), /404/);
  assert.equal(api.pageMetadata('/projects/unknown', snapshot).notFound, true);
  assert.equal(api.pageMetadata('/projects/', snapshot).notFound, false);
});
await test('empty collections, notes, missing images and optional fields render', () => {
  const empty = api.normalizeContent(
    { ...seed, projects: [], profile: { ...seed.profile, notes: [] } },
    'sanity',
  );
  assert.match(api.render('/', empty), /New work will appear/);
  assert.match(api.render('/projects', empty), /collection is being updated/);
  const minimal = structuredClone(seed.projects[0]);
  for (const field of [
    'cover',
    'gallery',
    'sections',
    'demoUrl',
    'sourceUrl',
    'introduction',
  ])
    delete minimal[field];
  const content = api.normalizeContent(
    { ...seed, projects: [minimal] },
    'fixture',
  );
  assert.ok(api.render('/projects/equally-ai', content).includes('Equally.ai'));
  assert.deepEqual(content.projects[0].gallery, []);
});
await test('outcomes render without sections and team credits stay hidden', () => {
  for (const sections of [undefined, []]) {
    for (const fields of [
      { impactEvidence: ['An independently supported outcome.'] },
      { collaborators: 'An independently credited team.' },
      {
        impactEvidence: ['An independently supported outcome.'],
        collaborators: 'An independently credited team.',
      },
      {},
    ]) {
      const project = {
        ...seed.projects[0],
        sections,
        impactEvidence: undefined,
        collaborators: undefined,
        ...fields,
      };
      const content = api.normalizeContent(
        { ...seed, projects: [project] },
        'fixture',
      );
      const html = api.render(`/projects/${project.slug}`, content);
      assert.equal(html.includes('What the work enables'), Boolean(fields.impactEvidence));
      assert.doesNotMatch(html, /With the team/);
      for (const outcome of fields.impactEvidence ?? []) assert.ok(html.includes(outcome));
      if (fields.collaborators) assert.ok(!html.includes(fields.collaborators));
      assert.doesNotMatch(html, /aria-label="In this case study"/);
      assert.equal(html.includes('class="case-body"'), Boolean(fields.impactEvidence));
    }
  }
});
await test('seeding creates editable builder notes and preserves existing projects', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { readFile } from 'node:fs/promises';
    const seed = JSON.parse(await readFile('public/content-snapshot.json', 'utf8'));
    let mutations;
    globalThis.fetch = async (url, options = {}) => {
      if (new URL(url).pathname.includes('/data/query/')) {
        return Response.json({ result: seed.projects.map(project => project._id) });
      }
      if (new URL(url).pathname.includes('/data/mutate/')) {
        mutations = JSON.parse(options.body).mutations;
        return Response.json({});
      }
      throw new Error('Unexpected request: ' + url);
    };
    await import('./scripts/seed-sanity.mjs');
    assert.equal(mutations.length, 1);
    const profile = mutations[0].createIfNotExists;
    assert.equal(profile._id, 'drafts.profile');
    assert.equal(profile._type, 'profile');
    assert.equal(profile.notes.length, seed.profile.notes.length);
    profile.notes.forEach((note, index) => {
      assert.equal(note._type, 'builderNote');
      const { _type, ...fields } = note;
      assert.deepEqual(fields, seed.profile.notes[index]);
    });
  `], {
    encoding: 'utf8',
    env: {
      ...process.env,
      SANITY_PROJECT_ID: 'reviewtest',
      SANITY_DATASET: 'production',
      SANITY_WRITE_TOKEN: 'mock-test-token',
    },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
await test('CMS failure preserves the existing rendered snapshot', async () => {
  const configured = {
    ...snapshot,
    cms: { projectId: 'example123', dataset: 'production' },
  };
  const failing = async () => {
    throw new Error('offline');
  };
  assert.equal(await api.refreshContent(configured, failing), configured);
  assert.equal(
    await api.refreshContent(
      configured,
      async () => new Response('{}', { status: 503 }),
    ),
    configured,
  );
  await assert.rejects(
    api.fetchPublishedContent(configured.cms, failing),
    /offline/,
  );
  await assert.rejects(
    api.fetchPublishedContent(configured.cms, async () => new Response('{}')),
    /Invalid content/,
  );
});
await test('publish/update/unpublish snapshots change routes and metadata', async () => {
  const config = { projectId: 'example123', dataset: 'production' };
  let payload = structuredClone(seed);
  const fetcher = async () => new Response(JSON.stringify({ result: payload }));
  const published = await api.fetchPublishedContent(config, fetcher);
  assert.equal(api.getProject(published, 'equally-ai').title, 'Equally.ai');
  payload.projects[0].summary = 'An edited published summary.';
  const updated = await api.fetchPublishedContent(config, fetcher);
  assert.equal(
    api.pageMetadata('/projects/equally-ai', updated).description,
    'An edited published summary.',
  );
  payload.projects = payload.projects.filter(
    (project) => project.slug !== 'equally-ai',
  );
  const removed = await api.fetchPublishedContent(config, fetcher);
  assert.equal(api.getProject(removed, 'equally-ai'), undefined);
  assert.equal(
    api.pageMetadata('/projects/equally-ai', removed).notFound,
    true,
  );
});
await test('unsafe links, malformed content and script injection are contained', () => {
  assert.throws(
    () =>
      api.normalizeContent(
        {
          ...seed,
          projects: [{ ...seed.projects[0], demoUrl: 'javascript:alert(1)' }],
        },
        'fixture',
      ),
    /Unsafe/,
  );
  assert.throws(
    () =>
      api.normalizeContent(
        {
          ...seed,
          projects: [
            {
              ...seed.projects[0],
              cover: { ...seed.projects[0].cover, alt: '' },
            },
          ],
        },
        'fixture',
      ),
    /alt text/,
  );
  assert.throws(
    () => api.normalizeContent({ ...seed, profile: null }, 'fixture'),
    /singleton/,
  );
  assert.ok(
    !api
      .serializeSnapshot({
        ...snapshot,
        injected: '</script><script>alert(1)</script>',
      })
      .includes('</script>'),
  );
  assert.equal(api.safeUrl('//example.com', true), false);
});
