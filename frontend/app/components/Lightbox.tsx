'use client'

import {useEffect, useCallback} from 'react'

type LightboxProps = {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({images, currentIndex, onClose, onPrev, onNext}: LightboxProps) {
  const image = images[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center"
        aria-label="Close lightbox"
      >
        &times;
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center"
          aria-label="Previous image"
        >
          &#8249;
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={image.src} alt={image.alt} className="max-w-full max-h-[75vh] object-contain" />
        {image.caption && (
          <p className="text-white/80 text-sm mt-4 text-center max-w-lg">{image.caption}</p>
        )}
        <p className="text-white/50 text-xs mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center"
          aria-label="Next image"
        >
          &#8250;
        </button>
      )}
    </div>
  )
}
