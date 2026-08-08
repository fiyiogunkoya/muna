'use client'

import FadeIn from '@/app/components/motion/FadeIn'

type Props = {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}

export default function ScrollReveal(props: Props) {
  return <FadeIn {...props} />
}
