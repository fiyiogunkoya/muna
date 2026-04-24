import type {Metadata} from 'next'
import Link from 'next/link'
import {format, parseISO} from 'date-fns'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/sanity/lib/live'
import {galleryBySlugQuery, gallerySlugsQuery} from '@/sanity/lib/queries'
import {dataset, projectId} from '@/sanity/lib/api'
import GalleryGrid from '@/app/components/GalleryGrid'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: gallerySlugsQuery,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data: gallery} = await sanityFetch({
    query: galleryBySlugQuery,
    params,
    stega: false,
  })

  return {
    title: gallery?.title || 'Gallery',
    description: gallery?.description || undefined,
  }
}

function sanityImageUrl(ref: string, width: number): string {
  // Parse Sanity image asset ID: image-<id>-<dimensions>-<format>
  const parts = ref.replace('image-', '').split('-')
  const format = parts.pop()
  const dimensions = parts.pop()
  const id = parts.join('-')
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=${width}&fit=max&auto=format`
}

export default async function GalleryDetailPage(props: Props) {
  const params = await props.params
  const {data: gallery} = await sanityFetch({query: galleryBySlugQuery, params})

  if (!gallery) {
    notFound()
  }

  const images = (gallery.images || [])
    .filter((item) => item.image?.asset?._id)
    .map((item) => ({
      src: sanityImageUrl(item.image!.asset!._id!, 1600),
      thumbnailSrc: sanityImageUrl(item.image!.asset!._id!, 400),
      alt: item.alt || '',
      caption: item.caption || undefined,
    }))

  return (
    <div className="my-12 lg:my-24">
      <div className="container">
        <Link href="/gallery" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">
          &larr; All Galleries
        </Link>
        <div className="pb-6 border-b border-gray-100 mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl">{gallery.title}</h1>
          <div className="flex gap-2 text-sm text-gray-500 mt-3">
            {gallery.date && <span>{format(parseISO(gallery.date), 'MMMM d, yyyy')}</span>}
            {gallery.date && images.length > 0 && <span>&middot;</span>}
            {images.length > 0 && (
              <span>
                {images.length} {images.length === 1 ? 'photo' : 'photos'}
              </span>
            )}
          </div>
          {gallery.description && (
            <p className="text-gray-600 mt-4 max-w-2xl">{gallery.description}</p>
          )}
        </div>

        {images.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">No photos in this gallery yet.</p>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </div>
  )
}
