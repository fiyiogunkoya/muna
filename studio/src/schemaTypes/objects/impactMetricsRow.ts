import {BarChartIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const impactMetricsRow = defineType({
  name: 'impactMetricsRow',
  title: 'Impact metrics row',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'metrics',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'impactMetric'}]}],
      validation: (r) => r.min(2).max(6),
    }),
  ],
  preview: {
    select: {heading: 'heading', count: 'metrics.length'},
    prepare({heading, count}) {
      return {title: heading || 'Impact metrics', subtitle: count ? `${count} metric(s)` : 'empty'}
    },
  },
})
