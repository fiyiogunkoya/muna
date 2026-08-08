import type {Metadata} from 'next'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import SectionHeader from '@/app/components/ui/SectionHeader'
import ImpactStatsRow from '@/app/components/sections/ImpactStatsRow'
import StoryStrip from '@/app/components/sections/StoryStrip'
import TestimonialCarousel from '@/app/components/sections/TestimonialCarousel'
import DonateCallout from '@/app/components/sections/DonateCallout'
import {sanityFetch} from '@/sanity/lib/live'
import {impactPageQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Impact',
  description: 'The outcomes of our programs, in numbers and in stories.',
}

const CATEGORY_LABELS: Record<string, string> = {
  education: 'Education',
  health: 'Health',
  community: 'Community',
  'food-security': 'Food security',
  economic: 'Economic',
  other: 'Other',
}

export default async function ImpactPage() {
  const {data} = await sanityFetch({query: impactPageQuery})
  const metrics = data?.metrics || []
  const stories = data?.stories || []
  const testimonials = data?.testimonials || []
  const settings = data?.settings

  // Group metrics by category, preserving order from the query
  const grouped = metrics.reduce<Record<string, typeof metrics>>((acc, m) => {
    const key = m.category || 'other'
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  return (
    <>
      <section className="pt-28 md:pt-36 pb-12">
        <Container size="wide">
          <SectionHeader
            eyebrow="Impact"
            heading="What the work looks like in the world."
            lead="We measure what changes and we tell you about it — even when it’s incomplete."
          />
        </Container>
      </section>

      {Object.keys(grouped).length > 0 && (
        <section className="pb-section-md">
          <Container size="wide">
            <div className="flex flex-col gap-16">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <Eyebrow tone="primary">{CATEGORY_LABELS[category] || category}</Eyebrow>
                  <div className="mt-8">
                    <ImpactStatsRow metrics={items} />
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {stories.length > 0 && (
        <StoryStrip
          stories={stories}
          eyebrow="Stories"
          heading="The numbers become people."
        />
      )}

      {testimonials.length > 0 && <TestimonialCarousel testimonials={testimonials} />}

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Make the next number happen."
      />
    </>
  )
}
