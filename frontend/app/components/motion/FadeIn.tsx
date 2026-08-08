'use client'

import {motion, useReducedMotion} from 'motion/react'

type Props = {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'header'
}

export default function FadeIn({children, delay = 0, y = 24, className, as = 'div'}: Props) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const PlainTag = as as keyof React.JSX.IntrinsicElements
    return <PlainTag className={className}>{children}</PlainTag>
  }

  return (
    <Tag
      className={className}
      initial={{opacity: 0, y}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{duration: 0.6, delay, ease: [0.22, 1, 0.36, 1]}}
    >
      {children}
    </Tag>
  )
}
