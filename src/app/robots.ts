import type { MetadataRoute } from 'next'
import { brand } from '@/lib/content'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/thank-you'] },
    ],
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  }
}
