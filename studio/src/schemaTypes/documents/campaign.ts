import {RocketIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const campaign = defineType({
  name: 'campaign',
  title: 'Campaign',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({name: 'tagline', type: 'string'}),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: {hotspot: true, aiAssist: {imageDescriptionField: 'alt'}},
      fields: [{name: 'alt', type: 'string'}],
    }),
    defineField({name: 'startDate', type: 'date'}),
    defineField({name: 'endDate', type: 'date'}),
    defineField({
      name: 'goalAmount',
      type: 'number',
      description: 'Display only — informational target. No payments are processed.',
    }),
    defineField({
      name: 'currentAmount',
      type: 'number',
      description: 'Display only — update manually.',
    }),
    defineField({
      name: 'donateUrl',
      type: 'url',
      description: 'Optional campaign-specific donate link. Falls back to Site Settings.',
    }),
    defineField({name: 'body', type: 'blockContent'}),
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Surface on the homepage and get-involved page.',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      type: 'boolean',
      description: 'Show as an active campaign.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'tagline', media: 'heroImage'},
  },
})
