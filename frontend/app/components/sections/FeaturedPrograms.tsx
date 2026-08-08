import Link from 'next/link'
import {ArrowRight} from 'lucide-react'
import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'
import ProgramCard from './ProgramCard'

type Program = React.ComponentProps<typeof ProgramCard>['program']

type Props = {
  programs: Program[]
  eyebrow?: string
  heading?: React.ReactNode
  lead?: React.ReactNode
  showAllLink?: boolean
}

export default function FeaturedPrograms({
  programs,
  eyebrow = 'What we do',
  heading = 'Programs that meet kids where they are.',
  lead,
  showAllLink = true,
}: Props) {
  if (!programs?.length) return null

  return (
    <section id="programs" className="py-section-md md:py-section-lg">
      <Container size="wide">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-14">
          <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
          {showAllLink && (
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              All programs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>

        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.12}>
          {programs.map((program) => (
            <StaggerItem key={program._id} className="h-full">
              <ProgramCard program={program} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
