import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Picture, Project } from '../../content/types';
import { ProjectImage } from './ProjectImage';
import { featuredImageSizes } from '../../utils/responsiveImages';

function Arrow() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function viewLabel(picture: Picture, index: number) {
  if (picture.src.includes('room-planner-3d')) return '3D room';
  if (picture.src.includes('room-planner-2d')) return 'Floor plan';
  if (picture.src.includes('room-planner-mobile')) return 'Shared view';
  return `View ${index + 1}`;
}

function ProjectSpread({ project, index }: { project: Project; index: number }) {
  const pictures = project.cover ? [project.cover, ...project.gallery] : project.gallery;
  const [pictureIndex, setPictureIndex] = useState(0);
  const picture = pictures[pictureIndex];

  return (
    <article className="work-spread" data-project={project.slug} aria-labelledby={`work-${project.slug}`}>
      <div className="work-artwork">
        <Link className="work-image-link" to={`/projects/${project.slug}`} aria-label={`Explore ${project.title}`} data-umami-event="project_image_clicked" data-umami-event-project={project.slug} data-umami-event-location="featured-image">
          <div className="work-image" key={picture?.src ?? project.slug}>
            {picture ? (
              <ProjectImage
                picture={{ ...picture, caption: undefined }}
                priority={index === 0 && pictureIndex === 0}
                sizes={featuredImageSizes(picture, index === 0 || (index + 1) % 4 === 0)}
              />
            ) : (
              <div className="media-missing">{project.title}<span>Case study</span></div>
            )}
          </div>
          <span className="work-image-arrow"><Arrow /></span>
        </Link>
        {pictures.length > 1 && (
          <div className="work-views" role="group" aria-label={`${project.title} screenshots`}>
            {pictures.map((image, viewIndex) => (
              <button
                key={image.src}
                type="button"
                aria-label={`Show ${viewLabel(image, viewIndex)}: ${image.alt}`}
                aria-pressed={pictureIndex === viewIndex}
                onClick={() => setPictureIndex(viewIndex)}
              >
                {viewLabel(image, viewIndex)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="work-copy">
        <div className="work-title-row">
          <h3 id={`work-${project.slug}`}>{project.title}</h3>
        </div>
        <p className="work-category">{project.category} <span>· {project.status}</span></p>
        <p className="work-summary">{project.summary}</p>
        <p className="work-stack">{project.technologies.join(' / ')}</p>
        <Link className="text-link" to={`/projects/${project.slug}`} data-umami-event="project_story_clicked" data-umami-event-project={project.slug} data-umami-event-location="featured-story">
          Read the story <Arrow />
        </Link>
      </div>
    </article>
  );
}

export function FeaturedWork({ projects }: { projects: Project[] }) {
  if (!projects.length) return (
    <p className="empty-state">New work will appear here soon. <Link to="/projects">Browse the collection</Link>.</p>
  );

  return (
    <div className="work-gallery">
      {projects.map((project, index) => <ProjectSpread key={project.slug} project={project} index={index} />)}
    </div>
  );
}
