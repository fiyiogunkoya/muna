'use client'

import {useState} from 'react'
import Lightbox from '@/app/components/Lightbox'

type GalleryImage = {
  src: string
  thumbnailSrc: string
  alt: string
  caption?: string
}

export default function GalleryGrid({images}: {images: GalleryImage[]}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="relative aspect-square overflow-hidden rounded-sm bg-gray-100 cursor-pointer group"
          >
            <img
              src={image.thumbnailSrc}
              alt={image.alt}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length)}
          onNext={() => setLightboxIndex((prev) => (prev! + 1) % images.length)}
        />
      )}
    </>
  )
}
