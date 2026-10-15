export interface Picture {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface TextSpan {
  _type: 'span';
  _key: string;
  text: string;
  marks?: string[];
}

export interface TextBlock {
  _type: 'block';
  _key: string;
  style?: 'normal' | 'h3' | 'blockquote';
  listItem?: 'bullet' | 'number';
  children: TextSpan[];
  markDefs?: { _key: string; _type: 'link'; href: string }[];
}

export interface ProjectSection {
  _key: string;
  title: string;
  body: TextBlock[];
  howItWorks?: string[];
  image?: Picture;
}

export type ProjectStatus =
  | 'Live product'
  | 'Prototype'
  | 'Work in progress'
  | 'Local tool'
  | 'Earlier work';

export interface Project {
  _id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  contribution: string;
  introduction?: string[];
  technologies: string[];
  status: ProjectStatus;
  statusNote?: string;
  order: number;
  featured: boolean;
  cover?: Picture;
  gallery: Picture[];
  sections: ProjectSection[];
  impactEvidence?: string[];
  collaborators?: string;
  demoUrl?: string;
  sourceUrl?: string;
  relatedSlug?: string;
}

export interface Profile {
  _id: 'profile';
  name: string;
  role: string;
  biography: string;
  email: string;
  github: string;
  linkedin: string;
  notes: { _key: string; title: string; text: string; projectSlug?: string }[];
}

export interface PublicCmsConfig {
  projectId: string;
  dataset: string;
}

export interface ContentSnapshot {
  source: 'fixture' | 'sanity';
  generatedAt: string;
  cms?: PublicCmsConfig;
  profile: Profile;
  projects: Project[];
}
