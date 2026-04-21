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
