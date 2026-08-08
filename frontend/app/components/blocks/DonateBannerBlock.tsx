import {PortableText, type PortableTextBlock} from 'next-sanity'
import DonateCallout from '@/app/components/sections/DonateCallout'

type Props = {
  block: {
    heading?: string | null
    body?: PortableTextBlock[] | null
    buttonText?: string | null
    tone?: 'light' | 'dark' | 'accent' | null
    resolvedDonateUrl?: string | null
  }
}

const toneMap = {
  light: 'light',
  dark: 'ink',
  accent: 'accent',
} as const

export default function DonateBannerBlock({block}: Props) {
  if (!block.resolvedDonateUrl) return null

  return (
    <DonateCallout
      donateUrl={block.resolvedDonateUrl}
      donateText={block.buttonText || 'Donate'}
      heading={block.heading || 'Support our work.'}
      body={
        block.body && block.body.length > 0 ? <PortableText value={block.body} /> : undefined
      }
      tone={toneMap[block.tone || 'dark']}
    />
  )
}
