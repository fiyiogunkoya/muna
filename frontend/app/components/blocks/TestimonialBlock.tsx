import TestimonialSpotlight from '@/app/components/sections/TestimonialSpotlight'
import TestimonialCarousel from '@/app/components/sections/TestimonialCarousel'

type Testimonial = React.ComponentProps<typeof TestimonialCarousel>['testimonials'][number]

type Props = {
  block: {
    eyebrow?: string | null
    heading?: string | null
    layout?: 'single' | 'carousel' | null
    testimonials?: Testimonial[]
  }
}

export default function TestimonialBlock({block}: Props) {
  const items = block.testimonials || []
  if (!items.length) return null

  if (block.layout === 'carousel') {
    return <TestimonialCarousel testimonials={items} />
  }
  return <TestimonialSpotlight testimonial={items[0]} />
}
