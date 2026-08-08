import {SparklesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const programGrid = defineType({
  name: 'programGrid',
  title: 'Program grid',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'programs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'program'}]}],
    }),
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'List', value: 'list'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: {heading: 'heading', count: 'programs.length'},
    prepare({heading, count}) {
      return {title: heading || 'Program grid', subtitle: count ? `${count} program(s)` : 'empty'}
    },
  },
})
