import {clsx} from 'clsx'

type Props = {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  tone?: 'light' | 'ink' | 'accent' | 'surface'
  className?: string
  as?: 'div' | 'article' | 'section'
}

const paddingMap: Record<NonNullable<Props['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-10',
}

const toneMap: Record<NonNullable<Props['tone']>, string> = {
  light: 'bg-white text-ink border border-gray-100',
  ink: 'bg-ink text-white',
  accent: 'bg-accent text-ink',
  surface: 'bg-surface text-ink',
}

export default function Card({
  children,
  padding = 'md',
  tone = 'light',
  className,
  as: Tag = 'div',
}: Props) {
  return (
    <Tag
      className={clsx(
        'rounded-2xl overflow-hidden transition-shadow duration-300',
        paddingMap[padding],
        toneMap[tone],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
