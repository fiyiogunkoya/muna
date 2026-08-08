import PartnersStrip from '@/app/components/sections/PartnersStrip'

type Partner = React.ComponentProps<typeof PartnersStrip>['partners'][number] & {tier?: string | null}

type Props = {
  block: {
    eyebrow?: string | null
    heading?: string | null
    partners?: Partner[]
    tiersFilter?: string[] | null
  }
}

export default function PartnerLogosBlock({block}: Props) {
  const partners = block.partners || []
  const filtered = block.tiersFilter?.length
    ? partners.filter((p) => block.tiersFilter!.includes(p.tier || ''))
    : partners
  return (
    <PartnersStrip
      partners={filtered}
      eyebrow={block.eyebrow || undefined}
      heading={block.heading || undefined}
    />
  )
}
