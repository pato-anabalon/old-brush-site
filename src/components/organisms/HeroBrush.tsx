"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { WaveDivider } from "@/components/atoms/WaveDivider";
import { BrushTracing } from "@/components/molecules/BrushTracing";
import { brand, hero } from "@/lib/content";

// Coordination event dispatched by the Preloader — see Preloader.tsx.
// The Hero waits for this signal instead of using a fixed delay, so its
// entry animations always sync with the curtain lift regardless of how
// long the preload takes.
const REVEAL_EVENT = "ob:hero-reveal";

// House imagery cycled through the diamond composition.
const HOUSE_IMAGES = [
  "/images/house-1.jpg",
  "/images/house-2.jpg",
  "/images/house-3.jpg",
  "/images/house-4.jpg",
  "/images/house-5.jpg",
] as const;
const CYCLE_MS = 5000;
const CROSSFADE_S = 0.5;

/**
 * HeroBrush · full-viewport editorial hero.
 *
 * Composition (back-to-front):
 *  1. Continuous line-tracing backdrop (delayed fade-in).
 *  2. Oversized diamond composition on the right — three rounded-square
 *     clip windows (rotated 45°) revealing a shared house-4.jpg. On
 *     desktop the wrapper is absolutely pinned to `inset-y-0 right-0`
 *     with `w-[62%]`, so the diamonds span the full viewport height and
 *     dominate the right two-thirds of the screen. On mobile the wrapper
 *     falls into normal flow beneath the copy as a square.
 *  3. Copy stack on the left, entering from the left in staggered order.
 *  4. Bottom wave overlay clipping the tracing into the paper-soft
 *     transition.
 *
 * Header is intentionally hidden while the hero is in view (see Header
 * organism); the primary CTA lives inside the hero itself.
 */
export function HeroBrush() {
  const rootRef = useRef<HTMLElement>(null);
  const clipMainId = useId();
  const clipS1Id = useId();
  const clipS2Id = useId();

  // Rotate through the house imagery every CYCLE_MS with a real cross-
  // fade. Two overlaid <g> layers hold the same 3-clip composition; on
  // each tick we swap the `href` of the currently-hidden layer to the
  // next source, then fade that layer IN while the visible one fades
  // OUT — both animations run simultaneously, so there's never a moment
  // where the diamonds go blank. Layer roles alternate every tick.
  // Skipped when the user prefers reduced motion (static first image).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const preloaded = HOUSE_IMAGES.map((src) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });

    // Start state: layer A visible with HOUSE_IMAGES[last]; layer B hidden.
    let currentIndex = HOUSE_IMAGES.length - 1;
    let visibleLayer: "a" | "b" = "a";

    const id = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % HOUSE_IMAGES.length;
      const nextSrc = HOUSE_IMAGES[currentIndex];
      if (!nextSrc) return;

      const hiddenSelector =
        visibleLayer === "a" ? ".ob-layer-b" : ".ob-layer-a";
      const visibleSelector =
        visibleLayer === "a" ? ".ob-layer-a" : ".ob-layer-b";

      const hiddenLayer =
        rootRef.current?.querySelector<SVGGElement>(hiddenSelector);
      const visibleLayerEl =
        rootRef.current?.querySelector<SVGGElement>(visibleSelector);
      if (!hiddenLayer || !visibleLayerEl) return;

      // Load the next source into the hidden layer's images before we
      // start fading it in — the images are preloaded so the swap is
      // instantaneous and no flash appears through the diamonds.
      hiddenLayer.querySelectorAll<SVGImageElement>("image").forEach((img) => {
        img.setAttribute("href", nextSrc);
      });

      // Simultaneous cross-fade.
      gsap.to(hiddenLayer, {
        opacity: 1,
        duration: CROSSFADE_S,
        ease: "sine.inOut",
      });
      gsap.to(visibleLayerEl, {
        opacity: 0,
        duration: CROSSFADE_S,
        ease: "sine.inOut",
      });

      visibleLayer = visibleLayer === "a" ? "b" : "a";
    }, CYCLE_MS);

    return () => {
      window.clearInterval(id);
      preloaded.forEach((img) => {
        img.src = "";
      });
    };
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Diamond rotation is applied via GSAP so we can pair it with the
      // svgOrigin at the rect's centre. This is done unconditionally so
      // shapes always render as diamonds — animation controls the entry
      // translation only.
      gsap.set(".ob-diamond-main", { rotation: 45, svgOrigin: "600 540" });
      gsap.set(".ob-diamond-s1", { rotation: 45, svgOrigin: "230 220" });
      gsap.set(".ob-diamond-s2", { rotation: 45, svgOrigin: "970 220" });

      if (reduced) return;

      // Prime hidden state for animated pieces.
      gsap.set("[data-hero-anim]", { opacity: 0, x: -48 });
      gsap.set(".ob-diamond-main", { y: 760 });
      gsap.set(".ob-diamond-s1", { y: -480 });
      gsap.set(".ob-diamond-s2", { y: -480 });
      gsap.set(".ob-hero-tracing", { opacity: 0 });

      let started = false;
      const start = () => {
        if (started) return;
        started = true;

        const tl = gsap.timeline();

        // 1 · Copy slides in from the left.
        tl.to(
          "[data-hero-anim]",
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
          },
          0,
        );

        // 2 · Main diamond rises from below.
        tl.to(
          ".ob-diamond-main",
          { y: 0, duration: 1.6, ease: "power3.out" },
          0.25,
        );

        // 3 · Smaller diamonds descend from above, staggered.
        tl.to(
          ".ob-diamond-s1",
          { y: 0, duration: 1.3, ease: "power3.out" },
          0.6,
        ).to(
          ".ob-diamond-s2",
          { y: 0, duration: 1.3, ease: "power3.out" },
          0.78,
        );

        // 4 · Line backdrop fades in last so it never competes with the
        // primary reveal.
        tl.to(
          ".ob-hero-tracing",
          { opacity: 1, duration: 1.0, ease: "power2.out" },
          1.5,
        );
      };

      // If the Preloader already flagged the reveal before this
      // component's effect ran, start immediately. Otherwise wait for
      // the coordination event; the fallback timeout guarantees the
      // hero eventually plays even if the signal is lost.
      const alreadyRevealed = (
        window as unknown as { __obHeroRevealed?: boolean }
      ).__obHeroRevealed;
      if (alreadyRevealed) {
        start();
        return;
      }

      window.addEventListener(REVEAL_EVENT, start, { once: true });
      const fallbackId = window.setTimeout(start, 3500);

      return () => {
        window.clearTimeout(fallbackId);
        window.removeEventListener(REVEAL_EVENT, start);
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-testid="home-hero-section"
      aria-labelledby="home-hero-heading"
      className="surface-paper relative isolate flex min-h-svh flex-col overflow-hidden pt-24 pb-28 lg:block lg:pt-28 lg:pb-32"
    >
      {/* Line-tracing backdrop, wrapped so the whole layer can fade in
          after the primary content has settled. */}
      <div className="ob-hero-tracing absolute inset-0">
        <BrushTracing
          intensity="subtle"
          pathSet="hero"
          data-testid="home-hero-backdrop"
        />
      </div>

      {/* Old Brush circular badge — preserves brand presence while the
          full navbar stays hidden until the user scrolls past the hero. */}
      <div className="absolute left-2 top-2 z-20 sm:left-2 sm:top-2 lg:left-2 lg:top-2">
        <Image
          src="/brand/logo-transparent.png"
          alt={`${brand.name} · ${brand.tagline}`}
          width={140}
          height={140}
          priority
          className="h-16 w-16 sm:h-40 sm:w-40 lg:h-[140px] lg:w-[140px]"
        />
      </div>

      {/* Diamond composition.
          - Mobile: flex item `order-2` (below copy), square aspect, full width.
          - Desktop: absolute inset-y-0 right-0 w-[62%] — full-height, dominant
            two-thirds of the viewport. */}
      <div
        className="ob-diamonds-wrap relative order-2 mt-10 aspect-square w-full lg:absolute lg:inset-y-0 lg:right-0 lg:order-none lg:mt-0 lg:aspect-auto lg:w-[70%]"
        data-testid="home-hero-diamonds-wrap"
      >
        <svg
          viewBox="0 0 1200 1000"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Victorian residential home in Auckland — reference imagery"
          data-testid="home-hero-diamonds"
        >
          <defs>
            <clipPath id={clipMainId}>
              <rect
                className="ob-diamond-main"
                x="300"
                y="200"
                width="900"
                height="900"
                rx="52"
                ry="52"
              />
            </clipPath>
            <clipPath id={clipS1Id}>
              <rect
                className="ob-diamond-s1"
                x="90"
                y="-90"
                width="300"
                height="500"
                rx="32"
                ry="32"
              />
            </clipPath>
            <clipPath id={clipS2Id}>
              <rect
                className="ob-diamond-s2"
                x="700"
                y="40"
                width="500"
                height="300"
                rx="32"
                ry="32"
              />
            </clipPath>
          </defs>

          {/* Layer A — initially visible with the last house image so the
              first paint matches the previously hard-coded shot. */}
          <g className="ob-layer-a" style={{ opacity: 1 }}>
            <image
              href={HOUSE_IMAGES[HOUSE_IMAGES.length - 1]}
              x="0"
              y="0"
              width="1200"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipMainId})`}
            />
            <image
              href={HOUSE_IMAGES[HOUSE_IMAGES.length - 1]}
              x="0"
              y="0"
              width="1200"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipS1Id})`}
            />
            <image
              href={HOUSE_IMAGES[HOUSE_IMAGES.length - 1]}
              x="0"
              y="0"
              width="1200"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipS2Id})`}
            />
          </g>
          {/* Layer B — initially hidden; the interval swaps its href to
              the next source before fading it in. */}
          <g className="ob-layer-b" style={{ opacity: 0 }}>
            <image
              href={HOUSE_IMAGES[0]}
              x="0"
              y="0"
              width="1200"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipMainId})`}
            />
            <image
              href={HOUSE_IMAGES[0]}
              x="0"
              y="0"
              width="1200"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipS1Id})`}
            />
            <image
              href={HOUSE_IMAGES[0]}
              x="0"
              y="0"
              width="1200"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipS2Id})`}
            />
          </g>
        </svg>
      </div>

      {/* Text column — bypasses Container on lg+ so the copy hugs the
          left edge rather than sitting inside the shared 3rem/48px
          container padding. Mobile keeps the standard responsive gutter. */}
      <div className="relative z-10 order-1 flex min-h-[calc(100svh-14rem)] items-center px-5 sm:px-8 lg:order-none lg:pl-25 lg:pr-0">
        <div className="flex w-full flex-col gap-6 lg:max-w-[26vw]">
          <p
            data-hero-anim
            className="ob-eyebrow"
            style={{ color: "var(--color-ob-gold)" }}
          >
            {hero.eyebrow}
          </p>

          <h1
            id="home-hero-heading"
            data-hero-anim
            className="max-w-[16ch] text-[var(--text-h1)] font-medium text-[var(--color-ob-green)]"
            style={{ lineHeight: 1.02, letterSpacing: "-0.015em" }}
          >
            {hero.headline.map((seg, i) =>
              seg.em ? (
                <em
                  key={i}
                  className="not-italic"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: "var(--color-ob-gold)",
                  }}
                >
                  {seg.text}
                </em>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </h1>

          <p
            data-hero-anim
            className="max-w-[42ch] text-[var(--text-lead)] text-[var(--color-ob-ink-soft)]"
          >
            {hero.lead}
          </p>

          <div data-hero-anim className="pt-2">
            <Button
              href={hero.primaryCta.href}
              variant="primary"
              size="lg"
              data-testid="home-hero-primary-cta"
            >
              {hero.primaryCta.label}
              <ArrowRight aria-hidden="true" size={16} />
            </Button>
          </div>

          <p
            data-hero-anim
            className="mt-4 text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-ob-ink-soft)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {hero.bottomLabel}
          </p>
        </div>
      </div>

      {/* Bottom wave overlay — clips the tracing along a curve into the
          next section's paper-soft surface. */}
      <WaveDivider
        from="paper"
        to="paper-soft"
        variant="wave"
        transparentFrom
        height={44}
        className="absolute inset-x-0 bottom-0"
        data-testid="home-hero-wave"
      />
    </section>
  );
}
