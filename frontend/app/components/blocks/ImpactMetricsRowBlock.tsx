import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import ImpactStatsRow from '@/app/components/sections/ImpactStatsRow'

type Props = {
  block: {
    eyebrow?: string | null
    heading?: string | null
    metrics?: React.ComponentProps<typeof ImpactStatsRow>['metrics']
  }
}

export default function ImpactMetricsRowBlock({block}: Props) {
  if (!block.metrics?.length) return null
  return (
    <section className="py-section-md md:py-section-lg">
      <Container size="wide">
        {(block.eyebrow || block.heading) && (
          <SectionHeader
            eyebrow={block.eyebrow || undefined}
            heading={block.heading || 'By the numbers'}
            className="mb-12"
          />
        )}
        <ImpactStatsRow metrics={block.metrics} />
      </Container>
    </section>
  )
}
