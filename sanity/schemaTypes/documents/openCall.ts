import { defineType, defineField } from 'sanity'
import { BellIcon } from '@sanity/icons'

export const openCall = defineType({
  name: 'openCall',
  title: 'Open Call',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open', value: 'open' },
          { title: 'Closed', value: 'closed' },
          { title: 'Upcoming', value: 'upcoming' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'deadline',
      title: 'Application Deadline',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'residencyDates',
      title: 'Residency Dates',
      type: 'object',
      fields: [
        { name: 'start', type: 'date', title: 'Start Date' },
        { name: 'end', type: 'date', title: 'End Date' },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'blockContent',
    }),
    defineField({
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
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
    select: { title: 'title', subtitle: 'status', media: 'coverImage' },
  },
})
