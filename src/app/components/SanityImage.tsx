import { useState, useEffect } from 'react';
import { getImageUrl, getImageSrcSet, getImageBlurUrl, SanityImage as SanityImageType } from '../lib/sanity';

interface SanityImageProps {
  image: SanityImageType | undefined;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  widths?: number[];
}

/**
 * Optimized image component for Sanity images
 * Features:
 * - Automatic WebP/AVIF format selection
 * - Responsive srcset generation
 * - Blur placeholder (LQIP)
 * - Lazy loading
 */
export function SanityImage({
  image,
  alt,
  width,
  height,
  quality = 80,
  sizes = '100vw',
  className = '',
  priority = false,
  widths = [320, 640, 960, 1280, 1920],
}: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showImage, setShowImage] = useState(priority);

  useEffect(() => {
    if (!priority) {
      // Delay showing image slightly to allow blur to render
      const timer = setTimeout(() => setShowImage(true), 50);
      return () => clearTimeout(timer);
    }
  }, [priority]);

  if (!image) {
    return (
      <div
        className={`bg-[var(--color-sage)] ${className}`}
        style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
      />
    );
  }

  const mainSrc = getImageUrl(image, width, height, quality);
  const srcSet = getImageSrcSet(image, widths, quality);
  const blurUrl = getImageBlurUrl(image);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {blurUrl && !isLoaded && showImage && (
        <img
          src={blurUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Main image */}
      {showImage && mainSrc && (
        <img
          src={mainSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {/* Caption */}
      {image.caption && isLoaded && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-2">
          {image.caption}
        </div>
      )}
    </div>
  );
}
