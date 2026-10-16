import { getProject } from './helpers';
import type { ContentSnapshot } from './types';

export const SITE_URL = 'https://abisola.xyz';
export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  image: string;
  notFound: boolean;
}

export function pageMetadata(
  pathname: string,
  snapshot: ContentSnapshot,
): PageMetadata {
  const path = pathname.replace(/\/$/, '') || '/';
  const project = path.startsWith('/projects/')
    ? getProject(snapshot, path.slice(10))
    : undefined;
  const notFound = path !== '/' && path !== '/projects' && !project;
  return {
    title: project
      ? `${project.title} | Abisola Morohunfolu`
      : notFound
        ? 'Page not found | Abisola'
        : path === '/projects'
          ? 'Projects | Abisola Morohunfolu'
          : 'Abisola Morohunfolu | Product engineer',
    description:
      project?.summary ??
      (path === '/projects'
        ? 'Selected product work, prototypes, and explorations by Abisola Morohunfolu.'
        : 'I’m Abisola. I build products end to end. Explore my work across customer experiences and the systems behind them.'),
    canonical: `${SITE_URL}${notFound ? '/404' : path === '/' ? '' : path}`,
    image: project?.cover
      ? new URL(project.cover.src, SITE_URL).href
      : `${SITE_URL}/social-preview.png`,
    notFound,
  };
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!,
  );
}

export function metadataHtml(meta: PageMetadata): string {
  return `<title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <link rel="canonical" href="${escapeHtml(meta.canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Abisola Morohunfolu" />
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:url" content="${escapeHtml(meta.canonical)}" />
  <meta property="og:image" content="${escapeHtml(meta.image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
  <meta name="twitter:image" content="${escapeHtml(meta.image)}" />
  <meta name="robots" content="${meta.notFound ? 'noindex, follow' : 'index, follow'}" />`;
}

export function serializeSnapshot(snapshot: ContentSnapshot): string {
  return JSON.stringify(snapshot)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
