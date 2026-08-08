import Link from 'next/link'
import {ArrowRight} from 'lucide-react'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'

const platformLabel: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
}

const sitemap: {label: string; href: string}[] = [
  {label: 'About', href: '/about'},
  {label: 'Programs', href: '/programs'},
  {label: 'Stories', href: '/stories'},
  {label: 'Impact', href: '/impact'},
  {label: 'Gallery', href: '/gallery'},
  {label: 'Contact', href: '/contact'},
  {label: 'Get involved', href: '/get-involved'},
]

export default async function Footer() {
  const {data: settings} = await sanityFetch({query: settingsQuery})
  const name = settings?.foundationName || settings?.title || 'Muna Foundation'
  const donateUrl = settings?.donateUrl
  const donateText = settings?.donateButtonText || 'Donate'

  return (
    <footer className="bg-ink text-white mt-20">
      <div className="container-wide py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="font-[var(--font-heading,inherit)] text-3xl md:text-4xl tracking-tight">
              {name}
            </h3>
            {settings?.tagline && (
              <p className="mt-4 text-white/70 text-base leading-relaxed max-w-sm">
                {settings.tagline}
              </p>
            )}
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-5">
              Sitemap
            </h4>
            <ul className="space-y-3 text-sm">
              {sitemap.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/85 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-5">
              Follow
            </h4>
            <ul className="space-y-3 text-sm">
              {settings?.socialLinks?.map((link) =>
                link.url ? (
                  <li key={link._key}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/85 hover:text-white transition-colors"
                    >
                      {platformLabel[link.platform || ''] || link.platform}
                    </a>
                  </li>
                ) : null,
              )}
              {settings?.contactEmail && (
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-white/85 hover:text-white transition-colors"
                  >
                    Email us
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-5">
              Support our work
            </h4>
            <p className="text-base text-white/80 leading-relaxed mb-6">
              Every contribution funds programs that change lives.
            </p>
            {donateUrl && (
              <a
                href={donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent text-ink px-6 py-3 text-base font-medium hover:bg-accent/90 transition-colors"
              >
                {donateText}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50">
          <span>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </span>
          <span className="font-mono uppercase tracking-[0.18em]">Built with intention.</span>
        </div>
      </div>
    </footer>
  )
}
