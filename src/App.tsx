import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { getProject, listProjects, refreshContent } from './content/api';
import type { ContentSnapshot, Project } from './content/types';
import { pageMetadata } from './content/metadata';
import { CaseStudy } from './components/portfolio/CaseStudy';
import { ProjectImage } from './components/portfolio/ProjectImage';

function Navigation() {
  return (
    <header className="site-header shell">
      <Link className="wordmark" to="/" aria-label="Abisola, home">
        abisola<span aria-hidden="true">.</span>
      </Link>
      <nav aria-label="Main navigation">
        <a href="/#works">Works</a>
        <a href="/#skills">Skills</a>
        <a href="/#contact">
          Contact <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}

function Viewer({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState(
    projects.find((project) => project.slug === 'equally-ai')?.slug ??
      projects[0]?.slug,
  );
  const active =
    projects.find((project) => project.slug === selected) ?? projects[0];
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
      next = (index + 1) % projects.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
      next = (index - 1 + projects.length) % projects.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = projects.length - 1;
    else return;
    event.preventDefault();
    setSelected(projects[next].slug);
    buttons.current[next]?.focus();
  }
  if (!active)
    return (
      <p className="empty-state">
        New work will appear here soon.{' '}
        <Link to="/projects">Browse the collection</Link>.
      </p>
    );
  return (
    <div className="project-viewer">
      <div className="viewer-menu">
        <div
          role="tablist"
          aria-label="Selected projects"
          aria-orientation="vertical"
        >
          {projects.map((project, index) => (
            <button
              key={project.slug}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              id={`tab-${project.slug}`}
              role="tab"
              type="button"
              aria-selected={active.slug === project.slug}
              aria-controls="project-panel"
              tabIndex={active.slug === project.slug ? 0 : -1}
              onClick={() => setSelected(project.slug)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="project-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="project-name">{project.title}</span>
                <span className="project-category">{project.category}</span>
              </span>
              <span className="selection-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
        <Link className="collection-link text-link" to="/projects">
          All projects <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div
        id="project-panel"
        className="viewer-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active.slug}`}
        tabIndex={0}
      >
        <div className="viewer-media" key={active.slug} data-project={active.slug}>
          {active.cover ? (
            <ProjectImage
              key={active.cover.src}
              picture={{ ...active.cover, caption: undefined }}
              priority
            />
          ) : (
            <div className="media-missing">
              {active.title}
              <span>Case study</span>
            </div>
          )}
        </div>
        <div className="viewer-caption">
          <div>
            <p className="viewer-status">{active.status}</p>
            <p className="viewer-summary">{active.summary}</p>
          </div>
          <Link className="case-link" to={`/projects/${active.slug}`}>
            Read the story <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Home({ snapshot }: { snapshot: ContentSnapshot }) {
  const { profile } = snapshot;
  const projects = listProjects(snapshot, true);
  const hasProject = (slug: string) => Boolean(getProject(snapshot, slug));
  return (
    <>
      <section className="intro shell">
        <p className="eyebrow">{profile.role}</p>
        <h1>
          I'm Abisola. I build products <span>end to end.</span>
        </h1>
      </section>
      <section
        id="works"
        className="selected-work shell"
        aria-labelledby="works-title"
      >
        <h2 id="works-title" className="section-label">
          Selected work
        </h2>
        <Viewer projects={projects} />
      </section>
      <section
        id="skills"
        className="approach shell reveal"
        aria-labelledby="approach-title"
      >
        <div className="approach-heading">
          <p className="section-label">How I work</p>
          <h2 id="approach-title">My approach.</h2>
          <p>{profile.biography}</p>
        </div>
        <div className="approach-observations">
          <article>
            <h3>Start with the problem.</h3>
            <p>
              Hiring teams need to understand how candidates perform. At
              TestAssessify, I helped lead the frontend for assessment setup and
              the admin dashboard that made those results available for review.
            </p>
            {hasProject('testassessify') && (
              <Link className="text-link" to="/projects/testassessify">
                TestAssessify <span aria-hidden="true">↗</span>
              </Link>
            )}
          </article>
          <article>
            <h3>Connect the pieces.</h3>
            <p>
              At Equally, I brought AI-assisted recommendations into the
              accessibility workflow, connecting the customer interface to the
              services behind it.
            </p>
            {hasProject('equally-ai') && (
              <Link className="text-link" to="/projects/equally-ai">
                Equally.ai <span aria-hidden="true">↗</span>
              </Link>
            )}
          </article>
          <article>
            <h3>Turn findings into next steps.</h3>
            <p>
              Finding an accessibility issue is a starting point. My AWS Bedrock
              integration helped turn those findings into recommendations teams
              could review and act on.
            </p>
            {hasProject('equally-ai') && (
              <Link
                className="text-link"
                to="/projects/equally-ai#recommendations"
              >
                AI in the workflow <span aria-hidden="true">↗</span>
              </Link>
            )}
          </article>
        </div>
      </section>
      {!!profile.notes.length && (
        <section className="notes shell reveal" aria-labelledby="notes-title">
          <h2 id="notes-title">
            Builder's notes<span aria-hidden="true">.</span>
          </h2>
          <div className="notes-grid">
            {profile.notes.map((note) => (
              <article key={note._key}>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
                {note.projectSlug && hasProject(note.projectSlug) && (
                  <Link
                    className="text-link"
                    to={`/projects/${note.projectSlug}`}
                  >
                    Explore the project <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Collection({ snapshot }: { snapshot: ContentSnapshot }) {
  const projects = listProjects(snapshot);
  return (
    <section className="collection shell">
      <header className="collection-header">
        <p className="eyebrow">Products & explorations</p>
        <h1>
          A collection
          <br />
          of things I've built<span>.</span>
        </h1>
        <p>Team projects, personal tools, and ideas I'm still working on.</p>
      </header>
      {projects.length ? (
        <div className="collection-grid">
          {projects.map((project) => (
            <article
              className={`collection-project ${project.cover ? '' : 'text-project'}`}
              key={project.slug}
            >
              <Link
                className="project-card-link"
                to={`/projects/${project.slug}`}
              >
                {project.cover && (
                  <ProjectImage
                    key={project.cover.src}
                    picture={{ ...project.cover, caption: undefined }}
                  />
                )}
                <div className="collection-project-heading">
                  <h2>{project.title}</h2>
                  <span aria-hidden="true">↗</span>
                </div>
                <p className="viewer-status">
                  {project.status} · {project.category}
                </p>
                <p className="collection-summary">{project.summary}</p>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          The collection is being updated. You can still{' '}
          <a href="/#contact">get in touch</a>.
        </p>
      )}
    </section>
  );
}

function NotFound() {
  return (
    <section className="not-found shell">
      <p className="eyebrow">404</p>
      <h1>
        This page isn't here<span>.</span>
      </h1>
      <p>
        The link may have changed, or the project may no longer be published.
      </p>
      <Link className="button-link" to="/projects">
        Browse projects <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
function ProjectRoute({ snapshot }: { snapshot: ContentSnapshot }) {
  const { slug } = useParams();
  const project = getProject(snapshot, slug ?? '');
  return project ? (
    <div className="shell">
      <CaseStudy key={project.slug} project={project} />
    </div>
  ) : (
    <NotFound />
  );
}
function Contact({ snapshot }: { snapshot: ContentSnapshot }) {
  const { profile } = snapshot;
  return (
    <footer id="contact" className="contact shell">
      <p className="section-label">Get in touch</p>
      <h2>
        Let's talk<span>.</span>
      </h2>
      <a className="contact-email" href={`mailto:${profile.email}`}>
        {profile.email} <span aria-hidden="true">↗</span>
      </a>
      <div className="footer-bottom">
        <p>
          {profile.name}{' '}
          <span>© {new Date(snapshot.generatedAt).getUTCFullYear()}</span>
        </p>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

function PageEffects({ snapshot }: { snapshot: ContentSnapshot }) {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    const meta = pageMetadata(location.pathname, snapshot);
    document.title = meta.title;
    const values = {
      description: meta.description,
      'og:title': meta.title,
      'og:description': meta.description,
      'og:url': meta.canonical,
      'og:image': meta.image,
      'twitter:title': meta.title,
      'twitter:description': meta.description,
      'twitter:image': meta.image,
      robots: meta.notFound ? 'noindex, follow' : 'index, follow',
    };
    for (const [name, value] of Object.entries(values)) {
      const key = name.startsWith('og:') ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${key}="${name}"]`,
      );
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(key, name);
        document.head.appendChild(element);
      }
      element.content = value;
    }
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = meta.canonical;
  }, [location.pathname, snapshot]);
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    } else if (previousPath.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('main')?.focus({ preventScroll: true });
    }
    previousPath.current = location.pathname;
  }, [location.pathname, location.hash]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll('.reveal')
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname]);
  return null;
}
export default function App({
  initialSnapshot,
}: {
  initialSnapshot: ContentSnapshot;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  useEffect(() => {
    let active = true;
    void refreshContent(initialSnapshot).then((content) => {
      if (active) setSnapshot(content);
    });
    return () => {
      active = false;
    };
  }, [initialSnapshot]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Navigation />
      <PageEffects snapshot={snapshot} />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home snapshot={snapshot} />} />
          <Route
            path="/projects"
            element={<Collection snapshot={snapshot} />}
          />
          <Route
            path="/projects/:slug"
            element={<ProjectRoute snapshot={snapshot} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Contact snapshot={snapshot} />
    </>
  );
}
