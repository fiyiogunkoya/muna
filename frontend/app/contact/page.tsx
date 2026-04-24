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
          <p className="mt-4 text-base lg:text-lg text-gray-600">Get in touch with {name}</p>
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
