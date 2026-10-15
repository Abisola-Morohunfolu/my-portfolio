import { useEffect, useState, type MouseEvent } from 'react';
import { useClient } from 'sanity';
import { CaseStudy } from '../../src/components/portfolio/CaseStudy';
import { API_VERSION, validateProject } from '../../src/content/api';
import type { Picture, Project } from '../../src/content/types';
import './portfolio.css';

interface Asset {
  _id: string;
  url: string;
  metadata: { dimensions: { width: number; height: number } };
}
interface RawImage {
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
}
interface PreviewProps {
  document: { displayed: Record<string, unknown> | null };
}
export function CaseStudyPreview({ document }: PreviewProps) {
  const client = useClient({ apiVersion: API_VERSION });
  const [state, setState] = useState<{ project?: Project; error?: string }>({});
  const doc = document.displayed;
  useEffect(() => {
    let active = true;
    async function load() {
      if (!doc) return;
      const images: RawImage[] = [
        doc.cover as RawImage,
        ...((doc.gallery as RawImage[]) ?? []),
        ...((doc.sections as { image?: RawImage }[]) ?? []).map(
          (section) => section.image,
        ),
      ].filter((value): value is RawImage => Boolean(value));
      const ids = images.map((image) => image.asset?._ref).filter(Boolean);
      // useClient inherits the logged-in Studio session. No public preview token is used.
      const assets = await client
        .withConfig({ useCdn: false })
        .fetch<Asset[]>(
          '*[_type == "sanity.imageAsset" && _id in $ids]{_id,url,metadata{dimensions}}',
          { ids },
        );
      function picture(raw?: RawImage): Picture | undefined {
        const asset = assets.find((asset) => asset._id === raw?.asset?._ref);
        return asset && raw
          ? {
              src: asset.url,
              alt: raw.alt || '',
              caption: raw.caption,
              width: asset.metadata.dimensions.width,
              height: asset.metadata.dimensions.height,
            }
          : undefined;
      }
      const project = validateProject({
        ...doc,
        slug: (doc.slug as { current?: string })?.current,
        cover: picture(doc.cover as RawImage),
        gallery: ((doc.gallery as RawImage[]) ?? [])
          .map(picture)
          .filter(Boolean),
        sections: ((doc.sections as Record<string, unknown>[]) ?? []).map(
          (section) => ({
            ...section,
            image: picture(section.image as RawImage),
          }),
        ),
      });
      if (active) setState({ project });
    }
    void load().catch((error) => {
      if (active)
        setState({
          error:
            error instanceof Error ? error.message : 'Preview unavailable.',
        });
    });
    return () => {
      active = false;
    };
  }, [client, doc]);
  function externalLinks(event: MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest('a');
    if (
      anchor?.getAttribute('href')?.startsWith('/') &&
      !anchor.getAttribute('href')?.startsWith('//')
    ) {
      event.preventDefault();
      window.open(
        new URL(anchor.getAttribute('href')!, 'https://abisola.xyz').href,
        '_blank',
        'noopener,noreferrer',
      );
    }
  }
  return (
    <div className="portfolio-preview" onClick={externalLinks}>
      <p className="preview-notice">
        Authenticated draft preview. Save required fields to see the case study.
      </p>
      {state.error ? (
        <p role="status">{state.error}</p>
      ) : state.project ? (
        <CaseStudy project={state.project} />
      ) : (
        <p role="status">Loading preview…</p>
      )}
    </div>
  );
}
