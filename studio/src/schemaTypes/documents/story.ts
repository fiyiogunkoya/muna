import {BookIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

export const story = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'structure', title: 'Story structure'},
    {name: 'related', title: 'Related'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'hero', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'hero',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'program',
      type: 'reference',
      to: [{type: 'program'}],
      description: 'Which program this story belongs to.',
      group: 'hero',
    }),
    defineField({name: 'location', type: 'string', group: 'hero'}),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'hero',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      group: 'hero',
      validation: (r) => r.max(220),
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: {hotspot: true, aiAssist: {imageDescriptionField: 'alt'}},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
      group: 'hero',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroQuote',
      type: 'string',
      description: 'Optional kinetic line overlaid on the hero.',
      group: 'hero',
    }),
    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'blockContentTextOnly',
      description: 'The problem this story addresses.',
      group: 'structure',
    }),
    defineField({
      name: 'approach',
      title: 'Approach',
      type: 'blockContentTextOnly',
      group: 'structure',
    }),
    defineField({
      name: 'impact',
      title: 'Impact',
      type: 'blockContentTextOnly',
      group: 'structure',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      description: 'Free-form additional content with images.',
      group: 'structure',
    }),
    defineField({
      name: 'pullQuotes',
      title: 'Pull quotes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pullQuote',
          fields: [
            {name: 'quote', type: 'text', rows: 3, validation: (r) => r.required()},
            {name: 'attribution', type: 'string'},
            {name: 'role', type: 'string'},
          ],
          preview: {select: {title: 'quote', subtitle: 'attribution'}},
        },
      ],
      group: 'structure',
    }),
    defineField({
      name: 'featuredMetrics',
      title: 'Featured metrics',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'impactMetric'}]}],
      group: 'related',
    }),
    defineField({
      name: 'gallery',
      type: 'reference',
      to: [{type: 'gallery'}],
      group: 'related',
    }),
    defineField({
      name: 'relatedStories',
      title: 'Related stories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'story'}]}],
      validation: (r) => r.max(3),
      group: 'related',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Surface on the homepage and Impact page.',
      initialValue: false,
      group: 'hero',
    }),
    defineField({
      name: 'seo',
      type: 'object',
      group: 'seo',
      fields: [
        {name: 'metaTitle', type: 'string'},
        {name: 'metaDescription', type: 'text', rows: 2},
        {
          name: 'ogImage',
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', type: 'string'}],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', location: 'location', date: 'date', media: 'heroImage'},
    prepare({title, location, date, media}) {
      const parts = [location, date && format(parseISO(date), 'LLL d, yyyy')].filter(Boolean)
      return {title, subtitle: parts.join(' · '), media}
    },
  },
})
