import type {Metadata} from 'next'
import {ArrowRight, HandHeart, Megaphone, Share2} from 'lucide-react'
import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import Eyebrow from '@/app/components/ui/Eyebrow'
import FadeIn from '@/app/components/motion/FadeIn'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'
import HoverLift from '@/app/components/motion/HoverLift'
import NewsletterForm from '@/app/components/sections/NewsletterForm'
import ShareButton from '@/app/components/sections/ShareButton'
import DonateCallout from '@/app/components/sections/DonateCallout'
import SanityImage from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import {getInvolvedQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Get involved',
  description: 'Donate, volunteer, subscribe, or share — every action matters.',
}

export default async function GetInvolvedPage() {
  const {data} = await sanityFetch({query: getInvolvedQuery})
  const settings = data?.settings
  const campaigns = data?.activeCampaigns || []

  return (
    <>
      <section className="pt-28 md:pt-36 pb-section-md">
        <Container size="wide">
          <SectionHeader
            eyebrow="Get involved"
            heading="Three ways to back this work."
            lead="Pick what fits your moment. Every one of these moves the needle."
          />
        </Container>
      </section>

      <section className="pb-section-md">
        <Container size="wide">
          <Stagger className="grid gap-6 md:grid-cols-3" gap={0.1}>
            <StaggerItem className="h-full">
              <HoverLift className="h-full">
                <article className="h-full rounded-2xl bg-ink text-white p-8 flex flex-col">
                  <HandHeart className="h-8 w-8 text-accent" aria-hidden />
                  <h3 className="mt-6 font-[var(--font-heading,inherit)] text-3xl tracking-tight">
                    Donate
                  </h3>
                  <p className="mt-3 text-white/75 leading-relaxed">
                    A one-time gift or recurring support funds programs at every scale.
                  </p>
                  {settings?.donateUrl && (
                    <a
                      href={settings.donateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-2 pt-6 text-base font-medium text-accent hover:text-white transition-colors"
                    >
                      {settings.donateButtonText || 'Donate'}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </article>
              </HoverLift>
            </StaggerItem>

            <StaggerItem className="h-full">
              <HoverLift className="h-full">
                <article className="h-full rounded-2xl bg-accent text-ink p-8 flex flex-col">
                  <Megaphone className="h-8 w-8" aria-hidden />
                  <h3 className="mt-6 font-[var(--font-heading,inherit)] text-3xl tracking-tight">
                    Volunteer
                  </h3>
                  <p className="mt-3 text-ink/75 leading-relaxed">
                    Bring your skills to a program. We work with educators, technologists, designers,
                    and field workers.
                  </p>
                  {settings?.contactEmail && (
                    <a
                      href={`mailto:${settings.contactEmail}?subject=Volunteering`}
                      className="mt-auto inline-flex items-center gap-2 pt-6 text-base font-medium hover:gap-3 transition-all"
                    >
                      Reach out
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </article>
              </HoverLift>
            </StaggerItem>

            <StaggerItem className="h-full">
              <HoverLift className="h-full">
                <article className="h-full rounded-2xl bg-white border border-gray-100 text-ink p-8 flex flex-col">
                  <Share2 className="h-8 w-8 text-primary" aria-hidden />
                  <h3 className="mt-6 font-[var(--font-heading,inherit)] text-3xl tracking-tight">
                    Spread the word
                  </h3>
                  <p className="mt-3 text-ink/70 leading-relaxed">
                    Share a story. Tag us. Send this page to one person who cares about what we care
                    about.
                  </p>
                  <div className="mt-auto pt-6">
                    <ShareButton />
                  </div>
                </article>
              </HoverLift>
            </StaggerItem>
          </Stagger>
        </Container>
      </section>

      {campaigns.length > 0 && (
        <section className="py-section-md md:py-section-lg bg-surface border-y border-gray-100">
          <Container size="wide">
            <Eyebrow tone="primary">Active campaigns</Eyebrow>
            <h2 className="mt-3 mb-10 font-[var(--font-heading,inherit)] text-4xl md:text-5xl tracking-tight">
              Right now we’re raising for…
            </h2>
            <Stagger className="grid gap-6 md:grid-cols-2" gap={0.1}>
              {campaigns.map((c) => {
                const url = c.donateUrl || settings?.donateUrl || null
                const ref = c.heroImage?.asset?._id
                const pct =
                  c.goalAmount && c.currentAmount
                    ? Math.min(100, Math.round((c.currentAmount / c.goalAmount) * 100))
                    : null
                return (
                  <StaggerItem key={c._id} className="h-full">
                    <FadeIn>
                      <article className="h-full rounded-2xl overflow-hidden bg-white border border-gray-100 flex flex-col">
                        {ref && (
                          <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                            <SanityImage
                              id={ref}
                              width={1200}
                              alt={c.heroImage?.alt || c.title || ''}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-7 flex-1 flex flex-col">
                          <h3 className="font-[var(--font-heading,inherit)] text-2xl tracking-tight">
                            {c.title}
                          </h3>
                          {c.tagline && (
                            <p className="mt-3 text-ink/70 leading-relaxed">{c.tagline}</p>
                          )}
                          {pct !== null && (
                            <div className="mt-6">
                              <div className="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{width: `${pct}%`}}
                                />
                              </div>
                              <div className="mt-2 flex items-center justify-between text-xs font-mono uppercase tracking-[0.18em] text-ink/60">
                                <span>{pct}% of goal</span>
                                <span>${c.goalAmount?.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                          {url && (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-auto pt-6 inline-flex items-center gap-2 text-base font-medium text-primary"
                            >
                              Support this campaign
                              <ArrowRight className="h-4 w-4" aria-hidden />
                            </a>
                          )}
                        </div>
                      </article>
                    </FadeIn>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </Container>
        </section>
      )}

      <NewsletterForm
        enabled={settings?.newsletterEnabled}
        url={settings?.newsletterUrl}
        cta={settings?.newsletterCtaText}
      />

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Ready to give?"
        tone="accent"
      />
    </>
  )
}
