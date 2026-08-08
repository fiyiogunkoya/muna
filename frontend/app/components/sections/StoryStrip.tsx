import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'
import StoryCard from './StoryCard'

type Story = React.ComponentProps<typeof StoryCard>['story']

type Props = {
  stories: Story[]
  eyebrow?: string
  heading?: React.ReactNode
  bleed?: boolean
}

export default function StoryStrip({stories, eyebrow, heading, bleed = false}: Props) {
  if (!stories?.length) return null

  return (
    <section className="py-section-md">
      <Container size={bleed ? 'bleed' : 'wide'}>
        {(eyebrow || heading) && (
          <div className="mb-10">
            <SectionHeader eyebrow={eyebrow} heading={heading || 'More stories'} />
          </div>
        )}
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.1}>
          {stories.map((story) => (
            <StaggerItem key={story._id} className="h-full">
              <StoryCard story={story} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
