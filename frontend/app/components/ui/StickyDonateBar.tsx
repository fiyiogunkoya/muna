'use client'

import {useEffect, useState} from 'react'
import {AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent} from 'motion/react'
import {X, ArrowRight} from 'lucide-react'

type Props = {
  enabled?: boolean | null
  donateUrl?: string | null
  buttonText?: string | null
  message?: string | null
}

const STORAGE_KEY = 'muna-sticky-donate-dismissed'

export default function StickyDonateBar({enabled, donateUrl, buttonText, message}: Props) {
  const [dismissed, setDismissed] = useState(true)
  const [pastHero, setPastHero] = useState(false)
  const reduced = useReducedMotion()
  const {scrollY} = useScroll()

  useEffect(() => {
    if (typeof window === 'undefined') return
    setDismissed(window.sessionStorage.getItem(STORAGE_KEY) === '1')
  }, [])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (typeof window !== 'undefined') {
      setPastHero(latest > window.innerHeight * 0.75)
    }
  })

  if (!enabled || !donateUrl) return null

  const visible = pastHero && !dismissed
  const handleDismiss = () => {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STORAGE_KEY, '1')
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 bg-ink text-white shadow-layer"
          style={{paddingBottom: 'env(safe-area-inset-bottom)'}}
          initial={reduced ? false : {y: '100%'}}
          animate={reduced ? {y: 0} : {y: 0}}
          exit={reduced ? {opacity: 0} : {y: '100%'}}
          transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
        >
          <div className="container-wide flex items-center justify-between gap-4 py-3 md:py-4">
            <p className="text-sm md:text-base font-medium leading-snug">
              {message || 'Support our work.'}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm md:text-base font-medium text-white hover:bg-primary/90 transition-colors"
              >
                {buttonText || 'Donate'}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss donate bar"
                className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
