'use client'

import {motion, useReducedMotion} from 'motion/react'

type Props = {
  children: React.ReactNode
  className?: string
  lift?: number
}

export default function HoverLift({children, className, lift = 4}: Props) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      whileHover={{y: -lift}}
      transition={{type: 'spring', stiffness: 320, damping: 24}}
    >
      {children}
    </motion.div>
  )
}
