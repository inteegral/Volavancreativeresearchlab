import { defineType, defineField } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'mission',
      title: 'Mission Statement',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'history',
      title: 'History',
      type: 'blockContent',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'role', type: 'string', title: 'Role' },
            { name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true } },
            { name: 'bio', type: 'text', title: 'Bio', rows: 2 },
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'country', type: 'string', title: 'Country' },
        { name: 'mapUrl', type: 'url', title: 'Google Maps URL' },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Meta Title' },
        { name: 'description', type: 'text', title: 'Meta Description', rows: 2 },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', lang: 'language' },
    prepare({ title, lang }: { title?: string; lang?: string }) {
      return { title, subtitle: lang ? lang.toUpperCase() : undefined }
    },
  },
})
