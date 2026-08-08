import SanityImage from '@/app/components/SanityImage'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import FadeIn from '@/app/components/motion/FadeIn'
import Parallax from '@/app/components/motion/Parallax'
import {resolveIcon} from '@/app/lib/icons'

type Props = {
  title?: string | null
  tagline?: string | null
  summary?: string | null
  icon?: string | null
  coverImage?: {
    asset?: {_ref?: string; _id?: string} | null
    alt?: string | null
  } | null
}

export default function ProgramHero({title, tagline, summary, icon, coverImage}: Props) {
  const ref = coverImage?.asset?._ref || coverImage?.asset?._id
  const Icon = resolveIcon(icon)

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white -mt-24">
      <div className="absolute inset-0">
        {ref ? (
          <Parallax speed={0.15} className="absolute inset-0">
            <SanityImage
              id={ref}
              width={2400}
              alt={coverImage?.alt || title || ''}
              className="h-[120%] w-full object-cover"
            />
          </Parallax>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink to-primary/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/30" />
      </div>
      <div className="relative">
        <Container size="wide">
          <FadeIn className="pt-40 pb-16 md:pb-24 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              {Icon && <Icon className="h-6 w-6 text-accent" aria-hidden />}
              <Eyebrow tone="white">Program</Eyebrow>
            </div>
            <h1 className="font-[var(--font-heading,inherit)] text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
              {title}
            </h1>
            {tagline && (
              <p className="mt-6 text-xl md:text-2xl text-white/85 leading-relaxed max-w-2xl">
                {tagline}
              </p>
            )}
            {summary && (
              <p className="mt-6 text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">
                {summary}
              </p>
            )}
          </FadeIn>
        </Container>
      </div>
    </section>
  )
}
