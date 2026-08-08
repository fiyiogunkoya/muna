import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const storyCarousel = defineType({
  name: 'storyCarousel',
  title: 'Story carousel',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'stories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'story'}]}],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: 'variant',
      type: 'string',
      options: {
        list: [
          {title: 'Cards', value: 'cards'},
          {title: 'Large feature', value: 'large'},
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
    }),
  ],
  preview: {
    select: {heading: 'heading', count: 'stories.length'},
    prepare({heading, count}) {
      return {title: heading || 'Stories', subtitle: count ? `${count} story(ies)` : 'empty'}
    },
  },
})
