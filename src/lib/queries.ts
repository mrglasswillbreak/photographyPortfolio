import { sanityClient } from './sanity';
import type {
  HomepageContent,
  AboutContent,
  ContactContent,
  GalleryImage,
  Service,
  SiteSettings,
} from '../types/sanity';

// Query for homepage content
export async function getHomepageContent(): Promise<HomepageContent | null> {
  const query = `*[_type == "homepage"][0] {
    heroImage,
    tagline,
    heroTitle,
    heroTitleHighlight,
    heroSubtitle,
    primaryButtonText,
    secondaryButtonText,
    galleryTitle,
    gallerySubtitle
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return null;
  }
}

// Query for about page content
export async function getAboutContent(): Promise<AboutContent | null> {
  const query = `*[_type == "about"][0] {
    profileImage,
    sectionTitle,
    bio,
    bioSimple,
    stats
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
}

// Query for contact information
export async function getContactContent(): Promise<ContactContent | null> {
  const query = `*[_type == "contact"][0] {
    sectionTitle,
    sectionSubtitle,
    email,
    phone,
    location,
    socialLinks
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching contact content:', error);
    return null;
  }
}

// Query for gallery images
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const query = `*[_type == "galleryImage"] | order(order asc) {
    _id,
    title,
    image,
    alt,
    category,
    order,
    featured
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

// Query for featured gallery images (for homepage)
export async function getFeaturedImages(): Promise<GalleryImage[]> {
  const query = `*[_type == "galleryImage" && featured == true] | order(order asc) {
    _id,
    title,
    image,
    alt,
    category,
    order,
    featured
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching featured images:', error);
    return [];
  }
}

// Query for services
export async function getServices(): Promise<Service[]> {
  const query = `*[_type == "service"] | order(order asc) {
    _id,
    title,
    description,
    icon,
    order
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Query for site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const query = `*[_type == "siteSettings"][0] {
    siteName,
    logo,
    seoTitle,
    seoDescription,
    footerText
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

// Fetch all content at once (useful for SSR/initial load)
export async function getAllContent() {
  const query = `{
    "homepage": *[_type == "homepage"][0] {
      heroImage,
      tagline,
      heroTitle,
      heroTitleHighlight,
      heroSubtitle,
      primaryButtonText,
      secondaryButtonText,
      galleryTitle,
      gallerySubtitle
    },
    "about": *[_type == "about"][0] {
      profileImage,
      sectionTitle,
      bio,
      bioSimple,
      stats
    },
    "contact": *[_type == "contact"][0] {
      sectionTitle,
      sectionSubtitle,
      email,
      phone,
      location,
      socialLinks
    },
    "gallery": *[_type == "galleryImage"] | order(order asc) {
      _id,
      title,
      image,
      alt,
      category,
      order,
      featured
    },
    "services": *[_type == "service"] | order(order asc) {
      _id,
      title,
      description,
      icon,
      order
    },
    "settings": *[_type == "siteSettings"][0] {
      siteName,
      logo,
      seoTitle,
      seoDescription,
      footerText
    }
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching all content:', error);
    return null;
  }
}
