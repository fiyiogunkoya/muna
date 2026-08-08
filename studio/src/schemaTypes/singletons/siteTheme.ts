import {ColorWheelIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const siteTheme = defineType({
  name: 'siteTheme',
  title: 'Site Theme',
  type: 'document',
  icon: ColorWheelIcon,
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
    defineField({
      name: 'colorPrimary',
      title: 'Primary color',
      description: 'Brand action color — donate buttons, links, accents that drive engagement.',
      type: 'color',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'colorAccent',
      title: 'Accent color',
      description: 'Secondary highlight — eyebrows, stat numbers, kinetic accents.',
      type: 'color',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'colorInk',
      title: 'Ink color',
      description: 'Default body text color on light surfaces.',
      type: 'color',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'colorSurface',
      title: 'Surface color',
      description: 'Primary page background.',
      type: 'color',
      options: {disableAlpha: true},
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
