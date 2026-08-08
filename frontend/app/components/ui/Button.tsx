import {forwardRef} from 'react'
import {clsx} from 'clsx'
import {ArrowRight} from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'donate'
type Size = 'sm' | 'md' | 'lg'

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  withArrow?: boolean
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {as?: 'button'}

type ButtonAsAnchor = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {as: 'a'}

type Props = ButtonAsButton | ButtonAsAnchor

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

const variantMap: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-surface',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  donate: 'bg-primary text-white hover:bg-primary/90 shadow-lift',
}

const sizeMap: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(function Button(
  props,
  ref,
) {
  const {variant = 'primary', size = 'md', className, children, withArrow = false, ...rest} = props
  const cls = clsx(base, variantMap[variant], sizeMap[size], className)
  const content = (
    <>
      {children}
      {withArrow && <ArrowRight className="h-4 w-4" aria-hidden />}
    </>
  )

  if (rest && 'as' in rest && rest.as === 'a') {
    const {as: _ignored, ...anchorRest} = rest as ButtonAsAnchor
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={cls}
        {...anchorRest}
      >
        {content}
      </a>
    )
  }

  const {as: _ignored, ...buttonRest} = rest as ButtonAsButton
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...buttonRest}>
      {content}
    </button>
  )
})

export default Button
