import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import LogoStrip from '@/app/components/ui/LogoStrip'

type Partner = React.ComponentProps<typeof LogoStrip>['items'][number]

type Props = {
  partners: Partner[]
  eyebrow?: string
  heading?: React.ReactNode
  grouped?: boolean
}

const tierOrder = ['founding', 'strategic', 'program', 'media']

export default function PartnersStrip({
  partners,
  eyebrow = 'Partners',
  heading = 'We do this with others.',
  grouped = false,
}: Props) {
  if (!partners?.length) return null

  if (grouped) {
    const tiers = tierOrder
      .map((tier) => ({
        tier,
        items: partners.filter((p) => (p as {tier?: string}).tier === tier),
      }))
      .filter((group) => group.items.length > 0)
    return (
      <section className="py-section-md">
        <Container size="wide">
          <SectionHeader eyebrow={eyebrow} heading={heading} className="mb-12" />
          <div className="flex flex-col gap-10">
            {tiers.map((group) => (
              <div key={group.tier}>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50 mb-4">
                  {group.tier} partners
                </div>
                <LogoStrip items={group.items} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-section-md">
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          heading={heading}
          align="center"
          className="mb-10"
        />
        <LogoStrip items={partners} />
      </Container>
    </section>
  )
}
