import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'
type Surface = 'paper' | 'green' | 'sand' | 'lightgreen'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-medium tracking-wide uppercase text-[0.78rem] transition-[background-color,color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-brush)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ob-gold)] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

const sizeMap: Record<Size, string> = {
  sm: 'h-9 px-4',
  md: 'h-11 px-6',
  lg: 'h-12 px-8 text-[0.82rem]',
}

const primaryVariant =
  'bg-[var(--color-ob-gold)] text-[var(--color-ob-paper)] hover:bg-[var(--color-ob-gold-soft)] active:translate-y-[1px]'

const secondaryOn: Record<Surface, string> = {
  paper: 'border border-[var(--color-ob-green)] text-[var(--color-ob-green)] hover:bg-[var(--color-ob-green)] hover:text-[var(--color-ob-paper)]',
  green: 'border border-[var(--color-ob-paper)] text-[var(--color-ob-paper)] hover:bg-[var(--color-ob-paper)] hover:text-[var(--color-ob-green)]',
  sand: 'border border-[var(--color-ob-paper)] text-[var(--color-ob-paper)] hover:bg-[var(--color-ob-paper)] hover:text-[var(--color-ob-green)]',
  lightgreen: 'border border-[var(--color-ob-paper)] text-[var(--color-ob-paper)] hover:bg-[var(--color-ob-paper)] hover:text-[var(--color-ob-green)]',
}

const ghostOn: Record<Surface, string> = {
  paper: 'text-[var(--color-ob-green)] hover:text-[var(--color-ob-gold)]',
  green: 'text-[var(--color-ob-paper)] hover:text-[var(--color-ob-gold)]',
  sand: 'text-[var(--color-ob-paper)] hover:text-[var(--color-ob-green)]',
  lightgreen: 'text-[var(--color-ob-paper)] hover:text-[var(--color-ob-green)]',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  surface?: Surface
  children: ReactNode
  className?: string
  'data-testid'?: string
}

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
    href: string
    external?: boolean
  }

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    href?: undefined
  }

export type ButtonProps = ButtonAsLink | ButtonAsButton

function buildClasses(
  variant: Variant,
  size: Size,
  surface: Surface,
  className?: string,
): string {
  const variantClass =
    variant === 'primary'
      ? primaryVariant
      : variant === 'secondary'
        ? secondaryOn[surface]
        : ghostOn[surface]
  return cn(base, sizeMap[size], variantClass, className)
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    surface = 'paper',
    className,
    children,
  } = props

  if ('href' in props && props.href !== undefined) {
    const { href, external, variant: _v, size: _s, surface: _sf, className: _c, children: _ch, ...rest } =
      props
    if (external) {
      return (
        <a
          href={href}
          className={buildClasses(variant, size, surface, className)}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={buildClasses(variant, size, surface, className)} {...rest}>
        {children}
      </Link>
    )
  }

  const { variant: _v, size: _s, surface: _sf, className: _c, children: _ch, ...rest } = props
  return (
    <button className={buildClasses(variant, size, surface, className)} {...rest}>
      {children}
    </button>
  )
}
