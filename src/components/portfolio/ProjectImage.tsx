import { useState } from 'react';
import type { Picture } from '../../content/types';
import { responsiveImage } from '../../utils/responsiveImages';

export function ProjectImage({
  picture,
  priority = false,
  sizes = '100vw',
}: {
  picture: Picture;
  priority?: boolean;
  sizes?: string;
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
            {...responsiveImage(picture)}
            sizes={sizes}
            alt={picture.alt}
            width={picture.width}
            height={picture.height}
            loading={priority ? 'eager' : 'lazy'}
            // React 18 forwards the lowercase attribute without an unknown-prop warning.
            {...(priority ? { fetchpriority: 'high' } : {})}
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {picture.caption && <figcaption>{picture.caption}</figcaption>}
    </figure>
  );
}
