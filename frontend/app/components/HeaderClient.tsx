'use client'

import {useState} from 'react'
import Link from 'next/link'
import {motion, useMotionValueEvent, useScroll} from 'motion/react'
import {Menu} from 'lucide-react'
import MobileSheet from './MobileSheet'

type NavItem = {label: string; href: string}

type Props = {
  name: string
  donateUrl?: string | null
  donateText?: string | null
}

const NAV: NavItem[] = [
  {label: 'About', href: '/about'},
  {label: 'Programs', href: '/programs'},
  {label: 'Stories', href: '/stories'},
  {label: 'Impact', href: '/impact'},
  {label: 'Gallery', href: '/gallery'},
  {label: 'Get involved', href: '/get-involved'},
]

export default function HeaderClient({name, donateUrl, donateText}: Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const {scrollY} = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 48)
  })

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)',
          boxShadow: scrolled ? '0 1px 0 rgba(11,11,11,0.06)' : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{duration: 0.2}}
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-lg"
      >
        <div className="container-wide">
          <div className="flex items-center justify-between gap-6 py-4 md:py-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-[var(--font-heading,inherit)] text-lg md:text-2xl font-semibold tracking-tight">
                {name}
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-7 text-sm font-medium">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-ink/80 hover:text-ink transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              {donateUrl && (
                <a
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-white text-sm md:text-base font-medium px-5 py-2.5 hover:bg-primary/90 transition-colors"
                >
                  {donateText || 'Donate'}
                </a>
              )}
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="lg:hidden p-2 rounded-full hover:bg-ink/5"
              >
                <Menu className="h-6 w-6" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </motion.header>
      <MobileSheet
        open={open}
        onClose={() => setOpen(false)}
        items={NAV}
        donateUrl={donateUrl}
        donateText={donateText}
      />
    </>
  )
}
