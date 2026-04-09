import { defineType, defineField, defineArrayMember } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'
import { isUniqueByLanguage } from '../lib/isUniqueByLanguage'

export const journal = defineType({
  name: 'journal',
  title: 'Journal',
  type: 'document',
  icon: DocumentTextIcon,
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', isUnique: isUniqueByLanguage },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          'News', 'Reflection', 'Interview', 'Documentation', 'Essay',
          '+-SON', 'Contemporâneo', 'Creative Ethology', 'Welcome Violence', 'CA TRÙ Experimental Lab',
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'artist' }],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'YouTube o Vimeo URL (opzionale)',
      type: 'url',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'relatedResidencies',
      title: 'Related Residencies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'residency' }] }],
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
    select: { title: 'title', publishedAt: 'publishedAt', lang: 'language', media: 'coverImage' },
    prepare({ title, publishedAt, lang, media }: { title?: string; publishedAt?: string; lang?: string; media?: unknown }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined
      const parts = [lang ? lang.toUpperCase() : undefined, date].filter(Boolean)
      return {
        title,
        subtitle: parts.join(' · ') || undefined,
        media,
      }
    },
  },
})
