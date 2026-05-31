import { defineType, defineField, defineArrayMember } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const residency = defineType({
  name: 'residency',
  title: 'Residency Edition',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'edition', title: 'Edition', default: true },
    { name: 'program', title: 'Program' },
    { name: 'artists', title: 'Artists' },
    { name: 'accommodation', title: 'Accommodation' },
    { name: 'apply', title: 'Apply' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'program',
      title: 'Program',
      description: 'The program this edition belongs to.',
      type: 'reference',
      to: [{ type: 'residencyProgram' }],
      validation: (r) => r.required(),
      group: 'edition',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: 'Hero image for this edition — JPG, PNG or WebP only',
      type: 'image',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
      group: 'edition',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL identifier, e.g. son-2025',
      type: 'slug',
      validation: (r) => r.required(),
      group: 'edition',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (r) => r.required().integer().min(2000).max(2100),
      group: 'edition',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      description: 'Number of artists to be selected for this edition',
      type: 'number',
      validation: (r) => r.integer().min(1),
      group: 'edition',
    }),
    defineField({
      name: 'residencyDates',
      title: 'Residency Dates',
      type: 'object',
      fields: [
        defineField({ name: 'start', type: 'date', title: 'Start' }),
        defineField({ name: 'end', type: 'date', title: 'End' }),
      ],
      group: 'edition',
    }),
    defineField({
      name: 'callDates',
      title: 'Open Call Dates',
      type: 'object',
      fields: [
        defineField({ name: 'open', type: 'date', title: 'Call Opens' }),
        defineField({ name: 'close', type: 'date', title: 'Deadline' }),
      ],
      group: 'edition',
    }),
    defineField({
      name: 'feeAmount',
      title: 'Fee Amount',
      description: 'Leave empty if free',
      type: 'number',
      group: 'edition',
    }),
    defineField({
      name: 'feeIncludes',
      title: 'Fee Includes',
      description: 'What is included in the fee (accommodation, meals, etc.)',
      type: 'text',
      rows: 8,
      group: 'edition',
    }),
    defineField({
      name: 'keyFigures',
      title: 'Key Figures',
      description: 'Artistic directors, curators, mentors and other key people for this edition',
      type: 'array',
      group: 'edition',
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
            defineField({
              name: 'statement',
              title: 'Statement',
              description: 'Curatorial note or personal statement for this edition',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: { title: 'artist.name', subtitle: 'role' },
          },
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Edition Gallery',
      description: 'Photos specific to this edition — events, workshops, participants, documented moments. Shown exclusively on this edition\'s page. JPG, PNG or WebP only.',
      type: 'array',
      group: 'edition',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
          fields: [defineField({ name: 'caption', type: 'string', title: 'Caption' })],
        }),
      ],
    }),
    defineField({
      name: 'structure',
      title: 'Program Content',
      description: 'How the residency is organized — cycles, dynamics, format. This content appears in the "Program" tab on the edition page.',
      type: 'blockContent',
      group: 'program',
    }),
    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      group: 'artists',
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
      name: 'location',
      title: 'Location',
      description: 'Links to the Location document. To edit accommodation description and photos, open the linked Location document directly.',
      type: 'reference',
      to: [{ type: 'location' }],
      group: 'accommodation',
    }),
    defineField({
      name: 'formsparkId',
      title: 'Formspark Form ID',
      description: 'The Formspark form ID for this edition\'s application form (e.g. "OiX6zdV28"). Application text (requirements, intro) is managed on the Program document.',
      type: 'string',
      group: 'apply',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      description: 'Override program SEO for this edition. Leave all fields empty to inherit from the program.',
      type: 'object',
      group: 'seo',
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
