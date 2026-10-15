import type { Project } from '../../content/types';
import { ProjectImage } from './ProjectImage';
import { RichText } from './RichText';

// This renderer is shared by published routes and the authenticated Studio view.
// Plain anchors keep it usable without a router in Studio and without JavaScript.
export function CaseStudy({ project }: { project: Project }) {
  const intro = project.introduction;
  const hasSections = project.sections.length > 0;
  const hasBody =
    hasSections || !!project.impactEvidence?.length || !!project.collaborators;
  return (
    <article className="case-study">
      <header className="case-header">
        <a className="text-link back-link" href="/projects">
          ← All projects
        </a>
        <p className="eyebrow">{project.category}</p>
        <h1>{intro?.[0] ?? project.title}</h1>
        <div className="case-opening">
          <div className="case-intro">
            {(intro?.slice(1) ?? [project.summary]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="project-facts">
            <div>
              <dt>My contribution</dt>
              <dd>{project.contribution}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </div>
            <div>
              <dt>Built with</dt>
              <dd>{project.technologies.join(', ')}</dd>
            </div>
          </dl>
        </div>
        <div className="project-links">
          {project.demoUrl && (
            <a
              className="button-link"
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit product <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.sourceUrl && (
            <a
              className="text-link"
              href={project.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              View source <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        {project.statusNote && (
          <p className="status-note">{project.statusNote}</p>
        )}
      </header>
      {project.cover && (
        <div className="case-cover">
          <ProjectImage
            key={project.cover.src}
            picture={project.cover}
            priority
          />
        </div>
      )}
      {hasBody && (
        <div className="case-body">
          {hasSections && (
            <nav className="case-index" aria-label="In this case study">
              <p>In this project</p>
              {project.sections.map((section) => (
                <a key={section._key} href={`#${section._key}`}>
                  {section.title}
                </a>
              ))}
            </nav>
          )}
          <div className="case-sections">
            {project.sections.map((section) => (
              <section
                key={section._key}
                id={section._key}
                className="case-section"
              >
                <h2>{section.title}</h2>
                <RichText blocks={section.body} />
                {!!section.howItWorks?.length && (
                  <div className="how-it-works">
                    <h3>How it works</h3>
                    <ol>
                      {section.howItWorks.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {section.image && (
                  <ProjectImage
                    key={section.image.src}
                    picture={section.image}
                  />
                )}
              </section>
            ))}
            {!!project.impactEvidence?.length && (
              <section className="case-section">
                <h2>What the work enables</h2>
                <ul className="evidence-list">
                  {project.impactEvidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
            {project.collaborators && (
              <section className="case-section credits">
                <h2>With the team</h2>
                <p>{project.collaborators}</p>
              </section>
            )}
          </div>
        </div>
      )}
      {!!project.gallery.length && (
        <section className="case-gallery" aria-label="Project screenshots">
          {project.gallery.map((picture) => (
            <ProjectImage key={picture.src} picture={picture} />
          ))}
        </section>
      )}
      {project.relatedSlug && (
        <a
          className="related-project text-link"
          href={`/projects/${project.relatedSlug}`}
        >
          Read the connected platform story <span aria-hidden="true">↗</span>
        </a>
      )}
      <div className="case-end">
        <a className="text-link" href="/projects">
          ← Back to the collection
        </a>
        <a className="text-link" href="/#contact">
          Get in touch <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
