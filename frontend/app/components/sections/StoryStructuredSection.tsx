import {PortableText, type PortableTextBlock} from 'next-sanity'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import FadeIn from '@/app/components/motion/FadeIn'

type Props = {
  challenge?: PortableTextBlock[] | null
  approach?: PortableTextBlock[] | null
  impact?: PortableTextBlock[] | null
}

const sections = [
  {key: 'challenge', label: '01 / Challenge'},
  {key: 'approach', label: '02 / Approach'},
  {key: 'impact', label: '03 / Impact'},
] as const

export default function StoryStructuredSection({challenge, approach, impact}: Props) {
  const data: Record<string, PortableTextBlock[] | null | undefined> = {
    challenge,
    approach,
    impact,
  }
  const visible = sections.filter((s) => (data[s.key]?.length ?? 0) > 0)
  if (visible.length === 0) return null

  return (
    <section className="py-section-md md:py-section-lg bg-surface">
      <Container size="wide">
        <div className="grid gap-10 md:grid-cols-3">
          {visible.map((section, i) => (
            <FadeIn key={section.key} delay={i * 0.1} className="flex flex-col gap-5">
              <Eyebrow tone="primary">{section.label}</Eyebrow>
              <div className="prose prose-lg prose-stone max-w-none prose-headings:font-[var(--font-heading,inherit)] prose-headings:tracking-tight prose-p:text-ink/80">
                <PortableText value={data[section.key] as PortableTextBlock[]} />
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
