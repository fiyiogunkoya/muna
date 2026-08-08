import type {Metadata} from 'next'
import Link from 'next/link'
import {clsx} from 'clsx'
import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'
import StoryCard from '@/app/components/sections/StoryCard'
import DonateCallout from '@/app/components/sections/DonateCallout'
import {sanityFetch} from '@/sanity/lib/live'
import {
  allStoriesQuery,
  programSlugsForFilterQuery,
  settingsQuery,
} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Case studies and field reports from across our programs.',
}

type SearchParams = {program?: string}

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const {program: activeProgram} = await searchParams
  const [{data: stories}, {data: programs}, {data: settings}] = await Promise.all([
    sanityFetch({query: allStoriesQuery}),
    sanityFetch({query: programSlugsForFilterQuery}),
    sanityFetch({query: settingsQuery}),
  ])

  const filtered = activeProgram
    ? (stories || []).filter((s) => s.programSlug === activeProgram)
    : stories || []

  return (
    <>
      <section className="pt-28 md:pt-36 pb-12">
        <Container size="wide">
          <SectionHeader
            eyebrow="Field notes"
            heading="Stories"
            lead="Case studies from the communities we work alongside. Every story names the challenge, the approach, and what came of it."
          />
        </Container>
      </section>

      {programs && programs.length > 0 && (
        <section className="pb-10">
          <Container size="wide">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/stories"
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-medium border transition-colors',
                  !activeProgram
                    ? 'bg-ink text-white border-ink'
                    : 'border-ink/15 text-ink/70 hover:bg-ink/5',
                )}
              >
                All
              </Link>
              {programs.map((p) => (
                <Link
                  key={p._id}
                  href={`/stories?program=${p.slug}`}
                  className={clsx(
                    'rounded-full px-4 py-2 text-sm font-medium border transition-colors',
                    activeProgram === p.slug
                      ? 'bg-ink text-white border-ink'
                      : 'border-ink/15 text-ink/70 hover:bg-ink/5',
                  )}
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="pb-section-lg">
        <Container size="wide">
          {filtered.length === 0 ? (
            <p className="text-ink/60">No stories yet for this filter.</p>
          ) : (
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
              {filtered.map((story) => (
                <StaggerItem key={story._id} className="h-full">
                  <StoryCard story={story} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </section>

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Stories like these need backing."
        body="Help us keep producing them."
      />
    </>
  )
}
