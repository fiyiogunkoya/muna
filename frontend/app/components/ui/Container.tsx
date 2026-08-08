import {clsx} from 'clsx'

type Props = {
  children: React.ReactNode
  size?: 'narrow' | 'default' | 'wide' | 'bleed'
  className?: string
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main'
}

const sizeMap: Record<NonNullable<Props['size']>, string> = {
  narrow: 'container-narrow',
  default: 'container',
  wide: 'container-wide',
  bleed: '',
}

export default function Container({
  children,
  size = 'default',
  className,
  as: Tag = 'div',
}: Props) {
  return <Tag className={clsx(sizeMap[size], className)}>{children}</Tag>
}
