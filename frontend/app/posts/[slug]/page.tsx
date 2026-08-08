import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import Avatar from '@/app/components/Avatar'
import {MorePosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import Container from '@/app/components/ui/Container'
import Eyebrow from '@/app/components/ui/Eyebrow'
import DonateCallout from '@/app/components/sections/DonateCallout'
import {sanityFetch} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery, settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  const params = await props.params
  const [{data: post}, {data: settings}] = await Promise.all([
    sanityFetch({query: postQuery, params}),
    sanityFetch({query: settingsQuery}),
  ])

  if (!post?._id) {
    return notFound()
  }

  return (
    <>
      <section className="pt-28 md:pt-36 pb-section-md">
        <Container size="default">
          <Eyebrow tone="primary">Post</Eyebrow>
          <h1 className="mt-4 font-[var(--font-heading,inherit)] text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight">
            {post.title}
          </h1>
          {post.author && post.author.firstName && post.author.lastName && (
            <div className="mt-6">
              <Avatar person={post.author} date={post.date} />
            </div>
          )}
        </Container>
      </section>

      <section className="pb-section-md">
        <Container size="default">
          <article className="grid gap-10">
            {post?.coverImage && (
              <Image
                id={post.coverImage.asset?._ref || ''}
                alt={post.coverImage.alt || ''}
                className="rounded-2xl w-full"
                width={1280}
                height={720}
                mode="cover"
                hotspot={post.coverImage.hotspot}
                crop={post.coverImage.crop}
              />
            )}
            {post.content?.length && (
              <PortableText
                className="prose prose-lg prose-stone max-w-none prose-headings:font-[var(--font-heading,inherit)] prose-headings:tracking-tight prose-p:text-ink/80"
                value={post.content as PortableTextBlock[]}
              />
            )}
          </article>
        </Container>
      </section>

      <DonateCallout
        donateUrl={settings?.donateUrl}
        donateText={settings?.donateButtonText}
      />

      <section className="bg-surface border-t border-gray-100 py-section-md">
        <Container size="wide">
          <Suspense>{await MorePosts({skip: post._id, limit: 2})}</Suspense>
        </Container>
      </section>
    </>
  )
}
