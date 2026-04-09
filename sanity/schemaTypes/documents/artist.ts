import { defineType, defineField, defineArrayMember } from 'sanity'
import { UserIcon } from '@sanity/icons'
import { isUniqueByLanguage } from '../lib/isUniqueByLanguage'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'name',
      title: 'Name / Stage Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'legalFirstName',
      title: 'Legal First Name',
      type: 'string',
    }),
    defineField({
      name: 'legalLastName',
      title: 'Legal Last Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', isUnique: isUniqueByLanguage },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
    }),
    defineField({
      name: 'nationality',
      title: 'Nationality / Origin',
      type: 'string',
    }),
    defineField({
      name: 'disciplines',
      title: 'Disciplines',
      description: 'Artistic disciplines (e.g. Soundscape, Live coding, Field recording)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'instruments',
      title: 'Instruments / Focus',
      description: 'Instruments and specific tools (e.g. Didgeridoo, DAW, Viola)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'blockContent',
    }),
    defineField({
      name: 'whyVolavan',
      title: 'Why Volavan?',
      description: 'Artist motivation for joining the residency',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'links',
      title: 'Links',
      description: 'Website, Instagram, SoundCloud, YouTube, Bandcamp, etc.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. Website, Instagram, SoundCloud',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        }),
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
    select: { title: 'name', nationality: 'nationality', lang: 'language', media: 'photo' },
    prepare({ title, nationality, lang, media }: { title?: string; nationality?: string; lang?: string; media?: unknown }) {
      const parts = [lang ? lang.toUpperCase() : undefined, nationality].filter(Boolean)
      return {
        title,
        subtitle: parts.join(' · ') || undefined,
        media,
      }
    },
  },
})
