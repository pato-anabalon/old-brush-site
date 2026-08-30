import Image, { type ImageProps } from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Shape = 'rounded' | 'arch' | 'arch-tr' | 'arch-tl' | 'blob'

const shapeStyles: Record<Shape, CSSProperties> = {
  rounded: { borderRadius: 'var(--radius-frame)' },
  arch: { borderRadius: 'var(--radius-arch)' },
  'arch-tr': { borderRadius: '20px 40% 20px 20px' },
  'arch-tl': { borderRadius: '40% 20px 20px 20px' },
  blob: { borderRadius: '38% 62% 55% 45% / 40% 45% 55% 60%' },
}

type FrameProps = {
  shape?: Shape
  aspect?: string
  className?: string
  frameClassName?: string
  border?: boolean
  shadow?: 'soft' | 'frame' | 'float' | 'none'
  children?: ReactNode
  style?: CSSProperties
  'data-testid'?: string
}

/**
 * ShapeFrame · editorial image container with a Moroccan/villa arch or blob mask.
 *
 * - Wrap `<ShapeFrame.Media …>` (next/image with `fill`) inside <ShapeFrame>.
 * - Use `shape` to pick a silhouette; borderRadius does the heavy lifting so
 *   images stay sharp and lazy-load cleanly.
 * - `shadow` maps to the editorial shadow tokens in globals.css.
 */
export function ShapeFrame({
  shape = 'rounded',
  aspect = '4/5',
  className,
  frameClassName,
  border = true,
  shadow = 'frame',
  children,
  style,
  ...rest
}: FrameProps) {
  const shadowVar =
    shadow === 'none'
      ? undefined
      : shadow === 'soft'
        ? 'var(--shadow-soft)'
        : shadow === 'float'
          ? 'var(--shadow-float)'
          : 'var(--shadow-frame)'

  return (
    <div
      data-testid={rest['data-testid']}
      className={cn('relative isolate overflow-hidden', className)}
      style={{
        aspectRatio: aspect,
        ...shapeStyles[shape],
        boxShadow: shadowVar,
        borderColor: border
          ? 'color-mix(in oklab, var(--color-ob-gold) 35%, transparent)'
          : undefined,
        borderWidth: border ? 1 : undefined,
        borderStyle: border ? 'solid' : undefined,
        ...style,
      }}
    >
      <div className={cn('absolute inset-0', frameClassName)}>{children}</div>
    </div>
  )
}

type MediaProps = Omit<ImageProps, 'fill'> & { fill?: boolean }

/**
 * Preconfigured next/image for use inside ShapeFrame. Uses `fill` and
 * `object-cover` by default so the shape mask is always exact.
 */
ShapeFrame.Media = function ShapeFrameMedia({
  alt,
  className,
  sizes = '(min-width: 1024px) 60vw, 100vw',
  ...props
}: MediaProps) {
  return (
    <Image
      alt={alt}
      fill
      sizes={sizes}
      className={cn('object-cover', className)}
      {...props}
    />
  )
}
