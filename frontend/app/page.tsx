import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import HomeHero from '@/app/components/sections/HomeHero'
import ImpactStatsRow from '@/app/components/sections/ImpactStatsRow'
import FeaturedPrograms from '@/app/components/sections/FeaturedPrograms'
import FeaturedStoryHero from '@/app/components/sections/FeaturedStoryHero'
import StoryStrip from '@/app/components/sections/StoryStrip'
import TestimonialSpotlight from '@/app/components/sections/TestimonialSpotlight'
import PartnersStrip from '@/app/components/sections/PartnersStrip'
import DonateCallout from '@/app/components/sections/DonateCallout'
import {homepageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function HomePage() {
  const {data} = await sanityFetch({query: homepageQuery})
  const settings = data?.settings
  const programs = data?.featuredPrograms || []
  const featuredStory = data?.featuredStory
  const moreStories = data?.moreStories || []
  const metrics = data?.metrics || []
  const featuredTestimonial = data?.featuredTestimonial
  const partners = data?.partners || []

  return (
    <>
      <HomeHero
        foundationName={settings?.foundationName}
        tagline={settings?.tagline}
        heroQuote={settings?.heroQuote}
        heroImage={settings?.heroImage}
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
      />

      {metrics.length > 0 && (
        <section className="py-section-md md:py-section-lg bg-surface border-b border-gray-100">
          <Container size="wide">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-end mb-14">
              <div>
                <Eyebrow tone="primary">Impact at a glance</Eyebrow>
                <h2 className="mt-4 font-[var(--font-heading,inherit)] text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                  Numbers that move with people.
                </h2>
              </div>
              <p className="text-lg text-ink/70 leading-relaxed">
                Each of these stats is anchored to a program, a community, and a year of work. We
                publish what we’re proud of and what we’re still learning.
              </p>
            </div>
            <ImpactStatsRow metrics={metrics} />
          </Container>
        </section>
      )}

      {programs.length > 0 && (
        <FeaturedPrograms
          programs={programs}
          eyebrow="What we do"
          heading="Programs that meet young people where they are."
          lead="Book clubs, scholarships, community libraries, and the facilitators who make them run."
        />
      )}

      {featuredStory && (
        <FeaturedStoryHero
          story={featuredStory}
          eyebrow="Featured story"
          heading="The work, in someone’s words."
        />
      )}

      {moreStories.length > 0 && (
        <StoryStrip
          stories={moreStories}
          eyebrow="More stories"
          heading="Read the latest from the field."
        />
      )}

      {featuredTestimonial && <TestimonialSpotlight testimonial={featuredTestimonial} tone="ink" />}

      {partners.length > 0 && (
        <PartnersStrip partners={partners} eyebrow="With" heading="We do this with others." />
      )}

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Childhood doesn’t wait."
        body="Your gift funds programs that help young people thrive — today."
      />
    </>
  )
}
