import {format, parseISO} from 'date-fns'
import SanityImage from '@/app/components/SanityImage'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import KineticHeadline from '@/app/components/ui/KineticHeadline'
import FadeIn from '@/app/components/motion/FadeIn'
import Parallax from '@/app/components/motion/Parallax'

type Props = {
  title?: string | null
  excerpt?: string | null
  location?: string | null
  date?: string | null
  heroQuote?: string | null
  programTitle?: string | null
  heroImage?: {
    asset?: {_ref?: string; _id?: string} | null
    alt?: string | null
  } | null
}

export default function StoryHero({
  title,
  excerpt,
  location,
  date,
  heroQuote,
  programTitle,
  heroImage,
}: Props) {
  const ref = heroImage?.asset?._ref || heroImage?.asset?._id
  const dateText = date ? format(parseISO(date), 'LLL d, yyyy') : null

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white -mt-24">
      <div className="absolute inset-0">
        {ref ? (
          <Parallax speed={0.18} className="absolute inset-0">
            <SanityImage
              id={ref}
              width={2400}
              alt={heroImage?.alt || title || ''}
              className="h-[120%] w-full object-cover"
            />
          </Parallax>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink to-primary/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/30" />
      </div>
      <div className="relative">
        <Container size="wide">
          <div className="pt-40 pb-20 md:pb-28 max-w-5xl">
            <FadeIn>
              <Eyebrow tone="white">
                {programTitle ? `${programTitle} · Story` : 'Story'}
              </Eyebrow>
            </FadeIn>
            <div className="mt-6">
              <KineticHeadline
                text={title || ''}
                className="font-[var(--font-heading,inherit)] text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-white"
              />
            </div>
            {heroQuote && (
              <FadeIn delay={0.4} className="mt-8 max-w-3xl">
                <p className="font-[var(--font-heading,inherit)] text-2xl md:text-3xl text-white/90 leading-snug">
                  <span aria-hidden className="opacity-50 mr-1">
                    “
                  </span>
                  {heroQuote}
                  <span aria-hidden className="opacity-50 ml-1">
                    ”
                  </span>
                </p>
              </FadeIn>
            )}
            {excerpt && (
              <FadeIn delay={0.5}>
                <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                  {excerpt}
                </p>
              </FadeIn>
            )}
            <FadeIn delay={0.6}>
              <div className="mt-10 flex items-center gap-5 text-sm font-mono uppercase tracking-[0.2em] text-white/65">
                {location && <span>{location}</span>}
                {location && dateText && <span aria-hidden>·</span>}
                {dateText && <span>{dateText}</span>}
              </div>
            </FadeIn>
          </div>
        </Container>
      </div>
    </section>
  )
}
