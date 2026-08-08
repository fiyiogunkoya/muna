import FeaturedPrograms from '@/app/components/sections/FeaturedPrograms'

type Props = {
  block: {
    eyebrow?: string | null
    heading?: string | null
    programs?: React.ComponentProps<typeof FeaturedPrograms>['programs']
  }
}

export default function ProgramGridBlock({block}: Props) {
  return (
    <FeaturedPrograms
      programs={block.programs || []}
      eyebrow={block.eyebrow || undefined}
      heading={block.heading || undefined}
      showAllLink={false}
    />
  )
}
