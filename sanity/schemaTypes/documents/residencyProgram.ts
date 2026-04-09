import { defineType, defineField, defineArrayMember } from 'sanity'
import { CalendarIcon } from '@sanity/icons'
import { isUniqueByLanguage } from '../lib/isUniqueByLanguage'

export const residencyProgram = defineType({
  name: 'residencyProgram',
  title: 'Residency Program',
  type: 'document',
  icon: CalendarIcon,
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
      name: 'coverImage',
      title: 'Cover Image',
      description: 'Evergreen hero image for the program page — used as fallback when an edition has no cover image',
      type: 'image',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
    }),
    defineField({
      name: 'logo',
      title: 'Program Logo',
      type: 'image',
      options: { accept: 'image/jpeg,image/png,image/webp,image/svg+xml' },
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      description: 'Short subtitle shown in the hero, e.g. "Experimental Co-Creation Music Residency"',
      type: 'string',
    }),
    defineField({
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          'Visual Arts', 'Performance', 'Music', 'Dance',
          'Theatre', 'Literature', 'Film', 'Photography', 'Interdisciplinary',
        ],
      },
    }),
    defineField({
      name: 'concept',
      title: 'Concept',
      description: 'Narrative description of the artistic vision and approach',
      type: 'blockContent',
    }),
    defineField({
      name: 'whatWeOffer',
      title: 'What We Offer',
      type: 'blockContent',
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      description: 'What applicants need to submit',
      type: 'blockContent',
    }),
    defineField({
      name: 'applicationIntro',
      title: 'Application Intro',
      description: 'Opening sentence for the "How to Apply" section',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'gallery',
      title: 'Program Gallery',
      description: 'Evergreen photos representing the program identity — venues, atmosphere, visual brand. Shared across all editions and used on the program page. JPG, PNG or WebP only.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
          fields: [defineField({ name: 'caption', type: 'string', title: 'Caption' })],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Meta Title',
          description: 'Shown in browser tab and search results. Recommended: 50–60 characters.',
        },
        {
          name: 'description',
          type: 'text',
          title: 'Meta Description',
          rows: 2,
          description: 'Shown in search result snippets. Recommended: 150–160 characters.',
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Social Share Image',
          description: 'Image shown when shared on social media. Recommended: 1200×630px. Defaults to cover image if left empty.',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', lang: 'language' },
    prepare({ title, lang }: { title?: string; lang?: string }) {
      return {
        title,
        subtitle: lang ? lang.toUpperCase() : undefined,
      }
    },
  },
})
