'use client'

import {motion, useReducedMotion} from 'motion/react'

type Props = {
  children: React.ReactNode
  gap?: number
  className?: string
}

export default function Stagger({children, gap = 0.08, className}: Props) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, margin: '-80px'}}
      variants={{
        hidden: {},
        visible: {transition: {staggerChildren: gap}},
      }}
    >
      {children}
    </motion.div>
  )
}
