"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { brand } from "@/lib/content";

const SESSION_KEY = "ob_seen";

/**
 * Signal the Hero (or any other reveal-coordinated component) that
 * the preloader is done covering the viewport. Uses a CustomEvent on
 * window plus a global flag so late-mounting listeners still see the
 * "already revealed" state and don't hang waiting on an event that
 * has already fired.
 */
const REVEAL_EVENT = "ob:hero-reveal";
const markRevealed = () => {
  (window as unknown as { __obHeroRevealed?: boolean }).__obHeroRevealed = true;
  window.dispatchEvent(new CustomEvent(REVEAL_EVENT));
};

/**
 * Assets that must be in the browser cache before we reveal the site.
 * All of these are used above the fold (hero backdrop + cycled job-site
 * imagery) so a flash of missing content after the reveal would look
 * broken. Add extras conservatively — every entry extends the minimum
 * time the preloader is on screen for users on slow connections.
 */
const CRITICAL_ASSETS = [
  "/brand/logo-transparent.png",
  "/images/photo-5.jpg",
  "/images/photo-4.jpg",
  "/images/photo-9.jpg",
  "/images/photo-10.jpg",
  "/images/photo-2.jpg",
];
const MIN_DURATION_MS = 1100; // guarantees the reveal never feels rushed
const MAX_DURATION_MS = 5000; // fail-safe when an asset stalls

/**
 * Preloader · Old Brush.
 *
 * Full-screen green curtain with the real transparent logo centred and
 * a slim gold progress bar tracking the actual load state of the
 * assets above the fold. Curtain lifts once every critical asset has
 * settled AND the minimum display time has elapsed; a fail-safe timeout
 * closes it if the network hangs.
 *
 * Guards:
 *  - sessionStorage.ob_seen  → skip curtain, hide instantly on mount.
 *  - prefers-reduced-motion → same skip (respect the user's preference).
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const seen = window.sessionStorage.getItem(SESSION_KEY);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const skip = Boolean(seen) || reduced;

      const setSeen = () => {
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* private mode etc. — non-fatal */
        }
      };
      const releaseScroll = () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        root.style.pointerEvents = "none";
      };

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      if (skip) {
        gsap.set(root, { autoAlpha: 0 });
        releaseScroll();
        setSeen();
        // Defer so any coordinated listener (e.g. Hero) has a chance to
        // register before we dispatch. The global flag also covers the
        // opposite race — a listener that mounts after this fires.
        window.setTimeout(markRevealed, 0);
        return () => {
          releaseScroll();
        };
      }

      const logo = root.querySelector<HTMLImageElement>(".ob-pl-logo");
      const bar = root.querySelector<HTMLDivElement>(".ob-pl-bar");
      const fill = root.querySelector<HTMLDivElement>(".ob-pl-fill");
      if (!logo || !bar || !fill) return;

      // Prime initial hidden state.
      gsap.set(logo, { opacity: 0, scale: 0.94, transformOrigin: "50% 50%" });
      gsap.set(bar, { opacity: 0 });
      gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });

      // Entry: logo settles first, bar fades in slightly after.
      gsap.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "power3.out",
        delay: 0.05,
      });
      gsap.to(bar, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.35,
      });

      // Real preload tracking. Progress reflects how many assets have
      // resolved (either loaded or errored — a failed asset should not
      // block the curtain).
      const startTime = performance.now();
      let loadedCount = 0;
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;

        const tl = gsap.timeline({
          onComplete: () => {
            releaseScroll();
            setSeen();
          },
        });
        // Snap the bar to full so users see completion before the reveal.
        tl.to(fill, { scaleX: 1, duration: 0.28, ease: "power2.out" });
        // Signal the Hero to start its entry timeline at the exact
        // moment the curtain begins lifting — so the first hero pieces
        // sweep in behind the curtain and the big reveals (main diamond
        // dropping, smalls settling) play out on the uncovered paper.
        tl.call(markRevealed, undefined, "+=0.12");
        // Curtain reveal — collapse the box upward.
        tl.to(root, {
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          duration: 0.6,
          ease: "power4.inOut",
        });
        tl.set(root, { autoAlpha: 0 });
      };

      const paintProgress = () => {
        const target = loadedCount / CRITICAL_ASSETS.length;
        gsap.to(fill, { scaleX: target, duration: 0.35, ease: "power2.out" });
      };

      const checkComplete = () => {
        const allLoaded = loadedCount >= CRITICAL_ASSETS.length;
        const minElapsed = performance.now() - startTime >= MIN_DURATION_MS;
        if (allLoaded && minElapsed) finish();
      };

      const onSettle = () => {
        loadedCount += 1;
        paintProgress();
        checkComplete();
      };

      for (const src of CRITICAL_ASSETS) {
        const img = new window.Image();
        img.onload = onSettle;
        img.onerror = onSettle;
        img.src = src;
      }

      const minTimer = window.setTimeout(checkComplete, MIN_DURATION_MS);
      const maxTimer = window.setTimeout(finish, MAX_DURATION_MS);

      return () => {
        window.clearTimeout(minTimer);
        window.clearTimeout(maxTimer);
        releaseScroll();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-testid="preloader"
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{
        backgroundColor: "var(--color-ob-paper)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-10">
        {/* Real transparent brand logo — sits on the green curtain. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-transparent.png"
          alt={`${brand.name} · ${brand.tagline}`}
          className="ob-pl-logo h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64"
        />

        {/* Progress bar — thin gold rail that fills as the critical
            assets load. */}
        <div
          className="ob-pl-bar relative h-[2px] w-48 overflow-hidden sm:w-56"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--color-ob-gold) 22%, transparent)",
          }}
          role="progressbar"
          aria-hidden="true"
        >
          <div
            className="ob-pl-fill absolute inset-y-0 left-0 h-full w-full"
            style={{ backgroundColor: "var(--color-ob-gold)" }}
          />
        </div>
      </div>
    </div>
  );
}
