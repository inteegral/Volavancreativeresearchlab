import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'nav',
      title: 'Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'href', type: 'string', title: 'Path (e.g. /about)' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        { name: 'tagline', type: 'string', title: 'Tagline' },
        { name: 'email', type: 'string', title: 'Contact Email' },
        { name: 'instagram', type: 'url', title: 'Instagram URL' },
        { name: 'facebook', type: 'url', title: 'Facebook URL' },
      ],
    }),
    defineField({
      name: 'mediaKitPassword',
      title: 'Media Kit Password',
      description: 'Password to protect access to the media kit',
      type: 'string',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Default Meta Title' },
        { name: 'description', type: 'text', title: 'Default Meta Description', rows: 2 },
        { name: 'ogImage', type: 'image', title: 'Default OG Image' },
      ],
    }),
  ],
  preview: { select: { title: 'siteName' } },
})
