import { defineType, defineField } from 'sanity'
import { InlineIcon } from '@sanity/icons'

export const application = defineType({
  name: 'application',
  title: 'Application',
  type: 'document',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'residency',
      title: 'Residency',
      type: 'reference',
      to: [{ type: 'residency' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Under Review', value: 'review' },
          { title: 'Accepted', value: 'accepted' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
    }),
    defineField({
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'statement',
      title: 'Artist Statement',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'projectDescription',
      title: 'Project Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social / Web Links',
      description: 'Instagram, website, SoundCloud, etc.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'whyVolavan',
      title: 'Why Volavan',
      description: 'Why does the applicant want to participate in this residency?',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'portfolioUrl',
      title: 'Portfolio URL',
      type: 'url',
    }),
    defineField({
      name: 'cv',
      title: 'CV',
      type: 'file',
    }),
    defineField({
      name: 'portfolioFiles',
      title: 'Portfolio Files',
      type: 'array',
      of: [{ type: 'file' }],
    }),
    defineField({
      name: 'artist',
      title: 'Linked Artist',
      description: 'Link to the artist document created from this application',
      type: 'reference',
      to: [{ type: 'artist' }],
      hidden: ({ document }) => document?.status !== 'accepted',
    }),
    defineField({
      name: 'consentPrivacy',
      title: 'Privacy Policy Consent',
      description: 'Applicant has accepted the privacy policy and personal data processing',
      type: 'boolean',
      validation: (r) => r.required().custom((val) => val === true || 'Privacy consent is required'),
    }),
    defineField({
      name: 'consentMarketing',
      title: 'Marketing Communications Consent',
      description: 'Applicant has agreed to receive news and updates',
      type: 'boolean',
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes (admin only)',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      subtitle: 'status',
      description: 'residency.title',
    },
    prepare({ firstName, lastName, subtitle, description }) {
      return {
        title: `${firstName ?? ''} ${lastName ?? ''}`.trim(),
        subtitle: `${subtitle} · ${description}`,
      }
    },
  },
})
