'use client'

import {motion, useReducedMotion} from 'motion/react'
import SanityImage from '@/app/components/SanityImage'
import KineticHeadline from '@/app/components/ui/KineticHeadline'
import Parallax from '@/app/components/motion/Parallax'
import {ArrowDown, ArrowRight} from 'lucide-react'

type Props = {
  foundationName?: string | null
  tagline?: string | null
  heroQuote?: string | null
  heroImage?: {
    asset?: {_ref?: string; _id?: string} | null
    alt?: string | null
  } | null
  donateUrl?: string | null
  donateText?: string | null
}

export default function HomeHero({
  foundationName,
  tagline,
  heroQuote,
  heroImage,
  donateUrl,
  donateText,
}: Props) {
  const ref = heroImage?.asset?._ref || heroImage?.asset?._id
  const reduced = useReducedMotion()
  const headline = heroQuote || tagline || 'Childhood is not a privilege.'

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white -mt-24">
      <div className="absolute inset-0">
        {ref ? (
          <Parallax speed={0.18} className="absolute inset-0">
            <SanityImage
              id={ref}
              width={2400}
              alt={heroImage?.alt || foundationName || ''}
              className="h-[120%] w-full object-cover"
            />
          </Parallax>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-primary/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/40" />
      </div>

      <div className="relative container-wide min-h-[88vh] flex flex-col justify-end pt-40 pb-20">
        <motion.div
          initial={reduced ? false : {opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.1}}
          className="mb-6 font-mono text-xs uppercase tracking-[0.24em] text-white/70"
        >
          {foundationName || 'Muna Foundation'}
        </motion.div>

        <KineticHeadline
          text={headline}
          className="font-[var(--font-heading,inherit)] text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-tight max-w-5xl text-white"
        />

        {tagline && heroQuote && (
          <motion.p
            initial={reduced ? false : {opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.6}}
            className="mt-8 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed"
          >
            {tagline}
          </motion.p>
        )}

        <motion.div
          initial={reduced ? false : {opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.8}}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          {donateUrl && (
            <a
              href={donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-7 py-4 text-base font-medium hover:bg-primary/90 transition-colors"
            >
              {donateText || 'Donate'}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          )}
          <a
            href="#programs"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-base font-medium text-white hover:border-white hover:bg-white/10 transition-colors"
          >
            See our programs
            <ArrowDown className="h-4 w-4" aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
