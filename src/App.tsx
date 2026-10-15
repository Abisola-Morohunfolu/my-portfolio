import { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { getProject, listProjects, refreshContent } from './content/api';
import type { ContentSnapshot } from './content/types';
import { pageMetadata } from './content/metadata';
import { CaseStudy } from './components/portfolio/CaseStudy';
import { ProjectImage } from './components/portfolio/ProjectImage';
import { FeaturedWork } from './components/portfolio/FeaturedWork';

function Navigation() {
  return (
    <header className="site-header shell">
      <Link className="wordmark" to="/" aria-label="Abisola, home">
        abisola<span aria-hidden="true">.</span>
      </Link>
      <nav aria-label="Main navigation">
        <a href="/#works">Works</a>
        <a href="/#skills">Skills</a>
        <a href="/#contact" data-umami-event="contact_section_link_clicked" data-umami-event-location="navigation">
          Contact <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}

function Home({ snapshot }: { snapshot: ContentSnapshot }) {
  const { profile } = snapshot;
  const projects = listProjects(snapshot, true);
  const hasProject = (slug: string) => Boolean(getProject(snapshot, slug));
  return (
    <>
      <section className="intro shell">
        <h1>
          <span className="intro-name">I'm Abisola.</span>
          I build products <span className="intro-emphasis">end to end.</span>
        </h1>
        <div className="intro-aside">
          <p>{profile.role}</p>
          <a className="intro-scroll" href="#works" aria-label="Explore selected work">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v18M4 13l8 8 8-8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </div>
      </section>
      <section
        id="works"
        className="selected-work shell"
        aria-labelledby="works-title"
      >
        <div className="work-heading">
          <h2 id="works-title">Selected work<span>.</span></h2>
          <Link className="text-link" to="/projects" data-umami-event="all_projects_link_clicked" data-umami-event-location="selected-work">
            All projects <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <FeaturedWork projects={projects} />
      </section>
      <section
        className="approach shell"
        aria-labelledby="approach-title"
      >
        <div className="approach-heading">
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
      <section id="skills" className="stack-section shell" aria-labelledby="stack-title">
        <h2 id="stack-title">Across the stack<span>.</span></h2>
        <dl className="stack-list">
          <div><dt>Frontend</dt><dd>React / TypeScript / Material UI / Redux</dd></div>
          <div><dt>Backend & data</dt><dd>Node.js / Express / NestJS / Hono / PostgreSQL / D1</dd></div>
          <div><dt>AI & infrastructure</dt><dd>AWS Bedrock / Cloudflare Workers / Docker / Object storage</dd></div>
        </dl>
      </section>
      {!!profile.notes.length && (
        <section className="notes shell" aria-labelledby="notes-title">
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
                data-umami-event="project_card_clicked"
                data-umami-event-project={project.slug}
                data-umami-event-location="collection"
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
      <a className="contact-email" href={`mailto:${profile.email}`} data-umami-event="contact_email_clicked">
        {profile.email} <span aria-hidden="true">↗</span>
      </a>
      <div className="footer-bottom">
        <p>
          {profile.name}{' '}
          <span>© {new Date(snapshot.generatedAt).getUTCFullYear()}</span>
        </p>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer" data-umami-event="github_profile_clicked" data-umami-event-platform="github">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" data-umami-event="linkedin_profile_clicked" data-umami-event-platform="linkedin">
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
