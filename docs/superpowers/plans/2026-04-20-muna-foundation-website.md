# Muna Foundation Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing Sanity + Next.js monorepo with photo galleries, admin-controlled heading fonts, and foundation pages (about, gallery, donate, contact).

**Architecture:** Sanity-native approach — all admin features are Sanity schemas (gallery documents, siteTheme singleton, extended settings). The Next.js 16 frontend fetches from Sanity and renders with Tailwind CSS. Google Fonts are loaded dynamically based on the siteTheme document.

**Tech Stack:** Sanity v5, Next.js 16 (App Router), Tailwind CSS v4, React 19, TypeScript, Google Fonts

**Spec:** `docs/superpowers/specs/2026-04-20-muna-foundation-website-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `studio/src/schemaTypes/documents/gallery.ts` | Gallery document schema (title, slug, images array, cover, date) |
| `studio/src/schemaTypes/singletons/siteTheme.ts` | Site theme singleton (heading font dropdown) |
| `frontend/app/gallery/page.tsx` | Gallery listing page — grid of gallery cards |
| `frontend/app/gallery/[slug]/page.tsx` | Single gallery page — photo grid |
| `frontend/app/contact/page.tsx` | Contact page — email + social links from settings |
| `frontend/app/components/Lightbox.tsx` | Client component — photo lightbox overlay with prev/next |
| `frontend/app/components/GalleryGrid.tsx` | Client component — gallery photo grid with lightbox integration |

### Modified Files
| File | Changes |
|------|---------|
| `studio/src/schemaTypes/singletons/settings.tsx` | Add foundationName, tagline, contactEmail, socialLinks, donateUrl, donateButtonText fields |
| `studio/src/schemaTypes/index.ts` | Register gallery and siteTheme schemas |
| `studio/src/structure/index.ts` | Reorganize sidebar: Galleries, Stories, Pages, People, separator, Site Settings, Site Theme |
| `studio/sanity.config.ts` | Add gallery route to presentation tool resolvers |
| `frontend/sanity/lib/queries.ts` | Add galleryListingQuery, galleryBySlugQuery, siteThemeQuery; extend settingsQuery |
| `frontend/app/layout.tsx` | Fetch siteTheme, inject Google Font `<link>` tag, add `--font-heading` CSS variable |
| `frontend/app/globals.css` | Add `font-family: var(--font-heading)` to heading styles |
| `frontend/app/page.tsx` | Redesign as foundation homepage: hero, featured stories, gallery highlights, CTA |
| `frontend/app/components/Header.tsx` | Foundation name, nav links (About, Gallery, Stories, Contact, Donate button) |
| `frontend/app/components/Footer.tsx` | Foundation info, social links, donate link |

---

## Task 1: Gallery Schema

**Files:**
- Create: `studio/src/schemaTypes/documents/gallery.ts`

- [ ] **Step 1: Create the gallery document schema**

```ts
// studio/src/schemaTypes/documents/gallery.ts
import {ImageIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType, defineArrayMember} from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  icon: ImageIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly name for this gallery',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'A short summary of this gallery',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Shown as thumbnail on the gallery listing page',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryImage',
          title: 'Gallery Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
                aiAssist: {
                  imageDescriptionField: 'alt',
                },
              },
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              media: 'image',
              title: 'caption',
            },
            prepare({media, title}) {
              return {
                title: title || 'Untitled image',
                media,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'When these photos were taken',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      date: 'date',
    },
    prepare({title, media, date}) {
      return {
        title,
        media,
        subtitle: date ? format(parseISO(date), 'LLL d, yyyy') : undefined,
      }
    },
  },
})
```

- [ ] **Step 2: Verify file was created**

Run: `cat studio/src/schemaTypes/documents/gallery.ts | head -5`
Expected: Shows the import line and start of the schema definition.

- [ ] **Step 3: Commit**

```bash
git add studio/src/schemaTypes/documents/gallery.ts
git commit -m "feat: add gallery document schema"
```

---

## Task 2: Site Theme Singleton Schema

**Files:**
- Create: `studio/src/schemaTypes/singletons/siteTheme.ts`

- [ ] **Step 1: Create the siteTheme singleton schema**

```ts
// studio/src/schemaTypes/singletons/siteTheme.ts
import {PaintBucketIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const siteTheme = defineType({
  name: 'siteTheme',
  title: 'Site Theme',
  type: 'document',
  icon: PaintBucketIcon,
  fields: [
    defineField({
      name: 'headingFont',
      title: 'Heading Font',
      type: 'string',
      description: 'Choose the font used for all headings across the website',
      options: {
        list: [
          {title: 'Playfair Display', value: 'Playfair Display'},
          {title: 'Oswald', value: 'Oswald'},
          {title: 'Bebas Neue', value: 'Bebas Neue'},
          {title: 'Montserrat', value: 'Montserrat'},
          {title: 'Libre Baskerville', value: 'Libre Baskerville'},
        ],
        layout: 'radio',
      },
      initialValue: 'Montserrat',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Theme',
      }
    },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add studio/src/schemaTypes/singletons/siteTheme.ts
git commit -m "feat: add site theme singleton schema for heading font"
```

---

## Task 3: Extend Settings Schema

**Files:**
- Modify: `studio/src/schemaTypes/singletons/settings.tsx`

- [ ] **Step 1: Add foundation fields to the settings schema**

Add the following fields to the `fields` array in `settings.tsx`, after the existing `ogImage` field (before the closing `]` of the fields array at line 158):

```ts
    defineField({
      name: 'foundationName',
      title: 'Foundation Name',
      type: 'string',
      description: 'Displayed in the header, hero, and footer',
      group: 'foundation',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Mission one-liner shown in the hero section',
      group: 'foundation',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Displayed on the contact page',
      group: 'foundation',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Links to social media profiles',
      group: 'foundation',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Twitter / X', value: 'twitter'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'donateUrl',
      title: 'Donate URL',
      type: 'url',
      description: 'Link to your external donation platform (GoFundMe, PayPal, etc.)',
      group: 'foundation',
    }),
    defineField({
      name: 'donateButtonText',
      title: 'Donate Button Text',
      type: 'string',
      description: 'Text for the donate button',
      initialValue: 'Donate',
      group: 'foundation',
    }),
```

Also add field groups to the schema definition (after the `icon` property):

```ts
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'foundation', title: 'Foundation'},
  ],
```

And add `group: 'general'` to the existing `title`, `description`, and `ogImage` fields.

Also add `defineArrayMember` to the import from `'sanity'` at the top of the file.

- [ ] **Step 2: Verify the studio compiles**

Run: `cd studio && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors, or only pre-existing warnings.

- [ ] **Step 3: Commit**

```bash
git add studio/src/schemaTypes/singletons/settings.tsx
git commit -m "feat: add foundation fields to settings schema"
```

---

## Task 4: Register Schemas & Update Studio Structure

**Files:**
- Modify: `studio/src/schemaTypes/index.ts`
- Modify: `studio/src/structure/index.ts`
- Modify: `studio/sanity.config.ts`

- [ ] **Step 1: Register new schemas in the index**

Update `studio/src/schemaTypes/index.ts` to add:

```ts
import {gallery} from './documents/gallery'
import {siteTheme} from './singletons/siteTheme'
```

And add `gallery` and `siteTheme` to the `schemaTypes` array:

```ts
export const schemaTypes = [
  // Singletons
  settings,
  siteTheme,
  // Documents
  page,
  post,
  person,
  gallery,
  // Objects
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
]
```

- [ ] **Step 2: Reorganize the studio sidebar structure**

Replace the contents of `studio/src/structure/index.ts` with:

```ts
import {CogIcon, PaintBucketIcon, ImageIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

const SINGLETON_TYPES = ['settings', 'siteTheme', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Galleries
      S.listItem()
        .title('Galleries')
        .icon(ImageIcon)
        .child(S.documentTypeList('gallery').title('Galleries')),
      // Stories (posts)
      S.listItem()
        .title('Stories')
        .child(S.documentTypeList('post').title('Stories')),
      // Pages
      S.listItem()
        .title('Pages')
        .child(S.documentTypeList('page').title('Pages')),
      // People
      S.listItem()
        .title('People')
        .child(S.documentTypeList('person').title('People')),
      // Separator
      S.divider(),
      // Site Settings singleton
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
      // Site Theme singleton
      S.listItem()
        .title('Site Theme')
        .child(S.document().schemaType('siteTheme').documentId('siteTheme'))
        .icon(PaintBucketIcon),
    ])
```

- [ ] **Step 3: Add gallery route to the presentation tool**

In `studio/sanity.config.ts`, update the `resolveHref` function to handle galleries:

```ts
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'post':
      return slug ? `/posts/${slug}` : undefined
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'gallery':
      return slug ? `/gallery/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}
```

And add the gallery route to `mainDocuments` inside the `presentationTool` config:

```ts
{
  route: '/gallery/:slug',
  filter: `_type == "gallery" && slug.current == $slug || _id == $slug`,
},
```

And add gallery to the `locations` resolver (after the `post` locations block):

```ts
gallery: defineLocations({
  select: {
    title: 'title',
    slug: 'slug.current',
  },
  resolve: (doc) => ({
    locations: [
      {
        title: doc?.title || 'Untitled',
        href: resolveHref('gallery', doc?.slug)!,
      },
    ],
  }),
}),
```

- [ ] **Step 4: Verify the studio starts without errors**

Run: `cd studio && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add studio/src/schemaTypes/index.ts studio/src/structure/index.ts studio/sanity.config.ts
git commit -m "feat: register gallery and theme schemas, reorganize studio sidebar"
```

---

## Task 5: GROQ Queries

**Files:**
- Modify: `frontend/sanity/lib/queries.ts`

- [ ] **Step 1: Add gallery, theme, and extended settings queries**

Add to `frontend/sanity/lib/queries.ts`:

```ts
export const galleryListingQuery = defineQuery(`
  *[_type == "gallery" && defined(slug.current)] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    date,
    "imageCount": count(images)
  }
`)

export const galleryBySlugQuery = defineQuery(`
  *[_type == "gallery" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    date,
    images[] {
      _key,
      image {
        ...,
        asset->
      },
      caption,
      "alt": image.alt
    }
  }
`)

export const gallerySlugsQuery = defineQuery(`
  *[_type == "gallery" && defined(slug.current)]
  {"slug": slug.current}
`)

export const siteThemeQuery = defineQuery(`
  *[_type == "siteTheme" && _id == "siteTheme"][0] {
    headingFont
  }
`)
```

Also update the existing `settingsQuery` to include the new foundation fields:

```ts
export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  foundationName,
  tagline,
  contactEmail,
  socialLinks[] {
    _key,
    platform,
    url
  },
  donateUrl,
  donateButtonText
}`)
```

- [ ] **Step 2: Regenerate TypeScript types**

Run: `cd frontend && npx sanity@latest typegen generate 2>&1 | tail -5`
Expected: Types generated successfully (or a warning that the studio needs to be running — this is fine, types will be regenerated when the studio deploys its schema).

- [ ] **Step 3: Commit**

```bash
git add frontend/sanity/lib/queries.ts
git commit -m "feat: add GROQ queries for galleries, theme, and extended settings"
```

---

## Task 6: Dynamic Font Loading

**Files:**
- Modify: `frontend/app/layout.tsx`
- Modify: `frontend/app/globals.css`

- [ ] **Step 1: Update layout.tsx to fetch siteTheme and inject the Google Font**

Replace the contents of `frontend/app/layout.tsx` with:

```tsx
import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Inter, IBM_Plex_Mono} from 'next/font/google'
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery, siteThemeQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from '@/app/client-utils'

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })
  const title = settings?.foundationName || settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

// Map font names to Google Fonts URL parameter values
const fontUrlMap: Record<string, string> = {
  'Playfair Display': 'Playfair+Display:wght@400;700;900',
  'Oswald': 'Oswald:wght@400;700',
  'Bebas Neue': 'Bebas+Neue',
  'Montserrat': 'Montserrat:wght@400;700;900',
  'Libre Baskerville': 'Libre+Baskerville:wght@400;700',
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data: theme} = await sanityFetch({query: siteThemeQuery, stega: false})

  const headingFont = theme?.headingFont || 'Montserrat'
  const fontUrl = fontUrlMap[headingFont]

  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} bg-white text-black`}
      style={{'--font-heading': `"${headingFont}", sans-serif`} as React.CSSProperties}
    >
      <head>
        {fontUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
              href={`https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`}
              rel="stylesheet"
            />
          </>
        )}
      </head>
      <body>
        <section className="min-h-screen pt-24">
          <Toaster />
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
          <SanityLive onError={handleError} />
          <Header />
          <main>{children}</main>
          <Footer />
        </section>
        <SpeedInsights />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update globals.css to use the heading font variable**

Replace the heading styles in `frontend/app/globals.css`:

```css
@layer base {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-heading, inherit);
    @apply font-medium tracking-tight;
  }
}
```

- [ ] **Step 3: Verify the frontend compiles**

Run: `cd frontend && npx next lint 2>&1 | tail -10`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/app/layout.tsx frontend/app/globals.css
git commit -m "feat: dynamic heading font loading from Sanity theme"
```

---

## Task 7: Header & Footer

**Files:**
- Modify: `frontend/app/components/Header.tsx`
- Modify: `frontend/app/components/Footer.tsx`

- [ ] **Step 1: Replace Header with foundation navigation**

Replace `frontend/app/components/Header.tsx` with:

```tsx
import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  const name = settings?.foundationName || settings?.title || 'Muna Foundation'

  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 px-2 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <span className="text-lg sm:text-2xl pl-2 font-semibold">{name}</span>
          </Link>

          <nav>
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight"
            >
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:underline">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/posts" className="hover:underline">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              {settings?.donateUrl && (
                <li>
                  <a
                    className="rounded-full flex gap-4 items-center bg-black hover:bg-gray-800 py-2 px-4 justify-center sm:py-3 sm:px-6 text-white transition-colors duration-200"
                    href={settings.donateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="whitespace-nowrap">
                      {settings?.donateButtonText || 'Donate'}
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Replace Footer with foundation info**

Replace `frontend/app/components/Footer.tsx` with:

```tsx
import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

const socialIcons: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
}

export default async function Footer() {
  const {data: settings} = await sanityFetch({query: settingsQuery})

  const name = settings?.foundationName || settings?.title || 'Muna Foundation'

  return (
    <footer className="bg-gray-950 text-white">
      <div className="container">
        <div className="py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4">{name}</h3>
              {settings?.tagline && (
                <p className="text-gray-400 text-sm leading-relaxed">{settings.tagline}</p>
              )}
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Navigate</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/posts" className="text-gray-300 hover:text-white transition-colors">
                    Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social & Donate */}
            <div>
              {settings?.socialLinks && settings.socialLinks.length > 0 && (
                <>
                  <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Follow</h4>
                  <ul className="space-y-2 text-sm mb-8">
                    {settings.socialLinks.map((link) => (
                      <li key={link._key}>
                        <a
                          href={link.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-white transition-colors"
                        >
                          {socialIcons[link.platform!] || link.platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {settings?.donateUrl && (
                <a
                  href={settings.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-white text-black font-semibold py-3 px-8 hover:bg-gray-200 transition-colors"
                >
                  {settings?.donateButtonText || 'Donate'}
                </a>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/app/components/Header.tsx frontend/app/components/Footer.tsx
git commit -m "feat: update header and footer for foundation site"
```

---

## Task 8: Homepage Redesign

**Files:**
- Modify: `frontend/app/page.tsx`

- [ ] **Step 1: Redesign the homepage**

Replace `frontend/app/page.tsx` with:

```tsx
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
                    <p className="text-white/70 text-xs mt-1">
                      {gallery.imageCount} photos
                    </p>
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/page.tsx
git commit -m "feat: redesign homepage with hero, gallery highlights, and stories"
```

---

## Task 9: Gallery Listing Page

**Files:**
- Create: `frontend/app/gallery/page.tsx`

- [ ] **Step 1: Create the gallery listing page**

```tsx
// frontend/app/gallery/page.tsx
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

        {(!galleries || galleries.length === 0) ? (
          <p className="text-gray-500 py-12 text-center">
            No galleries yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Link
                key={gallery._id}
                href={`/gallery/${gallery.slug}`}
                className="group block"
              >
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
                  {gallery.date && (
                    <span>{format(parseISO(gallery.date), 'MMMM d, yyyy')}</span>
                  )}
                  {gallery.date && gallery.imageCount != null && <span>&middot;</span>}
                  {gallery.imageCount != null && (
                    <span>{gallery.imageCount} {gallery.imageCount === 1 ? 'photo' : 'photos'}</span>
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/gallery/page.tsx
git commit -m "feat: add gallery listing page"
```

---

## Task 10: Gallery Detail Page with Lightbox

**Files:**
- Create: `frontend/app/components/Lightbox.tsx`
- Create: `frontend/app/components/GalleryGrid.tsx`
- Create: `frontend/app/gallery/[slug]/page.tsx`

- [ ] **Step 1: Create the Lightbox client component**

```tsx
// frontend/app/components/Lightbox.tsx
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
        <img
          src={image.src}
          alt={image.alt}
          className="max-w-full max-h-[75vh] object-contain"
        />
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
```

- [ ] **Step 2: Create the GalleryGrid client component**

```tsx
// frontend/app/components/GalleryGrid.tsx
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
          onPrev={() =>
            setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length)
          }
          onNext={() =>
            setLightboxIndex((prev) => (prev! + 1) % images.length)
          }
        />
      )}
    </>
  )
}
```

- [ ] **Step 3: Create the single gallery page**

```tsx
// frontend/app/gallery/[slug]/page.tsx
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
  // Parse Sanity image ref: image-<id>-<dimensions>-<format>
  const [, id, dimensions, format] = ref.split('-')
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
```

- [ ] **Step 4: Commit**

```bash
git add frontend/app/components/Lightbox.tsx frontend/app/components/GalleryGrid.tsx frontend/app/gallery/[slug]/page.tsx
git commit -m "feat: add gallery detail page with lightbox"
```

---

## Task 11: Contact Page

**Files:**
- Create: `frontend/app/contact/page.tsx`

- [ ] **Step 1: Create the contact page**

```tsx
// frontend/app/contact/page.tsx
import type {Metadata} from 'next'

import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with us',
}

const socialIcons: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
}

export default async function ContactPage() {
  const {data: settings} = await sanityFetch({query: settingsQuery})

  const name = settings?.foundationName || settings?.title || 'Muna Foundation'

  return (
    <div className="my-12 lg:my-24">
      <div className="container">
        <div className="pb-6 border-b border-gray-100 mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl">Contact</h1>
          <p className="mt-4 text-base lg:text-lg text-gray-600">
            Get in touch with {name}
          </p>
        </div>

        <div className="max-w-2xl space-y-12">
          {/* Email */}
          {settings?.contactEmail && (
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Email</h2>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-xl sm:text-2xl font-semibold hover:underline"
              >
                {settings.contactEmail}
              </a>
            </div>
          )}

          {/* Social Links */}
          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Follow Us</h2>
              <ul className="space-y-3">
                {settings.socialLinks.map((link) => (
                  <li key={link._key}>
                    <a
                      href={link.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold hover:underline"
                    >
                      {socialIcons[link.platform!] || link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Donate CTA */}
          {settings?.donateUrl && (
            <div className="bg-gray-50 rounded-sm p-8">
              <h2 className="text-2xl font-bold mb-2">Support Our Work</h2>
              <p className="text-gray-600 mb-6">
                Your contribution helps us continue our mission.
              </p>
              <a
                href={settings.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-black text-white font-semibold py-3 px-8 hover:bg-gray-800 transition-colors"
              >
                {settings?.donateButtonText || 'Donate'}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/contact/page.tsx
git commit -m "feat: add contact page"
```

---

## Task 12: Verification

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

This starts both Sanity Studio (port 3333) and Next.js frontend (port 3000).

- [ ] **Step 2: Verify Studio schemas**

Open `http://localhost:3333`. Verify:
- Sidebar shows: Galleries, Stories, Pages, People, (divider), Site Settings, Site Theme
- Click "Galleries" → Create a new gallery → verify fields: title, slug, description, cover image, images array, date
- Click "Site Theme" → verify heading font radio selector with 5 options
- Click "Site Settings" → verify "Foundation" tab with: foundationName, tagline, contactEmail, socialLinks, donateUrl, donateButtonText

- [ ] **Step 3: Populate test content**

In Sanity Studio:
1. Open "Site Settings" → set foundationName, tagline, contactEmail, donateUrl, add at least one social link → Publish
2. Open "Site Theme" → select a heading font → Publish
3. Create a Gallery with title, cover image, 3+ images with captions → Publish
4. If no posts exist yet, create one with a title, slug, excerpt, and cover image → Publish

- [ ] **Step 4: Verify frontend pages**

Open `http://localhost:3000`. Verify:
- **Homepage:** Hero shows foundation name + tagline, donate button links to external URL, gallery highlights grid shows the test gallery, stories section shows posts
- **Header:** Foundation name, nav links (About, Gallery, Stories, Contact, Donate button)
- **Footer:** Foundation name, tagline, nav links, social links, donate button, copyright
- **`/gallery`:** Gallery listing shows the test gallery with cover image, title, date, photo count
- **`/gallery/[slug]`:** Photo grid renders, clicking a photo opens lightbox, arrow keys and buttons navigate, Escape closes, caption displays
- **`/contact`:** Shows email, social links, donate CTA
- **Font:** Headings use the selected Google Font from Site Theme. Change the font in Studio, publish, refresh — headings update

- [ ] **Step 5: Mobile check**

Resize browser to mobile viewport. Verify:
- Gallery grid goes to 2 columns
- Lightbox works with touch
- Header collapses gracefully
- Hero text sizes down appropriately
