import Link from 'next/link'
import {ArrowRight} from 'lucide-react'
import SanityImage from '@/app/components/SanityImage'
import {resolveIcon} from '@/app/lib/icons'
import HoverLift from '@/app/components/motion/HoverLift'

type Props = {
  program: {
    _id: string
    slug?: string | null
    title?: string | null
    tagline?: string | null
    accentColor?: string | null
    icon?: string | null
    coverImage?: {
      asset?: {_ref?: string; _id?: string} | null
      alt?: string | null
    } | null
  }
  className?: string
}

const accentClass: Record<string, string> = {
  primary: 'bg-primary text-white',
  accent: 'bg-accent text-ink',
  ink: 'bg-ink text-white',
}

export default function ProgramCard({program, className}: Props) {
  const accent = program.accentColor || 'primary'
  const Icon = resolveIcon(program.icon)
  const ref = program.coverImage?.asset?._ref || program.coverImage?.asset?._id
  const href = program.slug ? `/programs/${program.slug}` : '#'

  return (
    <HoverLift className={className}>
      <Link href={href} className="block group">
        <article className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 transition-shadow duration-300 group-hover:shadow-lift">
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            {ref ? (
              <SanityImage
                id={ref}
                width={720}
                alt={program.coverImage?.alt || program.title || ''}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : null}
            <div
              className={`absolute top-4 left-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${accentClass[accent] || accentClass.primary}`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
              <span className="font-mono uppercase tracking-[0.18em]">Program</span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-[var(--font-heading,inherit)] text-2xl md:text-3xl leading-tight tracking-tight">
              {program.title}
            </h3>
            {program.tagline && (
              <p className="mt-3 text-ink/70 text-base leading-relaxed">{program.tagline}</p>
            )}
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </div>
        </article>
      </Link>
    </HoverLift>
  )
}
