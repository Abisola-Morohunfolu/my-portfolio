import { useState } from 'react';
import type { Picture } from '../../content/types';

export function ProjectImage({
  picture,
  priority = false,
}: {
  picture: Picture;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="project-figure">
      <div
        className="image-surface"
        style={{ aspectRatio: `${picture.width} / ${picture.height}` }}
      >
        {failed ? (
          <p className="image-unavailable">
            Screenshot unavailable. {picture.alt}
          </p>
        ) : (
          <img
            src={picture.src}
            alt={picture.alt}
            width={picture.width}
            height={picture.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {picture.caption && <figcaption>{picture.caption}</figcaption>}
    </figure>
  );
}
