import type {Metadata} from 'next'
import Link from 'next/link'
import {format, parseISO} from 'date-fns'
import {notFound} from 'next/navigation'
import {ArrowUpRight} from 'lucide-react'

import {sanityFetch} from '@/sanity/lib/live'
import {galleryBySlugQuery, gallerySlugsQuery, settingsQuery} from '@/sanity/lib/queries'
import {dataset, projectId} from '@/sanity/lib/api'
import GalleryGrid from '@/app/components/GalleryGrid'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import DonateCallout from '@/app/components/sections/DonateCallout'

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
  const parts = ref.replace('image-', '').split('-')
  const format = parts.pop()
  const dimensions = parts.pop()
  const id = parts.join('-')
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=${width}&fit=max&auto=format`
}

export default async function GalleryDetailPage(props: Props) {
  const params = await props.params
  const [{data: gallery}, {data: settings}] = await Promise.all([
    sanityFetch({query: galleryBySlugQuery, params}),
    sanityFetch({query: settingsQuery}),
  ])

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
    <>
      <section className="pt-28 md:pt-36 pb-10">
        <Container size="wide">
          <Link
            href="/gallery"
            className="text-sm font-medium text-ink/55 hover:text-ink transition-colors mb-6 inline-block"
          >
            ← All galleries
          </Link>
          <div className="border-b border-ink/10 pb-8">
            <Eyebrow tone="primary">Gallery</Eyebrow>
            <h1 className="mt-4 font-[var(--font-heading,inherit)] text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight">
              {gallery.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-xs font-mono uppercase tracking-[0.18em] text-ink/55 mt-5">
              {gallery.date && <span>{format(parseISO(gallery.date), 'LLL d, yyyy')}</span>}
              {gallery.date && images.length > 0 && <span>·</span>}
              {images.length > 0 && (
                <span>
                  {images.length} {images.length === 1 ? 'photo' : 'photos'}
                </span>
              )}
            </div>
            {gallery.description && (
              <p className="text-ink/70 mt-5 max-w-2xl leading-relaxed">{gallery.description}</p>
            )}
            {gallery.relatedStory && (
              <Link
                href={`/stories/${gallery.relatedStory.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
              >
                Read the story: {gallery.relatedStory.title}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-section-lg">
        <Container size="wide">
          {images.length === 0 ? (
            <p className="text-ink/60 py-12 text-center">No photos in this gallery yet.</p>
          ) : (
            <GalleryGrid images={images} />
          )}
        </Container>
      </section>

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
      />
    </>
  )
}
