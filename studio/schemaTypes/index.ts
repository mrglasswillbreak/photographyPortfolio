import { galleryImage } from './galleryImage';
import { homepage } from './homepage';
import { about } from './about';
import { contact } from './contact';
import { service } from './service';
import { siteSettings } from './siteSettings';

export const schemaTypes = [
  // Singleton pages
  homepage,
  about,
  contact,
  siteSettings,
  
  // Collection types
  galleryImage,
  service,
];
