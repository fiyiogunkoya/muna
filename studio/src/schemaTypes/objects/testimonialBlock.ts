import {CommentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const testimonialBlock = defineType({
  name: 'testimonialBlock',
  title: 'Testimonial block',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'testimonials',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'testimonial'}]}],
    }),
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Single', value: 'single'},
          {title: 'Carousel', value: 'carousel'},
        ],
        layout: 'radio',
      },
      initialValue: 'single',
    }),
  ],
  preview: {
    select: {heading: 'heading', count: 'testimonials.length'},
    prepare({heading, count}) {
      return {title: heading || 'Testimonial', subtitle: count ? `${count} item(s)` : 'empty'}
    },
  },
})
