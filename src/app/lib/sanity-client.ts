import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { SanityImage } from './sanity-types';

export const sanityClient = createClient({
  projectId: '98dco624',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  withCredentials: false,
});

const builder = createImageUrlBuilder(sanityClient);

export const urlFor = (source: SanityImageSource) => builder.image(source);

export function getImageUrl(
  image: SanityImage | undefined,
  width?: number,
  height?: number,
  quality: number = 80
): string | undefined {
  if (!image) return undefined;
  let b = urlFor(image).auto('format').quality(quality);
  if (width) b = b.width(width);
  if (height) b = b.height(height);
  return b.url();
}

export function getLogoUrl(
  image: SanityImage | undefined,
  width?: number,
  height?: number
): string | undefined {
  if (!image) return undefined;
  let b = urlFor(image).format('png').quality(100);
  if (width) b = b.width(Math.round(width));
  if (height) b = b.height(Math.round(height));
  return b.url();
}

export function getImageSrcSet(
  image: SanityImage | undefined,
  widths: number[] = [320, 640, 960, 1280, 1920],
  quality: number = 80
): string | undefined {
  if (!image) return undefined;
  return widths
    .map(w => `${urlFor(image).auto('format').quality(quality).width(w).url()} ${w}w`)
    .join(', ');
}

export function getImageBlurUrl(image: SanityImage | undefined): string | undefined {
  if (!image) return undefined;
  return urlFor(image).auto('format').width(20).quality(20).blur(50).url();
}
