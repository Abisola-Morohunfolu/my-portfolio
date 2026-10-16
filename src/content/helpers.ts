import type { ContentSnapshot, Project } from './types';

export function safeUrl(
  value: unknown,
  allowRelative = false,
): value is string {
  if (typeof value !== 'string') return false;
  if (allowRelative && /^\/(?!\/)/.test(value)) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function listProjects(
  snapshot: ContentSnapshot,
  featuredOnly = false,
): Project[] {
  return snapshot.projects.filter(
    (project) => !featuredOnly || project.featured,
  );
}

export function getProject(
  snapshot: ContentSnapshot,
  slug: string,
): Project | undefined {
  return snapshot.projects.find((project) => project.slug === slug);
}
