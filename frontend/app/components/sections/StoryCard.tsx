import Link from 'next/link'
import {format, parseISO} from 'date-fns'
import {ArrowUpRight} from 'lucide-react'
import SanityImage from '@/app/components/SanityImage'
import HoverLift from '@/app/components/motion/HoverLift'

type Props = {
  story: {
    _id: string
    slug?: string | null
    title?: string | null
    excerpt?: string | null
    location?: string | null
    date?: string | null
    program?: {title?: string | null; slug?: string | null} | null
    heroImage?: {
      asset?: {_ref?: string; _id?: string} | null
      alt?: string | null
    } | null
  }
  variant?: 'card' | 'large'
  className?: string
}

export default function StoryCard({story, variant = 'card', className}: Props) {
  const ref = story.heroImage?.asset?._ref || story.heroImage?.asset?._id
  const href = story.slug ? `/stories/${story.slug}` : '#'
  const dateText = story.date ? format(parseISO(story.date), 'LLL d, yyyy') : null

  if (variant === 'large') {
    return (
      <HoverLift className={className}>
        <Link href={href} className="block group">
          <article className="grid gap-8 lg:grid-cols-2 items-stretch overflow-hidden rounded-2xl bg-white">
            <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-gray-100">
              {ref && (
                <SanityImage
                  id={ref}
                  width={1280}
                  alt={story.heroImage?.alt || story.title || ''}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
            </div>
            <div className="flex flex-col justify-center px-8 py-10 lg:py-12">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
                {story.program?.title ? `${story.program.title} · ` : ''}Story
              </div>
              <h3 className="font-[var(--font-heading,inherit)] text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                {story.title}
              </h3>
              {story.excerpt && (
                <p className="mt-5 text-lg text-ink/75 leading-relaxed max-w-prose">
                  {story.excerpt}
                </p>
              )}
              <div className="mt-8 flex items-center gap-3 text-sm text-ink/60">
                {story.location && <span>{story.location}</span>}
                {story.location && dateText && <span aria-hidden>·</span>}
                {dateText && <span>{dateText}</span>}
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-base font-medium text-primary">
                Read the story
                <ArrowUpRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </span>
            </div>
          </article>
        </Link>
      </HoverLift>
    )
  }

  return (
    <HoverLift className={className}>
      <Link href={href} className="block group h-full">
        <article className="h-full flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden transition-shadow duration-300 group-hover:shadow-lift">
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            {ref && (
              <SanityImage
                id={ref}
                width={720}
                alt={story.heroImage?.alt || story.title || ''}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            )}
          </div>
          <div className="flex-1 flex flex-col p-6">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
              {story.program?.title ? story.program.title : 'Story'}
            </div>
            <h3 className="font-[var(--font-heading,inherit)] text-2xl leading-tight tracking-tight">
              {story.title}
            </h3>
            {story.excerpt && (
              <p className="mt-3 text-ink/70 leading-relaxed line-clamp-3">{story.excerpt}</p>
            )}
            <div className="mt-auto pt-6 flex items-center justify-between text-xs text-ink/55">
              <span>
                {story.location}
                {story.location && dateText && ' · '}
                {dateText}
              </span>
              <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden />
            </div>
          </div>
        </article>
      </Link>
    </HoverLift>
  )
}
