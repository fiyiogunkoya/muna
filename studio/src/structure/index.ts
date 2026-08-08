import {
  BarChartIcon,
  BookIcon,
  CogIcon,
  ColorWheelIcon,
  CommentIcon,
  DocumentTextIcon,
  HeartIcon,
  ImageIcon,
  RocketIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

export const SINGLETON_TYPES = ['settings', 'siteTheme', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title('Programs')
        .icon(SparklesIcon)
        .child(S.documentTypeList('program').title('Programs')),
      S.listItem()
        .title('Stories')
        .icon(BookIcon)
        .child(S.documentTypeList('story').title('Stories (case studies)')),
      S.listItem()
        .title('Galleries')
        .icon(ImageIcon)
        .child(S.documentTypeList('gallery').title('Galleries')),
      S.listItem()
        .title('Posts')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('post').title('Posts (blog)')),
      S.listItem()
        .title('Pages')
        .child(S.documentTypeList('page').title('Pages')),
      S.divider(),
      S.listItem()
        .title('Impact')
        .icon(HeartIcon)
        .child(
          S.list()
            .title('Impact')
            .items([
              S.listItem()
                .title('Impact metrics')
                .icon(BarChartIcon)
                .child(S.documentTypeList('impactMetric').title('Impact metrics')),
              S.listItem()
                .title('Testimonials')
                .icon(CommentIcon)
                .child(S.documentTypeList('testimonial').title('Testimonials')),
              S.listItem()
                .title('Partners')
                .icon(UsersIcon)
                .child(S.documentTypeList('partner').title('Partners')),
            ]),
        ),
      S.listItem()
        .title('Campaigns')
        .icon(RocketIcon)
        .child(S.documentTypeList('campaign').title('Campaigns')),
      S.listItem()
        .title('People')
        .icon(UserIcon)
        .child(S.documentTypeList('person').title('People')),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('siteSettings')),
      S.listItem()
        .title('Site Theme')
        .icon(ColorWheelIcon)
        .child(S.document().schemaType('siteTheme').documentId('siteTheme')),
    ])
