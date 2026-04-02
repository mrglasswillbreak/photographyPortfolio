import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Type for Sanity image source (simplified)
type SanityImageSource = {
  _type?: string;
  asset?: {
    _ref?: string;
    _type?: string;
  };
} | string;

// Sanity client configuration
// These values should be set via environment variables
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for faster reads (no real-time updates)
  // No token - read-only access for security
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper to build optimized image URLs
export function getImageUrl(
  source: SanityImageSource,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
) {
  if (!source) return '';
  
  let imageBuilder = builder.image(source);
  
  if (options?.width) {
    imageBuilder = imageBuilder.width(options.width);
  }
  if (options?.height) {
    imageBuilder = imageBuilder.height(options.height);
  }
  if (options?.quality) {
    imageBuilder = imageBuilder.quality(options.quality);
  }
  if (options?.format) {
    imageBuilder = imageBuilder.format(options.format);
  }
  
  // Default to auto format for best compression
  return imageBuilder.auto('format').url();
}
