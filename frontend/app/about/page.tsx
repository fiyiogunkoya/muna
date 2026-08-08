import type {Metadata} from 'next'
import Link from 'next/link'
import {PortableText, type PortableTextBlock} from 'next-sanity'
import {ArrowRight} from 'lucide-react'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import SanityImage from '@/app/components/SanityImage'
import FadeIn from '@/app/components/motion/FadeIn'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'
import HoverLift from '@/app/components/motion/HoverLift'
import Parallax from '@/app/components/motion/Parallax'
import TeamGrid from '@/app/components/sections/TeamGrid'
import PartnersStrip from '@/app/components/sections/PartnersStrip'
import DonateCallout from '@/app/components/sections/DonateCallout'
import {sanityFetch} from '@/sanity/lib/live'
import {aboutPageQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Moving Up New Africa is a youth-focused nonprofit closing gaps in Africa’s education system through creative learning and real-world exposure.',
}

function splitPhrase(phrase: string): {head: string; tail: string | null} {
  const idx = phrase.lastIndexOf(', not ')
  if (idx === -1) return {head: phrase, tail: null}
  return {head: phrase.slice(0, idx).trim(), tail: phrase.slice(idx + 2).trim()}
}

export default async function AboutPage() {
  const {data} = await sanityFetch({query: aboutPageQuery})
  const settings = data?.settings
  const team = data?.team || []
  const partners = data?.partners || []
  const ref = settings?.heroImage?.asset?._id
  const philosophy = settings?.philosophy || []
  const differentiators = settings?.differentiators || []

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white -mt-24">
        <div className="absolute inset-0">
          {ref ? (
            <Parallax speed={0.18} className="absolute inset-0">
              <SanityImage
                id={ref}
                width={2400}
                alt={settings?.heroImage?.alt || settings?.foundationName || ''}
                className="h-[120%] w-full object-cover"
              />
            </Parallax>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ink to-primary/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/30" />
        </div>
        <div className="relative">
          <Container size="wide">
            <FadeIn className="pt-40 pb-20 md:pb-28 max-w-4xl">
              <Eyebrow tone="white">Who we are</Eyebrow>
              <h1 className="mt-6 font-[var(--font-heading,inherit)] text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
                {settings?.foundationName || 'Moving Up New Africa'}
              </h1>
              {settings?.tagline && (
                <p className="mt-8 text-xl md:text-2xl text-white/85 leading-relaxed max-w-3xl">
                  {settings.tagline}
                </p>
              )}
            </FadeIn>
          </Container>
        </div>
      </section>

      <section className="py-section-md md:py-section-lg">
        <Container size="default">
          <FadeIn>
            <p className="font-[var(--font-heading,inherit)] text-2xl md:text-3xl lg:text-4xl leading-[1.25] tracking-tight text-ink">
              We serve students in underserved communities, helping them develop the skills,
              confidence, and awareness needed to navigate the world and shape their futures.
            </p>
          </FadeIn>
        </Container>
      </section>

      {(settings?.missionStatement || settings?.visionStatement) && (
        <section className="py-section-md md:py-section-lg bg-surface border-y border-gray-100">
          <Container size="wide">
            <div className="grid gap-14 lg:grid-cols-2">
              {settings?.missionStatement && (
                <FadeIn>
                  <Eyebrow tone="primary">Mission</Eyebrow>
                  <div className="mt-5 font-[var(--font-heading,inherit)] text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight">
                    <PortableText
                      value={settings.missionStatement as unknown as PortableTextBlock[]}
                    />
                  </div>
                </FadeIn>
              )}
              {settings?.visionStatement && (
                <FadeIn delay={0.1}>
                  <Eyebrow tone="primary">Vision</Eyebrow>
                  <div className="mt-5 font-[var(--font-heading,inherit)] text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight">
                    <PortableText
                      value={settings.visionStatement as unknown as PortableTextBlock[]}
                    />
                  </div>
                </FadeIn>
              )}
            </div>
          </Container>
        </section>
      )}

      {philosophy.length > 0 && (
        <section className="py-section-md md:py-section-lg">
          <Container size="wide">
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <FadeIn>
                <Eyebrow tone="primary">Our philosophy</Eyebrow>
                <h2 className="mt-4 font-[var(--font-heading,inherit)] text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                  We believe.
                </h2>
              </FadeIn>
              <Stagger className="flex flex-col divide-y divide-ink/10" gap={0.08}>
                {philosophy.map((belief, i) => {
                  const {head, tail} = splitPhrase(belief)
                  return (
                    <StaggerItem key={i}>
                      <div className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-6 md:py-8 items-baseline">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary pt-2">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="font-[var(--font-heading,inherit)] text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight">
                          {head}
                          {tail && (
                            <>
                              <span className="text-ink/35"> — {tail}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </StaggerItem>
                  )
                })}
              </Stagger>
            </div>
          </Container>
        </section>
      )}

      <section className="py-section-sm">
        <Container size="default">
          <FadeIn>
            <Link
              href="/programs#approach"
              className="group block rounded-2xl border border-ink/10 bg-surface px-8 py-6 md:px-10 md:py-8 hover:border-ink/25 transition-colors"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <Eyebrow tone="primary">Our approach</Eyebrow>
                  <p className="mt-3 font-[var(--font-heading,inherit)] text-xl md:text-2xl tracking-tight">
                    Every program develops our 4C’s + Identity — critical thinking, confidence,
                    communication, curiosity, and a grounded sense of self.
                  </p>
                </div>
                <ArrowRight
                  className="h-5 w-5 text-primary mt-2 shrink-0 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </div>
            </Link>
          </FadeIn>
        </Container>
      </section>

      {differentiators.length > 0 && (
        <section className="py-section-md md:py-section-lg bg-ink text-white">
          <Container size="wide">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr] mb-12 lg:mb-16">
              <FadeIn>
                <Eyebrow tone="white">What makes MUNA different</Eyebrow>
                <h2 className="mt-4 font-[var(--font-heading,inherit)] text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                  Reimagining how young people learn.
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
                  We don’t believe in one-size-fits-all education. Four commitments shape how every
                  program runs.
                </p>
              </FadeIn>
            </div>
            <Stagger className="grid gap-5 md:grid-cols-2" gap={0.08}>
              {differentiators.map((item, i) => {
                const {head, tail} = splitPhrase(item)
                return (
                  <StaggerItem key={i} className="h-full">
                    <HoverLift className="h-full">
                      <article className="h-full rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-10 flex flex-col">
                        <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="mt-5 font-[var(--font-heading,inherit)] text-3xl md:text-4xl leading-[1.1] tracking-tight">
                          {head}
                        </h3>
                        {tail && (
                          <p className="mt-3 text-base md:text-lg text-white/55 leading-relaxed">
                            {tail.charAt(0).toUpperCase() + tail.slice(1)}
                          </p>
                        )}
                      </article>
                    </HoverLift>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </Container>
        </section>
      )}

      {team.length > 0 && <TeamGrid team={team} />}

      {partners.length > 0 && <PartnersStrip partners={partners} grouped />}

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Help us reach the next student."
        body="Every gift funds books, classroom infrastructure, or a single school enrolment."
      />
    </>
  )
}
