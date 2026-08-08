import {clsx} from 'clsx'

type Props = {
  value: string
  label: string
  prefix?: string | null
  suffix?: string | null
  description?: string | null
  tone?: 'ink' | 'white' | 'accent'
  className?: string
}

const toneMap: Record<NonNullable<Props['tone']>, string> = {
  ink: 'text-ink',
  white: 'text-white',
  accent: 'text-accent',
}

export default function Stat({
  value,
  label,
  prefix,
  suffix,
  description,
  tone = 'ink',
  className,
}: Props) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div
        className={clsx(
          'font-[var(--font-heading,inherit)] leading-none tracking-tight text-5xl md:text-6xl lg:text-7xl',
          toneMap[tone],
        )}
      >
        {prefix && <span className="opacity-70 text-[0.6em] mr-1 align-top">{prefix}</span>}
        <span>{value}</span>
        {suffix && <span className="opacity-70 text-[0.6em] ml-1 align-top">{suffix}</span>}
      </div>
      <div
        className={clsx(
          'font-mono text-xs uppercase tracking-[0.2em]',
          tone === 'white' ? 'text-white/70' : 'text-ink/60',
        )}
      >
        {label}
      </div>
      {description && (
        <p className={clsx('text-sm leading-relaxed max-w-xs', tone === 'white' ? 'text-white/70' : 'text-ink/65')}>
          {description}
        </p>
      )}
    </div>
  )
}
