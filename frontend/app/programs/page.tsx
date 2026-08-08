import type {Metadata} from 'next'
import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import Eyebrow from '@/app/components/ui/Eyebrow'
import Card from '@/app/components/ui/Card'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'
import HoverLift from '@/app/components/motion/HoverLift'
import FadeIn from '@/app/components/motion/FadeIn'
import ProgramCard from '@/app/components/sections/ProgramCard'
import DonateCallout from '@/app/components/sections/DonateCallout'
import {sanityFetch} from '@/sanity/lib/live'
import {allProgramsQuery, settingsQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'MUNA programs develop the 4C’s + Identity — critical thinking, confidence, communication, curiosity, and a grounded sense of self.',
}

// TODO: promote the 4C's + Identity framework to a CMS-editable `pedagogy` singleton
// once editors need to update this copy.
const PILLARS = [
  {
    letter: 'C',
    name: 'Critical Thinking',
    body: 'Question assumptions, analyse ideas, form independent judgments.',
  },
  {
    letter: 'C',
    name: 'Confidence',
    body: 'Speak up, lead, and take initiative.',
  },
  {
    letter: 'C',
    name: 'Communication',
    body: 'Express ideas clearly and persuasively.',
  },
  {
    letter: 'C',
    name: 'Curiosity',
    body: 'Pursue new questions, interests, and lifelong learning.',
  },
  {
    letter: 'I',
    name: 'Identity',
    body: 'Build a grounded sense of self, values, and possibility.',
  },
]

export default async function ProgramsPage() {
  const [{data: programs}, {data: settings}] = await Promise.all([
    sanityFetch({query: allProgramsQuery}),
    sanityFetch({query: settingsQuery}),
  ])

  return (
    <>
      <section className="pt-28 md:pt-36 pb-section-md">
        <Container size="wide">
          <SectionHeader
            eyebrow="What we do"
            heading="Programs"
            lead="Every MUNA program is intentionally designed to develop the same five things — and to meet young people where they already are."
          />
        </Container>
      </section>

      <section id="approach" className="pb-section-md">
        <Container size="wide">
          <FadeIn>
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16 mb-12 lg:mb-16">
              <div>
                <Eyebrow tone="primary">Our approach</Eyebrow>
                <h2 className="mt-4 font-[var(--font-heading,inherit)] text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                  The 4C’s + Identity.
                </h2>
              </div>
              <div className="space-y-5 text-lg md:text-xl text-ink/75 leading-relaxed max-w-2xl">
                <p>
                  At MUNA, learning and growth are one and the same. Education should shape not only
                  what students know, but how they think, speak, and understand their place in the
                  world.
                </p>
                <p>
                  These skills aren’t taught in isolation; they’re cultivated through hands-on
                  experience, guided reflection, and creative expression — structured learning paired
                  with the space to practise, reflect, and own the growth.
                </p>
              </div>
            </div>
          </FadeIn>

          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5" gap={0.08}>
            {PILLARS.map((pillar, i) => (
              <StaggerItem key={i} className="h-full">
                <HoverLift className="h-full">
                  <Card padding="lg" className="h-full flex flex-col border-gray-100">
                    <span className="font-[var(--font-heading,inherit)] text-6xl leading-none text-primary">
                      {pillar.letter}
                    </span>
                    <h3 className="mt-6 font-[var(--font-heading,inherit)] text-2xl tracking-tight">
                      {pillar.name}
                    </h3>
                    <p className="mt-3 text-ink/65 leading-relaxed text-base">{pillar.body}</p>
                  </Card>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="pb-section-lg pt-section-sm border-t border-gray-100">
        <Container size="wide">
          <div className="mb-12">
            <Eyebrow tone="primary">The work</Eyebrow>
            <h2 className="mt-3 font-[var(--font-heading,inherit)] text-4xl md:text-5xl tracking-tight">
              Nine programs, one curriculum of growth.
            </h2>
          </div>
          {programs?.length ? (
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.1}>
              {programs.map((program) => (
                <StaggerItem key={program._id} className="h-full">
                  <ProgramCard program={program} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="text-ink/60">No programs yet. Check back soon.</p>
          )}
        </Container>
      </section>

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Build a program with us."
        body="Your contribution funds the next cohort — and the facilitators who run it."
      />
    </>
  )
}
