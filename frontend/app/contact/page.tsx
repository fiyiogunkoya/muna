import type {Metadata} from 'next'
import {Mail, ArrowRight} from 'lucide-react'

import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import SectionHeader from '@/app/components/ui/SectionHeader'
import FadeIn from '@/app/components/motion/FadeIn'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with us.',
}

const platformLabel: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
}

export default async function ContactPage() {
  const {data: settings} = await sanityFetch({query: settingsQuery})
  const name = settings?.foundationName || settings?.title || 'Muna Foundation'

  return (
    <>
      <section className="pt-28 md:pt-36 pb-section-md">
        <Container size="wide">
          <SectionHeader
            eyebrow="Contact"
            heading={`Talk to ${name}.`}
            lead="Partnerships, press, programs — we want to hear from you."
          />
        </Container>
      </section>

      <section className="pb-section-lg">
        <Container size="default">
          <div className="grid gap-10 md:grid-cols-2">
            {settings?.contactEmail && (
              <FadeIn>
                <div className="rounded-2xl border border-gray-100 bg-white p-8">
                  <Eyebrow tone="primary">Email</Eyebrow>
                  <h3 className="mt-3 font-[var(--font-heading,inherit)] text-2xl tracking-tight break-words">
                    {settings.contactEmail}
                  </h3>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    Send us a note
                  </a>
                </div>
              </FadeIn>
            )}

            {settings?.socialLinks && settings.socialLinks.length > 0 && (
              <FadeIn delay={0.1}>
                <div className="rounded-2xl border border-gray-100 bg-white p-8">
                  <Eyebrow tone="primary">Follow</Eyebrow>
                  <ul className="mt-4 space-y-2">
                    {settings.socialLinks.map((link) =>
                      link.url ? (
                        <li key={link._key}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                          >
                            {platformLabel[link.platform || ''] || link.platform}
                            <ArrowRight className="h-4 w-4 opacity-50" aria-hidden />
                          </a>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </div>
              </FadeIn>
            )}
          </div>

          {settings?.donateUrl && (
            <FadeIn delay={0.2} className="mt-10">
              <div className="rounded-2xl bg-ink text-white p-10 md:p-14 grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
                <div>
                  <Eyebrow tone="white">Support</Eyebrow>
                  <h3 className="mt-3 font-[var(--font-heading,inherit)] text-3xl md:text-4xl tracking-tight">
                    Or skip the inbox.
                  </h3>
                  <p className="mt-3 text-white/70 leading-relaxed max-w-md">
                    The fastest way to help is to give. Your contribution funds programs across our
                    full footprint.
                  </p>
                </div>
                <a
                  href={settings.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:justify-self-end inline-flex items-center gap-2 rounded-full bg-primary text-white px-7 py-4 text-base font-medium hover:bg-primary/90 transition-colors"
                >
                  {settings.donateButtonText || 'Donate'}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </FadeIn>
          )}
        </Container>
      </section>
    </>
  )
}
