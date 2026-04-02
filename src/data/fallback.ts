import type {
  HomepageContent,
  AboutContent,
  ContactContent,
  GalleryImage,
  Service,
} from '../types/sanity';

// Fallback homepage content (used when CMS is unavailable)
export const fallbackHomepage: HomepageContent = {
  tagline: 'Professional Photography',
  heroTitle: "Capturing Life's",
  heroTitleHighlight: 'Beautiful Moments',
  heroSubtitle: 'Transforming fleeting moments into timeless memories through the art of photography',
  primaryButtonText: 'View Gallery',
  secondaryButtonText: 'Get in Touch',
  galleryTitle: 'Selected Works',
  gallerySubtitle: 'A curated collection of my finest photographs, showcasing the beauty in every frame',
};

// Fallback about content
export const fallbackAbout: AboutContent = {
  sectionTitle: 'The Story Behind the Lens',
  bioSimple: [
    "With over a decade of experience in photography, I've dedicated my life to capturing the extraordinary in the ordinary. My journey began with a simple film camera and has evolved into a passion for visual storytelling.",
    "I believe every photograph tells a story – a moment frozen in time, waiting to be remembered. Whether it's the tender glance between newlyweds or the majestic beauty of a mountain sunrise, I strive to capture the emotion and essence of every scene.",
    "My work has been featured in numerous publications and exhibitions worldwide. But my greatest reward is seeing the joy on my clients' faces when they relive their precious moments through my images.",
  ],
  stats: [
    { number: '10+', label: 'Years Experience' },
    { number: '500+', label: 'Projects Completed' },
    { number: '50+', label: 'Awards Won' },
  ],
};

// Fallback contact content
export const fallbackContact: ContactContent = {
  sectionTitle: "Let's Connect",
  sectionSubtitle: "Have a project in mind? I'd love to hear from you. Let's create something beautiful together.",
  email: 'hello@lenscraft.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
};

// Fallback gallery images (using external URLs as placeholders)
export const fallbackGallery: GalleryImage[] = [
  {
    _id: '1',
    title: 'Mountain landscape at sunset',
    alt: 'Mountain landscape at sunset',
    category: 'Landscape',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '2',
    title: 'Wedding couple portrait',
    alt: 'Wedding couple portrait',
    category: 'Wedding',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '3',
    title: 'Professional portrait',
    alt: 'Professional portrait',
    category: 'Portrait',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '4',
    title: 'Forest nature scene',
    alt: 'Forest nature scene',
    category: 'Nature',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '5',
    title: 'Wedding ceremony',
    alt: 'Wedding ceremony',
    category: 'Wedding',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '6',
    title: 'Portrait in natural light',
    alt: 'Portrait in natural light',
    category: 'Portrait',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '7',
    title: 'Foggy mountains',
    alt: 'Foggy mountains',
    category: 'Landscape',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '8',
    title: 'Wildflowers in meadow',
    alt: 'Wildflowers in meadow',
    category: 'Nature',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '9',
    title: 'Wedding details',
    alt: 'Wedding details',
    category: 'Wedding',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '10',
    title: 'Fashion portrait',
    alt: 'Fashion portrait',
    category: 'Portrait',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '11',
    title: 'Lake reflection',
    alt: 'Lake reflection',
    category: 'Landscape',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
  {
    _id: '12',
    title: 'Sunlit forest path',
    alt: 'Sunlit forest path',
    category: 'Nature',
    image: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  },
];

// Legacy fallback URLs for when CMS images aren't available
export const fallbackImageUrls: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '2': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
  '3': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
  '4': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  '5': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  '6': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  '7': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  '8': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80',
  '9': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
  '10': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
  '11': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  '12': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  hero: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80',
  about: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800&q=80',
};

// Fallback services
export const fallbackServices: Service[] = [
  {
    _id: '1',
    title: 'Wedding Photography',
    description: 'Capturing your special day with timeless elegance and authentic emotion.',
    icon: 'Heart',
    order: 1,
  },
  {
    _id: '2',
    title: 'Portrait Sessions',
    description: 'Professional portraits that reveal your unique personality and style.',
    icon: 'User',
    order: 2,
  },
  {
    _id: '3',
    title: 'Landscape & Nature',
    description: 'Fine art prints showcasing the beauty of natural landscapes.',
    icon: 'Mountain',
    order: 3,
  },
  {
    _id: '4',
    title: 'Commercial Work',
    description: 'High-quality imagery for brands, products, and marketing campaigns.',
    icon: 'Camera',
    order: 4,
  },
];
