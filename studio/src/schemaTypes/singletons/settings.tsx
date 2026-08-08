import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import type {Link, Settings} from '../../../sanity.types'

import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'foundation', title: 'Foundation'},
    {name: 'homepage', title: 'Homepage'},
    {name: 'engagement', title: 'Engagement'},
  ],
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your blog.',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'description',
      description: 'Used on the Homepage',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      group: 'general',
      of: [
        // Define a minified block content field for the description. https://www.sanity.io/docs/block-content
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'linkType',
                    title: 'Link Type',
                    type: 'string',
                    initialValue: 'href',
                    options: {
                      list: [
                        {title: 'URL', value: 'href'},
                        {title: 'Page', value: 'page'},
                        {title: 'Post', value: 'post'},
                      ],
                      layout: 'radio',
                    },
                  }),
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
                    validation: (Rule) =>
                      Rule.custom((value, context) => {
                        const parent = context.parent as Link
                        if (parent?.linkType === 'href' && !value) {
                          return 'URL is required when Link Type is URL'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'page',
                    title: 'Page',
                    type: 'reference',
                    to: [{type: 'page'}],
                    hidden: ({parent}) => parent?.linkType !== 'page',
                    validation: (Rule) =>
                      Rule.custom((value, context) => {
                        const parent = context.parent as Link
                        if (parent?.linkType === 'page' && !value) {
                          return 'Page reference is required when Link Type is Page'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'post',
                    title: 'Post',
                    type: 'reference',
                    to: [{type: 'post'}],
                    hidden: ({parent}) => parent?.linkType !== 'post',
                    validation: (Rule) =>
                      Rule.custom((value, context) => {
                        const parent = context.parent as Link
                        if (parent?.linkType === 'post' && !value) {
                          return 'Post reference is required when Link Type is Post'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'general',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              const document = context.document as Settings
              if (document?.ogImage?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      name: 'foundationName',
      title: 'Foundation Name',
      type: 'string',
      description: 'Displayed in the header, hero, and footer',
      group: 'foundation',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Mission one-liner shown in the hero section',
      group: 'foundation',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Displayed on the contact page',
      group: 'foundation',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Links to social media profiles',
      group: 'foundation',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Twitter / X', value: 'twitter'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'donateUrl',
      title: 'Donate URL',
      type: 'url',
      description: 'Link to your external donation platform (GoFundMe, PayPal, etc.)',
      group: 'foundation',
    }),
    defineField({
      name: 'donateButtonText',
      title: 'Donate Button Text',
      type: 'string',
      description: 'Text for the donate button',
      initialValue: 'Donate',
      group: 'foundation',
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission statement',
      type: 'blockContentTextOnly',
      description: 'Used on the About page.',
      group: 'foundation',
    }),
    defineField({
      name: 'visionStatement',
      title: 'Vision statement',
      type: 'blockContentTextOnly',
      description: 'Used on the About page beside the mission.',
      group: 'foundation',
    }),
    defineField({
      name: 'philosophy',
      title: 'Philosophy beliefs',
      description: 'Short belief statements rendered as a numbered list on the About page.',
      type: 'array',
      of: [{type: 'string'}],
      group: 'foundation',
    }),
    defineField({
      name: 'differentiators',
      title: 'What makes us different',
      description: 'Short statements rendered as a card grid on the About page.',
      type: 'array',
      of: [{type: 'string'}],
      group: 'foundation',
    }),
    defineField({
      name: 'heroImage',
      title: 'Homepage hero image',
      type: 'image',
      options: {hotspot: true, aiAssist: {imageDescriptionField: 'alt'}},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
      group: 'homepage',
    }),
    defineField({
      name: 'heroQuote',
      title: 'Homepage hero quote',
      type: 'string',
      description: 'Optional kinetic line over the homepage hero.',
      group: 'homepage',
    }),
    defineField({
      name: 'stickyDonateEnabled',
      title: 'Show sticky donate bar',
      type: 'boolean',
      description: 'Display a persistent donate bar after the hero.',
      initialValue: true,
      group: 'engagement',
    }),
    defineField({
      name: 'stickyDonateMessage',
      title: 'Sticky donate message',
      type: 'string',
      initialValue: 'Support our work.',
      hidden: ({parent}) => !parent?.stickyDonateEnabled,
      group: 'engagement',
    }),
    defineField({
      name: 'newsletterEnabled',
      title: 'Enable newsletter CTA',
      type: 'boolean',
      initialValue: false,
      group: 'engagement',
    }),
    defineField({
      name: 'newsletterUrl',
      title: 'Newsletter URL',
      type: 'url',
      description: 'Link to your hosted form (Mailchimp, Substack, etc.).',
      hidden: ({parent}) => !parent?.newsletterEnabled,
      group: 'engagement',
    }),
    defineField({
      name: 'newsletterCtaText',
      title: 'Newsletter CTA text',
      type: 'string',
      initialValue: 'Get our monthly stories',
      hidden: ({parent}) => !parent?.newsletterEnabled,
      group: 'engagement',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
