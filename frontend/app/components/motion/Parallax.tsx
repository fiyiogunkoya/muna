'use client'

import {useRef} from 'react'
import {motion, useReducedMotion, useScroll, useTransform} from 'motion/react'

type Props = {
  children: React.ReactNode
  speed?: number
  className?: string
}

export default function Parallax({children, speed = 0.25, className}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}px`, `${-speed * 100}px`])

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{y}}>{children}</motion.div>
    </div>
  )
}
