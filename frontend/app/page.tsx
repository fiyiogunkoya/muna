import {Suspense} from 'react'
import Link from 'next/link'

import {AllPosts} from '@/app/components/Posts'
import {settingsQuery, galleryListingQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Image from '@/app/components/SanityImage'

export default async function Page() {
  const [{data: settings}, {data: galleries}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: galleryListingQuery}),
  ])

  const name = settings?.foundationName || settings?.title || 'Muna Foundation'
  const recentGalleries = galleries?.slice(0, 4) || []

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gray-950 text-white -mt-24 pt-24">
        <div className="container relative">
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-20">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase">
              {name}
            </h1>
            {settings?.tagline && (
              <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl">{settings.tagline}</p>
            )}
            <div className="flex gap-4 mt-10">
              {settings?.donateUrl && (
                <a
                  href={settings.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white text-black font-semibold py-3 px-8 hover:bg-gray-200 transition-colors"
                >
                  {settings?.donateButtonText || 'Support Our Mission'}
                </a>
              )}
              <Link
                href="/about"
                className="rounded-full border border-white/30 text-white font-semibold py-3 px-8 hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Highlights */}
      {recentGalleries.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                  Photo Highlights
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl">Recent Galleries</h2>
              </div>
              <Link
                href="/gallery"
                className="text-sm font-semibold hover:underline hidden sm:block"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recentGalleries.map((gallery) => (
                <Link
                  key={gallery._id}
                  href={`/gallery/${gallery.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-sm bg-gray-100"
                >
                  {gallery.coverImage?.asset?._ref && (
                    <Image
                      id={gallery.coverImage.asset._ref}
                      alt={gallery.coverImage?.alt || gallery.title || ''}
                      width={400}
                      crop={gallery.coverImage?.crop}
                      hotspot={gallery.coverImage?.hotspot}
                      mode="cover"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base">{gallery.title}</h3>
                    <p className="text-white/70 text-xs mt-1">{gallery.imageCount} photos</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/gallery"
              className="text-sm font-semibold hover:underline mt-6 block sm:hidden"
            >
              View All Galleries &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* Stories / Posts */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
