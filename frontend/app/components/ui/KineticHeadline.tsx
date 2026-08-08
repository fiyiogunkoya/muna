'use client'

import {motion, useReducedMotion} from 'motion/react'
import {clsx} from 'clsx'

type Props = {
  text: string
  className?: string
  as?: 'h1' | 'h2'
}

export default function KineticHeadline({text, className, as = 'h1'}: Props) {
  const reduced = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(' ')

  if (reduced) {
    const Plain = as as keyof React.JSX.IntrinsicElements
    return <Plain className={className}>{text}</Plain>
  }

  return (
    <Tag
      className={clsx('flex flex-wrap gap-x-[0.25em] gap-y-1', className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {transition: {staggerChildren: 0.08, delayChildren: 0.1}},
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          variants={{
            hidden: {y: '110%', opacity: 0},
            visible: {
              y: 0,
              opacity: 1,
              transition: {duration: 0.7, ease: [0.22, 1, 0.36, 1]},
            },
          }}
          style={{transformOrigin: 'bottom'}}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
