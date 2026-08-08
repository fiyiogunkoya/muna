import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import type {Person} from '../../../sanity.types'

/**
 * Person schema.  Define and edit the fields for the 'person' content type.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const person = defineType({
  name: 'person',
  title: 'Person',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Job title or role (e.g. "Executive Director").',
    }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'picture',
      title: 'Picture',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
            return rule.custom((alt, context) => {
              const document = context.document as Person
              if (document?.picture?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      validation: (rule) => rule.required(),
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'role',
      picture: 'picture',
    },
    prepare({firstName, lastName, role, picture}) {
      return {
        title: `${firstName} ${lastName}`,
        subtitle: role || 'Person',
        media: picture,
      }
    },
  },
})
