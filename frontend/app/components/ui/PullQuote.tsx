import {clsx} from 'clsx'

type Props = {
  quote: string
  attribution?: string
  role?: string
  tone?: 'ink' | 'white' | 'accent'
  className?: string
}

const toneMap: Record<NonNullable<Props['tone']>, string> = {
  ink: 'text-ink',
  white: 'text-white',
  accent: 'text-accent',
}

export default function PullQuote({quote, attribution, role, tone = 'ink', className}: Props) {
  return (
    <figure className={clsx('flex flex-col gap-6', className)}>
      <blockquote
        className={clsx(
          'font-[var(--font-heading,serif)] text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight',
          toneMap[tone],
        )}
      >
        <span aria-hidden className="opacity-40 mr-1">
          “
        </span>
        {quote}
        <span aria-hidden className="opacity-40 ml-1">
          ”
        </span>
      </blockquote>
      {(attribution || role) && (
        <figcaption className={clsx('text-sm font-mono uppercase tracking-widest', toneMap[tone])}>
          {attribution}
          {attribution && role && <span className="opacity-50"> · </span>}
          {role && <span className="opacity-70">{role}</span>}
        </figcaption>
      )}
    </figure>
  )
}
