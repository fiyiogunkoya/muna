import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {gallery} from './documents/gallery'
import {program} from './documents/program'
import {story} from './documents/story'
import {impactMetric} from './documents/impactMetric'
import {testimonial} from './documents/testimonial'
import {partner} from './documents/partner'
import {campaign} from './documents/campaign'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {programGrid} from './objects/programGrid'
import {impactMetricsRow} from './objects/impactMetricsRow'
import {storyCarousel} from './objects/storyCarousel'
import {partnerLogos} from './objects/partnerLogos'
import {testimonialBlock} from './objects/testimonialBlock'
import {donateBanner} from './objects/donateBanner'
import {settings} from './singletons/settings'
import {siteTheme} from './singletons/siteTheme'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  siteTheme,
  // Documents
  page,
  post,
  person,
  gallery,
  program,
  story,
  impactMetric,
  testimonial,
  partner,
  campaign,
  // Objects
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
  // Page-builder block objects
  programGrid,
  impactMetricsRow,
  storyCarousel,
  partnerLogos,
  testimonialBlock,
  donateBanner,
]
