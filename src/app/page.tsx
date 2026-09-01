import type { Metadata } from 'next'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import { AboutSection } from '@/components/organisms/AboutSection'
import { ContactBanner } from '@/components/organisms/ContactBanner'
import { GalleryBento } from '@/components/organisms/GalleryBento'
import { HeroBrush } from '@/components/organisms/HeroBrush'
import { ProcessTimeline } from '@/components/organisms/ProcessTimeline'
import { ServicesGrid } from '@/components/organisms/ServicesGrid'
import { homeMetadata } from '@/lib/seo'

export const metadata: Metadata = homeMetadata()

/**
 * Home · Fase 2 complete.
 * All five main sections in place, connected by curved WaveDividers that
 * alternate the surface rhythm (paper → paper-soft → paper → green →
 * paper → green). The Hero's paper → paper-soft transition lives inside
 * the Hero itself so BrushTracing gets clipped along the curve.
 */
export default function HomePage() {
  return (
    <>
      <HeroBrush />

      <ServicesGrid />

      <WaveDivider from="paper-soft" to="paper" variant="wave" flip />

      <ProcessTimeline />

      <WaveDivider from="paper" to="green" variant="swell" />

      <GalleryBento />

      <WaveDivider from="green" to="paper" variant="swell" flip />

      <AboutSection />

      <WaveDivider from="paper" to="green" variant="arc" />

      <ContactBanner />
    </>
  )
}
