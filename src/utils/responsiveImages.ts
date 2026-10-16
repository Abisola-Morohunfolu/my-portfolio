import type { Picture } from '../content/types';

const widths = [320, 480, 640, 800, 960, 1280, 1600];

export function responsiveImage(picture: Picture) {
  let url: URL;
  try {
    url = new URL(picture.src);
  } catch {
    return { src: picture.src };
  }
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'cdn.sanity.io' ||
    !url.pathname.startsWith('/images/')
  ) {
    return { src: picture.src };
  }
  const originalWidth = Math.floor(picture.width);
  const candidates = [
    ...new Set(widths.map((width) => Math.min(width, originalWidth))),
  ];
  function variant(width: number) {
    const image = new URL(url);
    image.searchParams.set('w', String(width));
    image.searchParams.set('auto', 'format');
    image.searchParams.set('fit', 'max');
    image.searchParams.set('q', '85');
    return image.href;
  }
  return {
    src: variant(Math.min(960, originalWidth)),
    srcSet: candidates.map((width) => `${variant(width)} ${width}w`).join(', '),
  };
}

// Match the shell, grid gaps, and artwork padding in index.css.
export const imageSizes = {
  featuredWide:
    '(max-width: 360px) calc(100vw - 80px), (max-width: 767px) calc(100vw - 88px), (max-width: 1100px) calc(66vw - 121.92px), (max-width: 1440px) calc(66vw - 180.16px), 770.24px',
  featuredCard:
    '(max-width: 360px) calc(100vw - 80px), (max-width: 767px) calc(100vw - 88px), (max-width: 1100px) calc(50vw - 104px), (max-width: 1440px) calc(50vw - 152px), 568px',
  collection:
    '(max-width: 360px) calc(100vw - 80px), (max-width: 767px) calc(100vw - 88px), (max-width: 1100px) calc(50vw - 107px), (max-width: 1440px) calc(50vw - 127px), 593px',
  full: '(max-width: 360px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 72px), (max-width: 1440px) calc(100vw - 112px), 1328px',
  caseBody:
    '(max-width: 360px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(70.588235vw - 82.588235px), (max-width: 1440px) calc(70.588235vw - 135.529412px), 880.94px',
  galleryWide:
    '(max-width: 360px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(66.666667vw - 73.333333px), (max-width: 1440px) calc(66.666667vw - 100px), 860px',
  galleryNarrow:
    '(max-width: 360px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(33.333333vw - 36.666667px), (max-width: 1440px) calc(33.333333vw - 50px), 430px',
  gallerySecond:
    '(max-width: 360px) calc(100vw - 32px), (max-width: 400px) calc(100vw - 40px), (max-width: 767px) 360px, (max-width: 1100px) calc(33.333333vw - 36.666667px), (max-width: 1440px) calc(33.333333vw - 50px), 430px',
};
