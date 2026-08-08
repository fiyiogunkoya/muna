import {ArrowUpRight} from 'lucide-react'
import Container from '@/app/components/ui/Container'

type Props = {
  enabled?: boolean | null
  url?: string | null
  cta?: string | null
  heading?: React.ReactNode
}

export default function NewsletterForm({
  enabled,
  url,
  cta,
  heading = 'Get our monthly stories.',
}: Props) {
  if (!enabled || !url) return null

  return (
    <section className="py-section-md">
      <Container size="default">
        <div className="rounded-3xl bg-surface border border-gray-100 px-8 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-lg">
            <h3 className="font-[var(--font-heading,inherit)] text-3xl md:text-4xl leading-tight tracking-tight">
              {heading}
            </h3>
            <p className="mt-3 text-ink/65 leading-relaxed">
              Field updates, stories, and ways to get involved — once a month.
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-7 py-4 text-base font-medium hover:bg-ink/90 transition-colors shrink-0"
          >
            {cta || 'Subscribe'}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </Container>
    </section>
  )
}
