import { clsx, type ClassValue } from 'clsx'

/**
 * Minimal classnames helper. Kept tiny on purpose — we do not need
 * tailwind-merge for the finite variant surface used by Old Brush.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
