'use client'

import {useState} from 'react'
import {Share2, Link as LinkIcon, Check} from 'lucide-react'
import {toast} from 'sonner'

type Props = {
  title?: string
  url?: string
  className?: string
}

export default function ShareButton({title, url, className}: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    const shareTitle = title || (typeof document !== 'undefined' ? document.title : '')

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({title: shareTitle, url: shareUrl})
        return
      } catch {
        // user cancelled or failed; fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ||
        'inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium hover:bg-ink/5 transition-colors'
      }
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      Share
      <LinkIcon className="h-3.5 w-3.5 opacity-60" aria-hidden />
    </button>
  )
}
