import { defineType, defineField } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name from Lucide icons (Heart, User, Mountain, Camera, etc.)',
      options: {
        list: [
          { title: 'Heart', value: 'Heart' },
          { title: 'User', value: 'User' },
          { title: 'Mountain', value: 'Mountain' },
          { title: 'Camera', value: 'Camera' },
          { title: 'Image', value: 'Image' },
          { title: 'Video', value: 'Video' },
          { title: 'Star', value: 'Star' },
          { title: 'Award', value: 'Award' },
          { title: 'Calendar', value: 'Calendar' },
          { title: 'Users', value: 'Users' },
        ],
      },
      initialValue: 'Camera',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
