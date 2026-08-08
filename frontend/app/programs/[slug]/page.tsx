import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {PortableText, type PortableTextBlock} from 'next-sanity'
import {ArrowRight, ImageIcon} from 'lucide-react'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import ProgramHero from '@/app/components/sections/ProgramHero'
import ImpactStatsRow from '@/app/components/sections/ImpactStatsRow'
import StoryStrip from '@/app/components/sections/StoryStrip'
import DonateCallout from '@/app/components/sections/DonateCallout'
import FadeIn from '@/app/components/motion/FadeIn'
import SanityImage from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import {
  programBySlugQuery,
  programSlugsQuery,
  settingsQuery,
} from '@/sanity/lib/queries'

type RouteProps = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: programSlugsQuery,
    perspective: 'published',
    stega: false,
  })
  return (data || []).filter((p) => p.slug).map((p) => ({slug: p.slug as string}))
}

export async function generateMetadata({params}: RouteProps): Promise<Metadata> {
  const {slug} = await params
  const {data: program} = await sanityFetch({
    query: programBySlugQuery,
    params: {slug},
    stega: false,
  })
  if (!program) return {}
  return {
    title: program.seo?.metaTitle || program.title || 'Program',
    description: program.seo?.metaDescription || program.tagline || program.summary || undefined,
  }
}

export default async function ProgramPage({params}: RouteProps) {
  const {slug} = await params
  const [{data: program}, {data: settings}] = await Promise.all([
    sanityFetch({query: programBySlugQuery, params: {slug}}),
    sanityFetch({query: settingsQuery}),
  ])
  if (!program) notFound()

  const ref = program.relatedGallery?.coverImage?.asset?._id

  return (
    <>
      <ProgramHero
        title={program.title}
        tagline={program.tagline}
        summary={program.summary}
        icon={program.icon}
        coverImage={program.coverImage}
      />

      {program.body && program.body.length > 0 && (
        <section className="py-section-md md:py-section-lg">
          <Container size="default">
            <FadeIn className="prose prose-lg prose-stone max-w-none prose-headings:font-[var(--font-heading,inherit)] prose-headings:tracking-tight prose-p:text-ink/80">
              <PortableText value={program.body as unknown as PortableTextBlock[]} />
            </FadeIn>
          </Container>
        </section>
      )}

      {program.impactMetrics && program.impactMetrics.length > 0 && (
        <section className="py-section-md bg-surface border-y border-gray-100">
          <Container size="wide">
            <Eyebrow tone="primary">Outcomes</Eyebrow>
            <h2 className="mt-3 mb-12 font-[var(--font-heading,inherit)] text-4xl md:text-5xl tracking-tight">
              What this program has produced.
            </h2>
            <ImpactStatsRow metrics={program.impactMetrics} />
          </Container>
        </section>
      )}

      {program.relatedStories && program.relatedStories.length > 0 && (
        <StoryStrip
          stories={program.relatedStories}
          eyebrow="Stories from this program"
          heading="See it in practice."
        />
      )}

      {program.relatedGallery && (
        <section className="py-section-md">
          <Container size="wide">
            <Link
              href={`/gallery/${program.relatedGallery.slug}`}
              className="group block rounded-3xl overflow-hidden bg-ink text-white"
            >
              <div className="grid lg:grid-cols-[1.4fr_1fr] items-stretch">
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-gray-800">
                  {ref ? (
                    <SanityImage
                      id={ref}
                      width={1280}
                      alt={program.relatedGallery.title || ''}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white/30">
                      <ImageIcon className="h-12 w-12" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center px-8 py-10 lg:py-14">
                  <Eyebrow tone="white">Gallery</Eyebrow>
                  <h3 className="mt-4 font-[var(--font-heading,inherit)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
                    {program.relatedGallery.title}
                  </h3>
                  <span className="mt-6 inline-flex items-center gap-2 text-base font-medium text-accent">
                    See the photos
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Help us scale this."
        body="Every gift expands the reach of this program."
      />
    </>
  )
}
