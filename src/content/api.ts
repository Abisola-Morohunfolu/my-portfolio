import type {
  ContentSnapshot,
  Picture,
  Project,
  Profile,
  PublicCmsConfig,
} from './types';
import { safeUrl } from './helpers';
export { safeUrl, getProject, listProjects } from './helpers';

export const API_VERSION = '2026-03-01';
export const PROJECT_FIELDS = `_id,"slug":slug.current,title,category,summary,contribution,introduction,technologies,status,statusNote,order,featured,
  "cover":cover{alt,caption,"src":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height},
  "gallery":gallery[]{alt,caption,"src":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height},
  sections[]{_key,title,body,howItWorks,"image":image{alt,caption,"src":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height}},
  impactEvidence,collaborators,demoUrl,sourceUrl,relatedSlug`;
export const PUBLISHED_QUERY = `{
  "projects": *[_type == "project" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(order asc, title asc) {${PROJECT_FIELDS}},
  "profile": *[_type == "profile" && _id == "profile"][0]{_id,name,role,biography,email,github,linkedin,notes}
}`;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function strings(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function validateImage(value: unknown): asserts value is Picture {
  if (
    !record(value) ||
    !safeUrl(value.src, true) ||
    typeof value.alt !== 'string' ||
    !value.alt.trim() ||
    typeof value.width !== 'number' ||
    value.width <= 0 ||
    typeof value.height !== 'number' ||
    value.height <= 0
  ) {
    throw new Error(
      'Images need a safe URL, descriptive alt text and dimensions.',
    );
  }
}

export function validateProject(value: unknown): Project {
  if (!record(value)) throw new Error('Invalid project.');
  for (const field of [
    '_id',
    'slug',
    'title',
    'category',
    'summary',
    'contribution',
    'status',
  ]) {
    const fieldValue = value[field];
    if (typeof fieldValue !== 'string' || !fieldValue.trim())
      throw new Error(`Project requires ${field}.`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug as string))
    throw new Error('Invalid project slug.');
  if (
    ![
      'Live product',
      'Prototype',
      'Work in progress',
      'Personal project',
      'Local tool',
      'Earlier work',
    ].includes(value.status as string)
  )
    throw new Error('Invalid project status.');
  if (
    !Number.isFinite(value.order) ||
    typeof value.featured !== 'boolean' ||
    !strings(value.technologies)
  )
    throw new Error('Invalid ordering or technologies.');
  for (const field of ['introduction', 'impactEvidence']) {
    if (value[field] != null && !strings(value[field]))
      throw new Error(`Invalid ${field}.`);
  }
  for (const field of ['demoUrl', 'sourceUrl']) {
    if (value[field] != null && value[field] !== '' && !safeUrl(value[field]))
      throw new Error(`Unsafe ${field}.`);
  }
  if (value.cover) validateImage(value.cover);
  const gallery = value.gallery ?? [];
  const sections = value.sections ?? [];
  if (!Array.isArray(gallery) || !Array.isArray(sections))
    throw new Error('Invalid gallery or sections.');
  gallery.forEach(validateImage);
  for (const section of sections) {
    if (
      !record(section) ||
      typeof section._key !== 'string' ||
      typeof section.title !== 'string' ||
      !Array.isArray(section.body)
    )
      throw new Error('Invalid section.');
    if (section.howItWorks != null && !strings(section.howItWorks))
      throw new Error('Invalid how-it-works steps.');
    if (section.image) validateImage(section.image);
    for (const block of section.body) {
      if (
        !record(block) ||
        block._type !== 'block' ||
        !Array.isArray(block.children) ||
        block.children.some(
          (span) =>
            !record(span) ||
            span._type !== 'span' ||
            typeof span.text !== 'string',
        )
      )
        throw new Error('Invalid rich text.');
    }
  }
  return {
    ...value,
    status: value.status === 'Local tool' ? 'Personal project' : value.status,
    gallery,
    sections,
  } as unknown as Project;
}

export function validateProfile(value: unknown): Profile {
  if (!record(value) || value._id !== 'profile')
    throw new Error('The profile singleton is missing.');
  for (const field of [
    'name',
    'role',
    'biography',
    'email',
    'github',
    'linkedin',
  ]) {
    const fieldValue = value[field];
    if (typeof fieldValue !== 'string' || !fieldValue.trim())
      throw new Error(`Profile requires ${field}.`);
  }
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email as string) ||
    !safeUrl(value.github) ||
    !safeUrl(value.linkedin)
  )
    throw new Error('Invalid profile contact links.');
  const notes = value.notes ?? [];
  if (
    !Array.isArray(notes) ||
    notes.some(
      (note) =>
        !record(note) ||
        typeof note._key !== 'string' ||
        typeof note.title !== 'string' ||
        typeof note.text !== 'string',
    )
  )
    throw new Error('Invalid builder notes.');
  return { ...value, notes } as unknown as Profile;
}

export function normalizeContent(
  value: unknown,
  source: ContentSnapshot['source'],
  cms?: PublicCmsConfig,
): ContentSnapshot {
  if (!record(value) || !Array.isArray(value.projects))
    throw new Error('Invalid content snapshot.');
  // Defence in depth: even a malformed upstream response cannot put drafts in public routes.
  const projects = value.projects
    .filter(
      (project) =>
        !record(project) ||
        typeof project._id !== 'string' ||
        !/^(drafts|versions)\./.test(project._id),
    )
    .map(validateProject);
  const slugs = new Set(projects.map((project) => project.slug));
  if (slugs.size !== projects.length)
    throw new Error('Project slugs must be unique.');
  return {
    source,
    generatedAt: new Date().toISOString(),
    ...(cms ? { cms } : {}),
    profile: validateProfile(value.profile),
    projects: projects.sort(
      (a, b) => a.order - b.order || a.title.localeCompare(b.title),
    ),
  };
}

export function sanityQueryUrl(config: PublicCmsConfig): string {
  if (
    !/^[a-z0-9]+$/.test(config.projectId) ||
    !/^[a-z0-9_-]+$/.test(config.dataset)
  )
    throw new Error('Invalid Sanity project configuration.');
  // Fresh published reads rather than cached drafts or stale CDN content.
  const url = new URL(
    `https://${config.projectId}.api.sanity.io/v${API_VERSION}/data/query/${config.dataset}`,
  );
  url.searchParams.set('perspective', 'published');
  url.searchParams.set('query', PUBLISHED_QUERY);
  return url.href;
}

export async function fetchPublishedContent(
  config: PublicCmsConfig,
  fetcher: typeof fetch = fetch,
): Promise<ContentSnapshot> {
  const response = await fetcher(sanityQueryUrl(config), {
    signal: AbortSignal.timeout(12000),
    credentials: 'omit',
  });
  if (!response.ok)
    throw new Error(`Sanity published read failed (${response.status}).`);
  const data = (await response.json()) as { result?: unknown };
  return normalizeContent(data.result, 'sanity', config);
}

export async function refreshContent(
  snapshot: ContentSnapshot,
  fetcher: typeof fetch = fetch,
): Promise<ContentSnapshot> {
  if (!snapshot.cms) return snapshot;
  try {
    return await fetchPublishedContent(snapshot.cms, fetcher);
  } catch {
    return snapshot;
  }
}
