// Sanity image reference type
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Homepage content
export interface HomepageContent {
  heroImage?: SanityImage;
  tagline?: string;
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroSubtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
}

// About page content
export interface AboutStat {
  number: string;
  label: string;
}

export interface AboutContent {
  profileImage?: SanityImage;
  sectionTitle?: string;
  bio?: unknown[]; // Portable Text blocks
  bioSimple?: string[];
  stats?: AboutStat[];
}

// Contact page content
export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'youtube' | 'tiktok';
  url: string;
}

export interface ContactContent {
  sectionTitle?: string;
  sectionSubtitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  socialLinks?: SocialLink[];
}

// Gallery image
export interface GalleryImage {
  _id: string;
  title: string;
  image: SanityImage;
  alt: string;
  category: string;
  order?: number;
  featured?: boolean;
}

// Service
export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
}

// Site settings
export interface SiteSettings {
  siteName?: string;
  logo?: SanityImage;
  seoTitle?: string;
  seoDescription?: string;
  footerText?: string;
}

// All content combined
export interface AllContent {
  homepage: HomepageContent | null;
  about: AboutContent | null;
  contact: ContactContent | null;
  gallery: GalleryImage[];
  services: Service[];
  settings: SiteSettings | null;
}
