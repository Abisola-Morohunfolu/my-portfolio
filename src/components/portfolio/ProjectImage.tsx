import { useState } from 'react';
import type { Picture } from '../../content/types';

// Local source images stay intact; CMS-hosted assets use their original URLs.
const previewImages: Record<string, string> = {
  '/equally.png': 'equally',
  '/images/testassessify.png': 'testassessify',
  '/images/flowy.png': 'flowy',
  '/system-playground-preview.png': 'system-playground',
  '/images/room-planner-3d.png': 'room-planner',
  '/images/shortty.png': 'shortty',
};

export function ProjectImage({
  picture,
  priority = false,
}: {
  picture: Picture;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const preview = previewImages[picture.src];
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
          <picture>
            {preview && (
              <source
                type="image/webp"
                srcSet={`/images/previews/${preview}-640.webp 640w, /images/previews/${preview}-1200.webp 1200w`}
                sizes="(max-width: 767px) calc(100vw - 40px), 1000px"
              />
            )}
            <img
              src={picture.src}
              alt={picture.alt}
              width={picture.width}
              height={picture.height}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              {...{ fetchpriority: priority ? 'high' : undefined }}
              onError={() => setFailed(true)}
            />
          </picture>
        )}
      </div>
      {picture.caption && <figcaption>{picture.caption}</figcaption>}
    </figure>
  );
}
