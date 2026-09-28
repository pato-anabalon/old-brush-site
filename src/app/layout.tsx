import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { BackToTop } from '@/components/molecules/BackToTop'
import { Footer } from '@/components/organisms/Footer'
import { Header } from '@/components/organisms/Header'
import { Preloader } from '@/components/molecules/Preloader'
import { QuoteModalProvider } from '@/components/providers/QuoteModalProvider'
import { cormorant, lora } from '@/lib/fonts'
import { baseMetadata, localBusinessJsonLd } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = baseMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Required for env(safe-area-inset-*) to resolve to anything but 0 —
  // the mobile drawer and the quote modal both rely on those insets to
  // clear the notch and the home indicator.
  viewportFit: 'cover',
  themeColor: '#242F17',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-NZ"
      translate="no"
      className={`${lora.variable} ${cormorant.variable}`}
    >
      {/* suppressHydrationWarning at <body>: some browser extensions
          (e.g. ColorZilla injecting `cz-shortcut-listen="true"`) mutate
          <body> before React hydrates.
          `translate="no"` on <html> + the `google: notranslate` meta in
          `seo.ts` prevent Chrome mobile's auto-translate widget from
          mutating the tree deeper (a common source of hydration errors
          on mobile only). Users can still translate manually. */}
      <body suppressHydrationWarning>
        <QuoteModalProvider>
          {/* #ob-app is made `inert` while the quote modal is open, so the
              page behind it is unreachable by keyboard and screen reader. */}
          <div id="ob-app">
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-[var(--radius-sm)] focus:bg-[var(--color-ob-green)] focus:px-4 focus:py-2 focus:text-[var(--color-ob-paper)]"
            >
              Skip to content
            </a>
            <Preloader />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <BackToTop />
          </div>
        </QuoteModalProvider>

        {/* JSON-LD · LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
