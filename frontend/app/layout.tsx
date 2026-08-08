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
import MotionConfig from '@/app/components/motion/MotionConfig'
import StickyDonateBar from '@/app/components/ui/StickyDonateBar'
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
  Oswald: 'Oswald:wght@400;700',
  'Bebas Neue': 'Bebas+Neue',
  Montserrat: 'Montserrat:wght@400;700;900',
  'Libre Baskerville': 'Libre+Baskerville:wght@400;700',
}

// Render all pages per-request so published Sanity content is always current.
// Netlify's durable cache does not honor next-sanity's tag-based revalidation,
// which otherwise pins prerendered pages to build-time content.
export const dynamic = 'force-dynamic'

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  const [{data: theme}, {data: settings}] = await Promise.all([
    sanityFetch({query: siteThemeQuery, stega: false}),
    sanityFetch({query: settingsQuery, stega: false}),
  ])

  const headingFont = theme?.headingFont || 'Montserrat'
  const fontUrl = fontUrlMap[headingFont]

  const themeStyle = {
    '--font-heading': `"${headingFont}", sans-serif`,
    ...(theme?.colorPrimary ? {'--color-primary': theme.colorPrimary} : {}),
    ...(theme?.colorAccent ? {'--color-accent': theme.colorAccent} : {}),
    ...(theme?.colorInk ? {'--color-ink': theme.colorInk} : {}),
    ...(theme?.colorSurface ? {'--color-surface': theme.colorSurface} : {}),
  } as React.CSSProperties

  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} bg-surface text-ink`}
      style={themeStyle}
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
        <MotionConfig>
          <div className="min-h-screen pt-24">
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
            <StickyDonateBar
              enabled={settings?.stickyDonateEnabled}
              donateUrl={settings?.donateUrl}
              buttonText={settings?.donateButtonText}
              message={settings?.stickyDonateMessage}
            />
          </div>
        </MotionConfig>
        <SpeedInsights />
      </body>
    </html>
  )
}
