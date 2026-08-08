import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import FadeIn from '@/app/components/motion/FadeIn'
import StoryCard from './StoryCard'

type Story = React.ComponentProps<typeof StoryCard>['story']

type Props = {
  story: Story | null
  eyebrow?: string
  heading?: React.ReactNode
}

export default function FeaturedStoryHero({story, eyebrow = 'Featured story', heading}: Props) {
  if (!story) return null

  return (
    <section className="py-section-md md:py-section-lg bg-surface">
      <Container size="wide">
        {heading && (
          <div className="mb-10">
            <SectionHeader eyebrow={eyebrow} heading={heading} />
          </div>
        )}
        <FadeIn>
          <StoryCard story={story} variant="large" />
        </FadeIn>
      </Container>
    </section>
  )
}
