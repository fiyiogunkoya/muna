'use client'

import {useEffect} from 'react'
import Link from 'next/link'
import {AnimatePresence, motion, useReducedMotion} from 'motion/react'
import {X} from 'lucide-react'

type NavItem = {label: string; href: string}

type Props = {
  open: boolean
  onClose: () => void
  items: NavItem[]
  donateUrl?: string | null
  donateText?: string | null
}

export default function MobileSheet({open, onClose, items, donateUrl, donateText}: Props) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface text-ink shadow-layer flex flex-col"
            initial={reduced ? {opacity: 0} : {x: '100%'}}
            animate={reduced ? {opacity: 1} : {x: 0}}
            exit={reduced ? {opacity: 0} : {x: '100%'}}
            transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="flex items-center justify-end p-6">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-full hover:bg-ink/5"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 px-8 pb-8">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block text-3xl font-medium tracking-tight hover:text-primary transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {donateUrl && (
                <a
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-flex items-center justify-center w-full rounded-full bg-primary text-white py-4 text-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {donateText || 'Donate'}
                </a>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
