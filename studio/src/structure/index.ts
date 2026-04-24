import {CogIcon, ColorWheelIcon, ImageIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

const SINGLETON_TYPES = ['settings', 'siteTheme', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Galleries
      S.listItem()
        .title('Galleries')
        .icon(ImageIcon)
        .child(S.documentTypeList('gallery').title('Galleries')),
      // Stories (posts)
      S.listItem()
        .title('Stories')
        .child(S.documentTypeList('post').title('Stories')),
      // Pages
      S.listItem()
        .title('Pages')
        .child(S.documentTypeList('page').title('Pages')),
      // People
      S.listItem()
        .title('People')
        .child(S.documentTypeList('person').title('People')),
      // Separator
      S.divider(),
      // Site Settings singleton
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
      // Site Theme singleton
      S.listItem()
        .title('Site Theme')
        .child(S.document().schemaType('siteTheme').documentId('siteTheme'))
        .icon(ColorWheelIcon),
    ])
