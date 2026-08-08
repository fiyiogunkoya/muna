import React from 'react'

import Cta from '@/app/components/Cta'
import Info from '@/app/components/InfoSection'
import ProgramGridBlock from '@/app/components/blocks/ProgramGridBlock'
import ImpactMetricsRowBlock from '@/app/components/blocks/ImpactMetricsRowBlock'
import StoryCarouselBlock from '@/app/components/blocks/StoryCarouselBlock'
import PartnerLogosBlock from '@/app/components/blocks/PartnerLogosBlock'
import TestimonialBlock from '@/app/components/blocks/TestimonialBlock'
import DonateBannerBlock from '@/app/components/blocks/DonateBannerBlock'
import {dataAttr} from '@/sanity/lib/utils'
import {PageBuilderSection} from '@/sanity/lib/types'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

// Blocks accept varying prop shapes; we look up by `_type` at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Blocks: Record<string, React.FC<any>> = {
  callToAction: Cta,
  infoSection: Info,
  programGrid: ProgramGridBlock,
  impactMetricsRow: ImpactMetricsRowBlock,
  storyCarousel: StoryCarouselBlock,
  partnerLogos: PartnerLogosBlock,
  testimonialBlock: TestimonialBlock,
  donateBanner: DonateBannerBlock,
}

export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  const Component = Blocks[block._type]
  if (Component) {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        <Component block={block} index={index} pageId={pageId} pageType={pageType} />
      </div>
    )
  }
  return (
    <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
      A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
    </div>
  )
}
