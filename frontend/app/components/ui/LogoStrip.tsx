'use client'

import {useReducedMotion} from 'motion/react'
import {clsx} from 'clsx'
import SanityImage from '@/app/components/SanityImage'

type LogoItem = {
  _id: string
  name: string
  url?: string | null
  logo?: {asset?: {_ref?: string; _id?: string} | null; alt?: string | null} | null
}

type Props = {
  items: LogoItem[]
  className?: string
}

export default function LogoStrip({items, className}: Props) {
  const reduced = useReducedMotion()

  if (!items?.length) return null

  const rendered = items.map((item) => {
    const ref = item.logo?.asset?._ref || item.logo?.asset?._id
    const inner = ref ? (
      <SanityImage
        id={ref}
        width={240}
        alt={item.logo?.alt || item.name}
        className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
      />
    ) : (
      <span className="font-mono text-sm uppercase tracking-widest text-ink/60">{item.name}</span>
    )
    return item.url ? (
      <a
        key={item._id}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-8"
      >
        {inner}
      </a>
    ) : (
      <span key={item._id} className="shrink-0 px-8">
        {inner}
      </span>
    )
  })

  if (reduced || items.length <= 6) {
    return (
      <div
        className={clsx(
          'flex flex-wrap items-center justify-center gap-y-6 gap-x-2',
          className,
        )}
      >
        {rendered}
      </div>
    )
  }

  return (
    <div className={clsx('overflow-hidden', className)}>
      <div className="flex items-center animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
        {rendered}
        {rendered}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
