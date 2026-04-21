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
