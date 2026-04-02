export interface GalleryImage {
  id: number;
  title: string;
  alt: string;
  category: string;
  url: string;
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  updated_at?: string;
}

export interface ContentItem {
  id: number;
  section: string;
  key: string;
  value: string;
  updated_at?: string;
}

export interface SiteContent {
  // Hero
  hero_tagline: string;
  hero_title: string;
  hero_title_highlight: string;
  hero_subtitle: string;
  hero_primary_button: string;
  hero_secondary_button: string;
  // Gallery header
  gallery_title: string;
  gallery_subtitle: string;
  // About
  about_section_title: string;
  about_bio_1: string;
  about_bio_2: string;
  about_bio_3: string;
  about_stat_1_number: string;
  about_stat_1_label: string;
  about_stat_2_number: string;
  about_stat_2_label: string;
  about_stat_3_number: string;
  about_stat_3_label: string;
  // Contact
  contact_section_title: string;
  contact_section_subtitle: string;
  contact_email: string;
  contact_phone: string;
  contact_location: string;
  // Site
  site_name: string;
  footer_text: string;
}
