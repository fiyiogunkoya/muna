import StoryStrip from '@/app/components/sections/StoryStrip'
import FeaturedStoryHero from '@/app/components/sections/FeaturedStoryHero'

type Props = {
  block: {
    eyebrow?: string | null
    heading?: string | null
    variant?: 'cards' | 'large' | null
    stories?: React.ComponentProps<typeof StoryStrip>['stories']
  }
}

export default function StoryCarouselBlock({block}: Props) {
  const stories = block.stories || []
  if (!stories.length) return null

  if (block.variant === 'large' && stories[0]) {
    return (
      <FeaturedStoryHero
        story={stories[0]}
        eyebrow={block.eyebrow || undefined}
        heading={block.heading || 'Featured story'}
      />
    )
  }

  return (
    <StoryStrip
      stories={stories}
      eyebrow={block.eyebrow || undefined}
      heading={block.heading || undefined}
    />
  )
}
