import {clsx} from 'clsx'

type Props = {
  children: React.ReactNode
  className?: string
  tone?: 'ink' | 'primary' | 'accent' | 'white'
}

const toneMap: Record<NonNullable<Props['tone']>, string> = {
  ink: 'text-ink/70',
  primary: 'text-primary',
  accent: 'text-accent',
  white: 'text-white/80',
}

export default function Eyebrow({children, className, tone = 'ink'}: Props) {
  return (
    <span
      className={clsx(
        'inline-block font-mono text-xs uppercase tracking-[0.18em]',
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
