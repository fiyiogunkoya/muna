import {UsersIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const PARTNER_TIERS = [
  {title: 'Founding', value: 'founding'},
  {title: 'Strategic', value: 'strategic'},
  {title: 'Program', value: 'program'},
  {title: 'Media', value: 'media'},
] as const

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'logo',
      type: 'image',
      description: 'Use SVG or a transparent PNG for best results.',
      fields: [{name: 'alt', type: 'string'}],
    }),
    defineField({name: 'url', type: 'url'}),
    defineField({
      name: 'tier',
      type: 'string',
      options: {list: PARTNER_TIERS as unknown as {title: string; value: string}[]},
      initialValue: 'program',
    }),
    defineField({name: 'order', type: 'number'}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'tier', media: 'logo'},
  },
})
