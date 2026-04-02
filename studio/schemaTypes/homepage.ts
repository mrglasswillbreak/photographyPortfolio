import { defineType, defineField } from 'sanity';

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'The main background image for the hero section',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Small text above the main headline (e.g., "Professional Photography")',
      initialValue: 'Professional Photography',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title (Line 1)',
      type: 'string',
      description: 'First line of the main headline',
      initialValue: "Capturing Life's",
    }),
    defineField({
      name: 'heroTitleHighlight',
      title: 'Hero Title (Line 2 - Highlighted)',
      type: 'string',
      description: 'Second line of the headline (displayed in italic)',
      initialValue: 'Beautiful Moments',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'The descriptive text below the main headline',
      initialValue: 'Transforming fleeting moments into timeless memories through the art of photography',
    }),
    defineField({
      name: 'primaryButtonText',
      title: 'Primary Button Text',
      type: 'string',
      initialValue: 'View Gallery',
    }),
    defineField({
      name: 'secondaryButtonText',
      title: 'Secondary Button Text',
      type: 'string',
      initialValue: 'Get in Touch',
    }),
    defineField({
      name: 'galleryTitle',
      title: 'Gallery Section Title',
      type: 'string',
      initialValue: 'Selected Works',
    }),
    defineField({
      name: 'gallerySubtitle',
      title: 'Gallery Section Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'A curated collection of my finest photographs, showcasing the beauty in every frame',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Content',
      };
    },
  },
});
