import {clsx} from 'clsx'
import Eyebrow from './Eyebrow'

type Props = {
  eyebrow?: string
  heading: React.ReactNode
  lead?: React.ReactNode
  align?: 'left' | 'center'
  tone?: 'ink' | 'white'
  className?: string
}

export default function SectionHeader({
  eyebrow,
  heading,
  lead,
  align = 'left',
  tone = 'ink',
  className,
}: Props) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4 max-w-3xl',
        align === 'center' && 'items-center text-center mx-auto',
        className,
      )}
    >
      {eyebrow && <Eyebrow tone={tone === 'white' ? 'white' : 'primary'}>{eyebrow}</Eyebrow>}
      <h2
        className={clsx(
          'text-4xl md:text-5xl lg:text-6xl leading-[1.05] font-medium tracking-tight',
          tone === 'white' ? 'text-white' : 'text-ink',
        )}
      >
        {heading}
      </h2>
      {lead && (
        <p
          className={clsx(
            'text-lg md:text-xl leading-relaxed',
            tone === 'white' ? 'text-white/75' : 'text-ink/70',
          )}
        >
          {lead}
        </p>
      )}
    </div>
  )
}
