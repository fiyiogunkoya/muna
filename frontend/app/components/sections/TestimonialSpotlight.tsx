import {clsx} from 'clsx'
import SanityImage from '@/app/components/SanityImage'
import Container from '@/app/components/ui/Container'
import PullQuote from '@/app/components/ui/PullQuote'
import FadeIn from '@/app/components/motion/FadeIn'

type Props = {
  testimonial: {
    _id: string
    quote?: string | null
    attributionName?: string | null
    attributionRole?: string | null
    attributionImage?: {
      asset?: {_ref?: string; _id?: string} | null
      alt?: string | null
    } | null
  } | null
  tone?: 'ink' | 'white' | 'accent'
  className?: string
}

export default function TestimonialSpotlight({testimonial, tone = 'ink', className}: Props) {
  if (!testimonial?.quote) return null
  const ref =
    testimonial.attributionImage?.asset?._ref || testimonial.attributionImage?.asset?._id

  return (
    <section
      className={clsx(
        'py-section-md md:py-section-lg',
        tone === 'ink' && 'bg-ink text-white',
        tone === 'accent' && 'bg-accent text-ink',
        className,
      )}
    >
      <Container size="default">
        <FadeIn className="grid gap-10 md:grid-cols-[auto_1fr] items-center">
          {ref && (
            <div className="relative h-32 w-32 md:h-44 md:w-44 overflow-hidden rounded-full bg-gray-200 shrink-0">
              <SanityImage
                id={ref}
                width={400}
                alt={testimonial.attributionImage?.alt || testimonial.attributionName || ''}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <PullQuote
            quote={testimonial.quote}
            attribution={testimonial.attributionName || undefined}
            role={testimonial.attributionRole || undefined}
            tone={tone === 'accent' ? 'ink' : tone === 'ink' ? 'white' : 'ink'}
          />
        </FadeIn>
      </Container>
    </section>
  )
}
