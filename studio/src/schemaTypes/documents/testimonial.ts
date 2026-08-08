import {CommentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({name: 'quote', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'attributionName', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'attributionRole', type: 'string'}),
    defineField({
      name: 'attributionImage',
      type: 'image',
      options: {hotspot: true, aiAssist: {imageDescriptionField: 'alt'}},
      fields: [{name: 'alt', type: 'string'}],
    }),
    defineField({
      name: 'relatedProgram',
      type: 'reference',
      to: [{type: 'program'}],
    }),
    defineField({name: 'featured', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'attributionName', subtitle: 'quote', media: 'attributionImage'},
  },
})
