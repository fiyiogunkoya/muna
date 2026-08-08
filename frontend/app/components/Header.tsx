import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import HeaderClient from './HeaderClient'

export default async function Header() {
  const {data: settings} = await sanityFetch({query: settingsQuery})

  const name = settings?.foundationName || settings?.title || 'Muna Foundation'

  return (
    <HeaderClient
      name={name}
      donateUrl={settings?.donateUrl}
      donateText={settings?.donateButtonText}
    />
  )
}
