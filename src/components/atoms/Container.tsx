import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type ContainerWidth = 'narrow' | 'base' | 'wide' | 'full'

const widthMap: Record<ContainerWidth, string> = {
  narrow: 'max-w-[var(--container-narrow)]',
  base: 'max-w-[var(--container-base)]',
  wide: 'max-w-[var(--container-wide)]',
  full: 'max-w-none',
}

type Props = HTMLAttributes<HTMLDivElement> & {
  width?: ContainerWidth
}

export function Container({ width = 'base', className, children, ...rest }: Props) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-12',
        widthMap[width],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
