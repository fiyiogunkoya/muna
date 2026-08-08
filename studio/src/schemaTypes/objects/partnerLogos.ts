import {UsersIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const partnerLogos = defineType({
  name: 'partnerLogos',
  title: 'Partner logos',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'partners',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'partner'}]}],
    }),
    defineField({
      name: 'tiersFilter',
      title: 'Filter by tier(s)',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Founding', value: 'founding'},
          {title: 'Strategic', value: 'strategic'},
          {title: 'Program', value: 'program'},
          {title: 'Media', value: 'media'},
        ],
      },
    }),
  ],
  preview: {
    select: {heading: 'heading', count: 'partners.length'},
    prepare({heading, count}) {
      return {title: heading || 'Partners', subtitle: count ? `${count} partner(s)` : 'empty'}
    },
  },
})
