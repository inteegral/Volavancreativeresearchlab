import { defineType, defineField, defineArrayMember } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const residency = defineType({
  name: 'residency',
  title: 'Residency Edition',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'program',
      title: 'Program',
      description: 'The program this edition belongs to.',
      type: 'reference',
      to: [{ type: 'residencyProgram' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: 'Hero image for this edition — JPG, PNG or WebP only',
      type: 'image',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL identifier, e.g. son-2025',
      type: 'slug',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (r) => r.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      description: 'Number of artists to be selected for this edition',
      type: 'number',
      validation: (r) => r.integer().min(1),
    }),
    defineField({
      name: 'feeAmount',
      title: 'Fee Amount',
      description: 'Leave empty if free',
      type: 'number',
    }),
    defineField({
      name: 'feeIncludes',
      title: 'Fee Includes',
      description: 'What is included in the fee (accommodation, meals, etc.)',
      type: 'text',
      rows: 8,
    }),
    defineField({
      name: 'structure',
      title: 'Structure',
      description: 'How the residency is organized — cycles, dynamics, format',
      type: 'blockContent',
    }),
    defineField({
      name: 'residencyDates',
      title: 'Residency Dates',
      type: 'object',
      fields: [
        defineField({ name: 'start', type: 'date', title: 'Start' }),
        defineField({ name: 'end', type: 'date', title: 'End' }),
      ],
    }),
    defineField({
      name: 'callDates',
      title: 'Open Call Dates',
      type: 'object',
      fields: [
        defineField({ name: 'open', type: 'date', title: 'Call Opens' }),
        defineField({ name: 'close', type: 'date', title: 'Deadline' }),
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      to: [{ type: 'location' }],
    }),
    defineField({
      name: 'keyFigures',
      title: 'Key Figures',
      description: 'Artistic directors, curators, mentors and other key people for this edition',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'artist',
              title: 'Person',
              type: 'reference',
              to: [{ type: 'artist' }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              placeholder: 'e.g. Artistic Director, Curator, Mentor…',
            }),
          ],
          preview: {
            select: { title: 'artist.name', subtitle: 'role' },
          },
        }),
      ],
    }),
    defineField({
      name: 'directorStatement',
      title: 'Director Statement',
      description: 'Curatorial approach for this edition — available in EN and ES',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'artist',
              title: 'Artist',
              type: 'reference',
              to: [{ type: 'artist' }],
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'artist.name', subtitle: 'artist.nationality', media: 'artist.photo' },
          },
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Edition Gallery',
      description: 'Photos specific to this edition — events, workshops, participants, documented moments. Shown exclusively on this edition\'s page. JPG, PNG or WebP only.',
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
      description: 'Override program SEO for this edition. Leave all fields empty to inherit from the program.',
      type: 'object',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Meta Title',
          description: 'Shown in browser tab and search results. Recommended: 50–60 characters. Leave empty to use the program title.',
        },
        {
          name: 'description',
          type: 'text',
          title: 'Meta Description',
          rows: 2,
          description: 'Shown in search result snippets. Recommended: 150–160 characters. Leave empty to use the program description.',
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Social Share Image',
          description: 'Image shown when shared on social media. Recommended: 1200×630px. Defaults to edition cover image if left empty.',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    select: {
      program: 'program.name',
      year: 'year',
      media: 'gallery.0',
    },
    prepare({ program, year, media }) {
      return {
        title: program && year ? `${program} ${year}` : program ?? 'New Edition',
        subtitle: year ? String(year) : '',
        media,
      }
    },
  },
})
