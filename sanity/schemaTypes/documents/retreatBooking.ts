import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const retreatBooking = defineType({
  name: 'retreatBooking',
  title: 'Retreat Booking',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'residency',
      title: 'Retreat',
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
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Waitlist', value: 'waitlist' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'confirmed',
      validation: (r) => r.required(),
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
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      description: 'Notes from the participant',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'consentPrivacy',
      title: 'Privacy Policy Consent',
      description: 'Participant has accepted the privacy policy and personal data processing',
      type: 'boolean',
      validation: (r) => r.required().custom((val) => val === true || 'Privacy consent is required'),
    }),
    defineField({
      name: 'consentMarketing',
      title: 'Marketing Communications Consent',
      description: 'Participant has agreed to receive news and updates',
      type: 'boolean',
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes',
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
      const labels: Record<string, string> = {
        confirmed: 'Confirmed',
        waitlist: 'Waitlist',
        cancelled: 'Cancelled',
      }
      return {
        title: `${firstName ?? ''} ${lastName ?? ''}`.trim(),
        subtitle: `${labels[subtitle] ?? subtitle} · ${description}`,
      }
    },
  },
})
