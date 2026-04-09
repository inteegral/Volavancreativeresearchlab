import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const home = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'featureText',
      title: 'Feature Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'closingText',
      title: 'Closing Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'featuredResidencies',
      title: 'Featured Residencies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'residency' }] }],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'journalSectionTitle',
      title: 'Journal Section Title',
      type: 'string',
    }),
    defineField({
      name: 'journalSectionSubtitle',
      title: 'Journal Section Subtitle',
      type: 'text',
      rows: 2,
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
    select: { title: 'heroTitle', lang: 'language' },
    prepare({ title, lang }: { title?: string; lang?: string }) {
      return { title, subtitle: lang ? lang.toUpperCase() : undefined }
    },
  },
})
