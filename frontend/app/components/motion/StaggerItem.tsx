'use client'

import {motion, useReducedMotion} from 'motion/react'

type Props = {
  children: React.ReactNode
  className?: string
  y?: number
}

export default function StaggerItem({children, className, y = 24}: Props) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {opacity: 0, y},
        visible: {opacity: 1, y: 0, transition: {duration: 0.55, ease: [0.22, 1, 0.36, 1]}},
      }}
    >
      {children}
    </motion.div>
  )
}
