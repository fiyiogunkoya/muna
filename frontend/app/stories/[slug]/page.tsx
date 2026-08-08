import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {PortableText, type PortableTextBlock} from 'next-sanity'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import PullQuote from '@/app/components/ui/PullQuote'
import StoryHero from '@/app/components/sections/StoryHero'
import StoryStructuredSection from '@/app/components/sections/StoryStructuredSection'
import ImpactStatsRow from '@/app/components/sections/ImpactStatsRow'
import StoryStrip from '@/app/components/sections/StoryStrip'
import DonateCallout from '@/app/components/sections/DonateCallout'
import ShareButton from '@/app/components/sections/ShareButton'
import FadeIn from '@/app/components/motion/FadeIn'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery, storyBySlugQuery, storySlugsQuery} from '@/sanity/lib/queries'

type RouteProps = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: storySlugsQuery,
    perspective: 'published',
    stega: false,
  })
  return (data || []).filter((s) => s.slug).map((s) => ({slug: s.slug as string}))
}

export async function generateMetadata({params}: RouteProps): Promise<Metadata> {
  const {slug} = await params
  const {data: story} = await sanityFetch({
    query: storyBySlugQuery,
    params: {slug},
    stega: false,
  })
  if (!story) return {}
  return {
    title: story.seo?.metaTitle || story.title || 'Story',
    description: story.seo?.metaDescription || story.excerpt || undefined,
  }
}

export default async function StoryPage({params}: RouteProps) {
  const {slug} = await params
  const [{data: story}, {data: settings}] = await Promise.all([
    sanityFetch({query: storyBySlugQuery, params: {slug}}),
    sanityFetch({query: settingsQuery}),
  ])
  if (!story) notFound()

  return (
    <>
      <StoryHero
        title={story.title}
        excerpt={story.excerpt}
        location={story.location}
        date={story.date}
        heroQuote={story.heroQuote}
        programTitle={story.program?.title}
        heroImage={story.heroImage}
      />

      <StoryStructuredSection
        challenge={story.challenge as unknown as PortableTextBlock[]}
        approach={story.approach as unknown as PortableTextBlock[]}
        impact={story.impact as unknown as PortableTextBlock[]}
      />

      {story.body && story.body.length > 0 && (
        <section className="py-section-md md:py-section-lg">
          <Container size="default">
            <FadeIn className="prose prose-lg prose-stone max-w-none prose-headings:font-[var(--font-heading,inherit)] prose-headings:tracking-tight prose-p:text-ink/80">
              <PortableText value={story.body as unknown as PortableTextBlock[]} />
            </FadeIn>
          </Container>
        </section>
      )}

      {story.pullQuotes && story.pullQuotes.length > 0 && (
        <section className="py-section-md">
          <Container size="default">
            <div className="flex flex-col gap-12">
              {story.pullQuotes.map((q) => (
                <FadeIn key={q._key}>
                  <PullQuote
                    quote={q.quote || ''}
                    attribution={q.attribution || undefined}
                    role={q.role || undefined}
                  />
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {story.featuredMetrics && story.featuredMetrics.length > 0 && (
        <section className="py-section-md bg-surface border-y border-gray-100">
          <Container size="wide">
            <Eyebrow tone="primary">Outcomes</Eyebrow>
            <h2 className="mt-3 mb-12 font-[var(--font-heading,inherit)] text-4xl md:text-5xl tracking-tight">
              By the numbers.
            </h2>
            <ImpactStatsRow metrics={story.featuredMetrics} />
          </Container>
        </section>
      )}

      {story.gallery && story.gallery.images && story.gallery.images.length > 0 && (
        <section className="py-section-md">
          <Container size="wide">
            <div className="flex items-end justify-between mb-8">
              <Eyebrow tone="primary">From the field</Eyebrow>
              <Link
                href={`/gallery/${story.gallery.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                See full gallery →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {story.gallery.images.map((img) => (
                <Link
                  key={img._key}
                  href={`/gallery/${story.gallery!.slug}`}
                  className="block aspect-square overflow-hidden rounded-xl bg-gray-100"
                >
                  {img.src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${img.src}?w=640&h=640&fit=crop&auto=format`}
                      alt={img.alt || img.caption || ''}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  )}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-section-sm">
        <Container size="default">
          <div className="flex items-center justify-between gap-4 border-t border-ink/10 pt-8">
            <div className="text-sm text-ink/60">Share this story</div>
            <ShareButton title={story.title || undefined} />
          </div>
        </Container>
      </section>

      {story.relatedStories && story.relatedStories.length > 0 && (
        <StoryStrip
          stories={story.relatedStories}
          eyebrow="Keep reading"
          heading="More from the field."
        />
      )}

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Stand with the communities we work alongside."
        body="Your support keeps the work — and the storytelling — going."
      />
    </>
  )
}
