import {HeartFilledIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const donateBanner = defineType({
  name: 'donateBanner',
  title: 'Donate banner',
  type: 'object',
  icon: HeartFilledIcon,
  fields: [
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'body', type: 'blockContentTextOnly'}),
    defineField({name: 'buttonText', type: 'string', initialValue: 'Donate'}),
    defineField({
      name: 'useSettingsUrl',
      type: 'boolean',
      description: 'Use the donate URL configured in Site Settings.',
      initialValue: true,
    }),
    defineField({
      name: 'overrideUrl',
      type: 'url',
      description: 'Optional override link.',
      hidden: ({parent}) => Boolean(parent?.useSettingsUrl),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string'}],
    }),
    defineField({
      name: 'tone',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
          {title: 'Accent', value: 'accent'},
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: {title: 'heading', tone: 'tone'},
    prepare({title, tone}) {
      return {title: title || 'Donate banner', subtitle: `tone: ${tone || 'dark'}`}
    },
  },
})
