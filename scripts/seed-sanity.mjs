import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
const env = loadEnv('production', process.cwd(), '');
const {
  SANITY_PROJECT_ID: projectId,
  SANITY_DATASET: dataset,
  SANITY_WRITE_TOKEN: token,
} = env;
if (!projectId || !dataset || !token)
  throw new Error(
    'Set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_WRITE_TOKEN in your session. Never use VITE_* for tokens.',
  );
if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset))
  throw new Error('Invalid Sanity identifiers.');
const base = `https://${projectId}.api.sanity.io/v2026-03-01`;
const publish = process.argv.includes('--publish');
const snapshot = JSON.parse(
  await readFile('public/content-snapshot.json', 'utf8'),
);
async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok)
    throw new Error(`Sanity request failed (${response.status}).`);
  return response.json();
}
const imageCache = new Map();
async function upload(picture) {
  if (!picture) return undefined;
  if (!imageCache.has(picture.src)) {
    let bytes;
    if (picture.src.startsWith('/')) {
      const publicRoot = resolve('public');
      const path = resolve(publicRoot, '.' + picture.src);
      if (!path.startsWith(publicRoot + '/'))
        throw new Error('Invalid local image path.');
      bytes = await readFile(path);
    } else {
      if (new URL(picture.src).protocol !== 'https:')
        throw new Error('Images must use HTTPS.');
      const response = await fetch(picture.src, {
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok)
        throw new Error(`Source screenshot unavailable (${response.status}).`);
      bytes = new Uint8Array(await response.arrayBuffer());
    }
    const result = await request(`/assets/images/${dataset}`, {
      method: 'POST',
      body: bytes,
      headers: { 'Content-Type': 'application/octet-stream' },
    });
    imageCache.set(picture.src, result.document._id);
  }
  return {
    _type: 'screenshot',
    asset: { _type: 'reference', _ref: imageCache.get(picture.src) },
    alt: picture.alt,
    ...(picture.caption ? { caption: picture.caption } : {}),
  };
}
// Existing published or draft documents are skipped so a rerun cannot overwrite editorial work.
const ids = [
  snapshot.profile._id,
  ...snapshot.projects.map((project) => project._id),
];
const query = new URLSearchParams({
  perspective: 'raw',
  query: '*[_id in $ids]._id',
  $ids: JSON.stringify([...ids, ...ids.map((id) => `drafts.${id}`)]),
});
const existing = new Set(
  (await request(`/data/query/${dataset}?${query}`)).result,
);
const mutations = [];
if (!existing.has('profile') && !existing.has('drafts.profile'))
  mutations.push({
    createIfNotExists: {
      ...snapshot.profile,
      _type: 'profile',
      _id: publish ? 'profile' : 'drafts.profile',
      notes: (snapshot.profile.notes ?? []).map((note) => ({
        ...note,
        _type: 'builderNote',
      })),
    },
  });
for (const project of snapshot.projects) {
  if (existing.has(project._id) || existing.has(`drafts.${project._id}`))
    continue;
  const { cover, gallery, sections, slug, ...fields } = project;
  const document = {
    ...fields,
    _type: 'project',
    _id: publish ? project._id : `drafts.${project._id}`,
    slug: { _type: 'slug', current: slug },
    gallery: [],
    sections: [],
  };
  const uploadedCover = await upload(cover);
  if (uploadedCover) document.cover = uploadedCover;
  for (const [index, image] of gallery.entries())
    document.gallery.push({ ...(await upload(image)), _key: `image-${index}` });
  for (const section of sections) {
    const { image, ...text } = section;
    const mapped = { ...text, _type: 'projectSection' };
    const asset = await upload(image);
    if (asset) mapped.image = asset;
    document.sections.push(mapped);
  }
  mutations.push({ createIfNotExists: document });
}
if (mutations.length)
  await request(`/data/mutate/${dataset}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  });
console.log(
  `Created ${mutations.length} ${publish ? 'published' : 'draft'} documents; existing content was preserved.`,
);
