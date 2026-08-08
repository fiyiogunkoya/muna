import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'

// TODO: move timeline to CMS once content team is ready.
const milestones = [
  {
    year: '2019',
    title: 'Founded',
    body:
      'The Muna Foundation begins with a single program working with families across two communities.',
  },
  {
    year: '2021',
    title: 'First story published',
    body: 'Programs scale into education and health, reaching thousands of young people.',
  },
  {
    year: '2024',
    title: 'Partnerships',
    body: 'Cross-sector collaborations expand the footprint and deepen impact.',
  },
  {
    year: 'Today',
    title: 'Looking forward',
    body: 'Investing in the next generation of leaders and storytellers.',
  },
]

export default function Timeline() {
  return (
    <section className="py-section-md md:py-section-lg">
      <Container size="wide">
        <SectionHeader
          eyebrow="Our story"
          heading="Built one community at a time."
          className="mb-14"
        />
        <Stagger className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <StaggerItem key={m.year}>
              <article>
                <div className="font-[var(--font-heading,inherit)] text-5xl md:text-6xl leading-none tracking-tight text-primary">
                  {m.year}
                </div>
                <h3 className="mt-5 font-medium text-xl leading-snug">{m.title}</h3>
                <p className="mt-3 text-ink/70 leading-relaxed text-base">{m.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
