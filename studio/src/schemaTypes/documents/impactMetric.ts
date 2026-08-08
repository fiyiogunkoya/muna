import {BarChartIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {PROGRAM_ICONS} from './program'

export const IMPACT_CATEGORIES = [
  {title: 'Education', value: 'education'},
  {title: 'Health', value: 'health'},
  {title: 'Community', value: 'community'},
  {title: 'Food security', value: 'food-security'},
  {title: 'Economic', value: 'economic'},
  {title: 'Other', value: 'other'},
] as const

export const impactMetric = defineType({
  name: 'impactMetric',
  title: 'Impact metric',
  type: 'document',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      description: 'e.g. "Children fed", "Schools built".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'value',
      type: 'string',
      description: 'Display string. Supports formatting like 12,400 or 1.2M.',
      validation: (r) => r.required(),
    }),
    defineField({name: 'prefix', type: 'string', description: 'Optional prefix like "$".'}),
    defineField({name: 'suffix', type: 'string', description: 'Optional suffix like "+" or "%".'}),
    defineField({name: 'description', type: 'text', rows: 2}),
    defineField({
      name: 'icon',
      type: 'string',
      options: {list: PROGRAM_ICONS.map((v) => ({title: v, value: v}))},
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {list: IMPACT_CATEGORIES as unknown as {title: string; value: string}[]},
      initialValue: 'other',
    }),
    defineField({
      name: 'asOfDate',
      title: 'As of',
      type: 'date',
      description: 'Optional reporting date for transparency.',
    }),
    defineField({name: 'source', type: 'string', description: 'Optional citation.'}),
  ],
  preview: {
    select: {label: 'label', value: 'value', prefix: 'prefix', suffix: 'suffix', category: 'category'},
    prepare({label, value, prefix, suffix, category}) {
      return {
        title: `${prefix || ''}${value || ''}${suffix || ''} — ${label || 'Metric'}`,
        subtitle: category,
      }
    },
  },
})
