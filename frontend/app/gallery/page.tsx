import type {Metadata} from 'next'
import Link from 'next/link'
import {format, parseISO} from 'date-fns'

import {sanityFetch} from '@/sanity/lib/live'
import {galleryListingQuery, settingsQuery} from '@/sanity/lib/queries'
import Image from '@/app/components/SanityImage'
import Container from '@/app/components/ui/Container'
import SectionHeader from '@/app/components/ui/SectionHeader'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'
import HoverLift from '@/app/components/motion/HoverLift'
import DonateCallout from '@/app/components/sections/DonateCallout'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo galleries from our events, programs, and communities.',
}

export default async function GalleryPage() {
  const [{data: galleries}, {data: settings}] = await Promise.all([
    sanityFetch({query: galleryListingQuery}),
    sanityFetch({query: settingsQuery}),
  ])

  return (
    <>
      <section className="pt-28 md:pt-36 pb-section-md">
        <Container size="wide">
          <SectionHeader
            eyebrow="From the field"
            heading="Galleries"
            lead="Photographs from our events, programs, and the communities we work alongside."
          />
        </Container>
      </section>

      <section className="pb-section-lg">
        <Container size="wide">
          {!galleries || galleries.length === 0 ? (
            <p className="text-ink/60 py-12 text-center">No galleries yet. Check back soon.</p>
          ) : (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" gap={0.08}>
              {galleries.map((gallery) => (
                <StaggerItem key={gallery._id} className="h-full">
                  <HoverLift>
                    <Link href={`/gallery/${gallery.slug}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 mb-4">
                        {gallery.coverImage?.asset?._ref && (
                          <Image
                            id={gallery.coverImage.asset._ref}
                            alt={gallery.coverImage?.alt || gallery.title || ''}
                            width={720}
                            crop={gallery.coverImage?.crop}
                            hotspot={gallery.coverImage?.hotspot}
                            mode="cover"
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        )}
                      </div>
                      <h2 className="font-[var(--font-heading,inherit)] text-2xl tracking-tight group-hover:text-primary transition-colors">
                        {gallery.title}
                      </h2>
                      <div className="flex gap-2 text-xs font-mono uppercase tracking-[0.18em] text-ink/55 mt-2">
                        {gallery.date && <span>{format(parseISO(gallery.date), 'LLL d, yyyy')}</span>}
                        {gallery.date && gallery.imageCount != null && <span>·</span>}
                        {gallery.imageCount != null && (
                          <span>
                            {gallery.imageCount} {gallery.imageCount === 1 ? 'photo' : 'photos'}
                          </span>
                        )}
                      </div>
                      {gallery.description && (
                        <p className="text-ink/65 text-sm mt-3 line-clamp-2 leading-relaxed">
                          {gallery.description}
                        </p>
                      )}
                    </Link>
                  </HoverLift>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </section>

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
        heading="Photographs document the work."
        body="Your support keeps the cameras — and the programs — running."
      />
    </>
  )
}
