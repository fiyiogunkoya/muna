import SanityImage from '@/app/components/SanityImage'
import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'

type Person = {
  _id: string
  firstName?: string | null
  lastName?: string | null
  role?: string | null
  bio?: string | null
  picture?: {
    asset?: {_ref?: string; _id?: string} | null
    alt?: string | null
  } | null
}

type Props = {
  team: Person[]
  eyebrow?: string
  heading?: React.ReactNode
}

export default function TeamGrid({team, eyebrow = 'Team', heading = 'The people behind the work.'}: Props) {
  if (!team?.length) return null

  return (
    <section className="py-section-md md:py-section-lg bg-surface">
      <Container size="wide">
        <SectionHeader eyebrow={eyebrow} heading={heading} className="mb-12" />
        <Stagger className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" gap={0.08}>
          {team.map((person) => {
            const ref = person.picture?.asset?._ref || person.picture?.asset?._id
            const name = [person.firstName, person.lastName].filter(Boolean).join(' ')
            return (
              <StaggerItem key={person._id}>
                <figure className="flex flex-col gap-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                    {ref && (
                      <SanityImage
                        id={ref}
                        width={720}
                        alt={person.picture?.alt || name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <figcaption>
                    <div className="font-[var(--font-heading,inherit)] text-xl tracking-tight">
                      {name}
                    </div>
                    {person.role && (
                      <div className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-ink/55">
                        {person.role}
                      </div>
                    )}
                    {person.bio && (
                      <p className="mt-3 text-sm text-ink/70 leading-relaxed">{person.bio}</p>
                    )}
                  </figcaption>
                </figure>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Container>
    </section>
  )
}
