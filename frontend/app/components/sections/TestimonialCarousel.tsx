'use client'

import {useState} from 'react'
import {AnimatePresence, motion, useReducedMotion} from 'motion/react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import SanityImage from '@/app/components/SanityImage'
import Container from '@/app/components/ui/Container'
import PullQuote from '@/app/components/ui/PullQuote'

type Testimonial = {
  _id: string
  quote?: string | null
  attributionName?: string | null
  attributionRole?: string | null
  attributionImage?: {
    asset?: {_ref?: string; _id?: string} | null
    alt?: string | null
  } | null
}

type Props = {
  testimonials: Testimonial[]
  tone?: 'ink' | 'white' | 'accent'
}

export default function TestimonialCarousel({testimonials, tone = 'ink'}: Props) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  if (!testimonials?.length) return null
  const current = testimonials[index]
  const ref =
    current.attributionImage?.asset?._ref || current.attributionImage?.asset?._id

  const next = () => setIndex((i) => (i + 1) % testimonials.length)
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const quoteTone = tone === 'ink' ? 'white' : 'ink'

  return (
    <section
      className={
        tone === 'ink'
          ? 'py-section-md md:py-section-lg bg-ink text-white'
          : 'py-section-md md:py-section-lg bg-surface'
      }
    >
      <Container size="default">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={reduced ? false : {opacity: 0, y: 12}}
              animate={{opacity: 1, y: 0}}
              exit={reduced ? {opacity: 0} : {opacity: 0, y: -12}}
              transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
              className="grid gap-10 md:grid-cols-[auto_1fr] items-center"
            >
              {ref && (
                <div className="relative h-32 w-32 md:h-44 md:w-44 overflow-hidden rounded-full bg-gray-200 shrink-0">
                  <SanityImage
                    id={ref}
                    width={400}
                    alt={current.attributionImage?.alt || current.attributionName || ''}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <PullQuote
                quote={current.quote || ''}
                attribution={current.attributionName || undefined}
                role={current.attributionRole || undefined}
                tone={quoteTone}
              />
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className={
                  tone === 'ink'
                    ? 'p-3 rounded-full border border-white/20 hover:bg-white/10'
                    : 'p-3 rounded-full border border-ink/15 hover:bg-ink/5'
                }
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className={
                  tone === 'ink'
                    ? 'p-3 rounded-full border border-white/20 hover:bg-white/10'
                    : 'p-3 rounded-full border border-ink/15 hover:bg-ink/5'
                }
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
              <span className="ml-2 font-mono text-xs uppercase tracking-[0.18em] opacity-60">
                {index + 1} / {testimonials.length}
              </span>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
