import { defineType, defineField, defineArrayMember } from 'sanity'
import { PinIcon } from '@sanity/icons'
import { isUniqueByLanguage } from '../lib/isUniqueByLanguage'

export const location = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', isUnique: isUniqueByLanguage },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
          fields: [
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitude' },
        { name: 'lng', type: 'number', title: 'Longitude' },
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
    select: { title: 'name', subtitle: 'country', lang: 'language', media: 'coverImage' },
    prepare({ title, subtitle, lang, media }: { title?: string; subtitle?: string; lang?: string; media?: unknown }) {
      const parts = [lang ? lang.toUpperCase() : undefined, subtitle].filter(Boolean)
      return { title, subtitle: parts.join(' · ') || undefined, media }
    },
  },
})
