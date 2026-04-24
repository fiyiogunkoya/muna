import type {Metadata} from 'next'
import Link from 'next/link'
import {format, parseISO} from 'date-fns'

import {sanityFetch} from '@/sanity/lib/live'
import {galleryListingQuery} from '@/sanity/lib/queries'
import Image from '@/app/components/SanityImage'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo galleries from our events and projects',
}

export default async function GalleryPage() {
  const {data: galleries} = await sanityFetch({query: galleryListingQuery})

  return (
    <div className="my-12 lg:my-24">
      <div className="container">
        <div className="pb-6 border-b border-gray-100 mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl">Galleries</h1>
          <p className="mt-4 text-base lg:text-lg text-gray-600">
            Photos from our events, projects, and community
          </p>
        </div>

        {!galleries || galleries.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">No galleries yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Link key={gallery._id} href={`/gallery/${gallery.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-100 mb-4">
                  {gallery.coverImage?.asset?._ref && (
                    <Image
                      id={gallery.coverImage.asset._ref}
                      alt={gallery.coverImage?.alt || gallery.title || ''}
                      width={600}
                      crop={gallery.coverImage?.crop}
                      hotspot={gallery.coverImage?.hotspot}
                      mode="cover"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <h2 className="text-xl font-bold group-hover:underline">{gallery.title}</h2>
                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                  {gallery.date && <span>{format(parseISO(gallery.date), 'MMMM d, yyyy')}</span>}
                  {gallery.date && gallery.imageCount != null && <span>&middot;</span>}
                  {gallery.imageCount != null && (
                    <span>
                      {gallery.imageCount} {gallery.imageCount === 1 ? 'photo' : 'photos'}
                    </span>
                  )}
                </div>
                {gallery.description && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{gallery.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
