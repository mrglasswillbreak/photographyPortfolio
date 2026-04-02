import { defineType, defineField } from 'sanity';

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Your professional portrait photo',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'The Story Behind the Lens',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Your biography - supports rich text formatting',
    }),
    defineField({
      name: 'bioSimple',
      title: 'Biography (Simple)',
      type: 'array',
      of: [{ type: 'text' }],
      description: 'Your biography as simple paragraphs (fallback if rich text not needed)',
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'string',
              description: 'e.g., "10+", "500+", "50+"',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "Years Experience", "Projects Completed"',
            }),
          ],
          preview: {
            select: {
              number: 'number',
              label: 'label',
            },
            prepare({ number, label }) {
              return {
                title: `${number} - ${label}`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page Content',
      };
    },
  },
});
