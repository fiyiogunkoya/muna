import {ArrowRight} from 'lucide-react'
import {clsx} from 'clsx'
import Container from '@/app/components/ui/Container'
import FadeIn from '@/app/components/motion/FadeIn'

type Props = {
  donateUrl?: string | null
  donateText?: string | null
  heading?: React.ReactNode
  body?: React.ReactNode
  tone?: 'ink' | 'accent' | 'light'
  className?: string
}

const toneMap: Record<NonNullable<Props['tone']>, string> = {
  ink: 'bg-ink text-white',
  accent: 'bg-accent text-ink',
  light: 'bg-white text-ink border border-gray-100',
}

const buttonMap: Record<NonNullable<Props['tone']>, string> = {
  ink: 'bg-primary text-white hover:bg-primary/90',
  accent: 'bg-ink text-white hover:bg-ink/90',
  light: 'bg-primary text-white hover:bg-primary/90',
}

export default function DonateCallout({
  donateUrl,
  donateText = 'Donate',
  heading = 'Childhood doesn’t wait.',
  body = 'Your gift funds programs that help young people thrive — today.',
  tone = 'ink',
  className,
}: Props) {
  if (!donateUrl) return null

  return (
    <section className={clsx('py-section-md md:py-section-lg', className)}>
      <Container size="wide">
        <FadeIn>
          <div className={clsx('rounded-3xl px-8 md:px-16 py-16 md:py-20', toneMap[tone])}>
            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] items-center">
              <div>
                <h2 className="font-[var(--font-heading,inherit)] text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                  {heading}
                </h2>
                {body && (
                  <p
                    className={clsx(
                      'mt-5 text-lg md:text-xl leading-relaxed max-w-xl',
                      tone === 'ink' ? 'text-white/75' : 'text-ink/70',
                    )}
                  >
                    {body}
                  </p>
                )}
              </div>
              <div className="md:justify-self-end">
                <a
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-medium transition-colors',
                    buttonMap[tone],
                  )}
                >
                  {donateText}
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
