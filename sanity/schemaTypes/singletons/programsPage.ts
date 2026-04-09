import { defineType, defineField } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const programsPage = defineType({
  name: 'programsPage',
  title: 'Programs Page',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'supertitle',
      title: 'Supertitle',
      description: 'Small label above the title, e.g. "Curated Programmes"',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Main page title, e.g. "Art Residencies"',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      description: 'Text before the programme grid, e.g. "Browse the programmes below."',
      type: 'string',
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
      return { title: title ?? 'Programs Page', subtitle: lang ? lang.toUpperCase() : undefined }
    },
  },
})
