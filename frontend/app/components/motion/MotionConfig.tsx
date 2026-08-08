'use client'

import {MotionConfig as MotionProvider} from 'motion/react'

export default function MotionConfig({children}: {children: React.ReactNode}) {
  return <MotionProvider reducedMotion="user">{children}</MotionProvider>
}
