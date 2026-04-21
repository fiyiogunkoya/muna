import {PaintBucketIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const siteTheme = defineType({
  name: 'siteTheme',
  title: 'Site Theme',
  type: 'document',
  icon: PaintBucketIcon,
  fields: [
    defineField({
      name: 'headingFont',
      title: 'Heading Font',
      type: 'string',
      description: 'Choose the font used for all headings across the website',
      options: {
        list: [
          {title: 'Playfair Display', value: 'Playfair Display'},
          {title: 'Oswald', value: 'Oswald'},
          {title: 'Bebas Neue', value: 'Bebas Neue'},
          {title: 'Montserrat', value: 'Montserrat'},
          {title: 'Libre Baskerville', value: 'Libre Baskerville'},
        ],
        layout: 'radio',
      },
      initialValue: 'Montserrat',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Theme',
      }
    },
  },
})
