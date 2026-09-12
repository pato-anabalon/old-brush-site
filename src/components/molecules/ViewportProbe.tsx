'use client'

import { useEffect } from 'react'

/**
 * TEMPORARY diagnostic — remove once the iOS rotation bug is understood.
 *
 * Inert unless the URL carries `?probe=1`. Beacons viewport measurements
 * to a collector on port 3002 so we can see what the layout viewport
 * actually reports on a real device after an orientation change.
 */
const ENDPOINT = 'http://192.168.4.75:3002/'

export function ViewportProbe() {
  useEffect(() => {
    if (!window.location.search.includes('probe')) return

    const send = (label: string) => {
      const vv = window.visualViewport
      const heroCopy = document.querySelector('[data-hero-copy]')
      const diamonds = document.querySelector('[data-testid="home-hero-diamonds-wrap"]')
      const payload = {
        label,
        innerW: window.innerWidth,
        innerH: window.innerHeight,
        clientW: document.documentElement.clientWidth,
        clientH: document.documentElement.clientHeight,
        scrollW: document.documentElement.scrollWidth,
        screenW: window.screen.width,
        screenH: window.screen.height,
        dpr: window.devicePixelRatio,
        orient: window.screen.orientation?.type ?? 'n/a',
        vv: vv
          ? {
              w: Math.round(vv.width),
              h: Math.round(vv.height),
              scale: Number(vv.scale.toFixed(3)),
              offL: Math.round(vv.offsetLeft),
              pageL: Math.round(vv.pageLeft),
            }
          : null,
        mq: {
          sm: matchMedia('(min-width: 40rem)').matches,
          md: matchMedia('(min-width: 48rem)').matches,
          lg: matchMedia('(min-width: 64rem)').matches,
        },
        // The smoking gun: is the lg: 26vw cap applied to the hero copy?
        heroCopyMaxW: heroCopy ? getComputedStyle(heroCopy).maxWidth : null,
        heroCopyW: heroCopy ? Math.round(heroCopy.getBoundingClientRect().width) : null,
        diamondsW: diamonds ? Math.round(diamonds.getBoundingClientRect().width) : null,
        rootFontSize: getComputedStyle(document.documentElement).fontSize,
      }
      navigator.sendBeacon(ENDPOINT, JSON.stringify(payload))
    }

    send('load')
    const onOrient = () => {
      send('orientationchange')
      setTimeout(() => send('orientation+500ms'), 500)
      setTimeout(() => send('orientation+1500ms'), 1500)
    }
    let t: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => send('resize'), 250)
    }
    const onTap = () => send('TAP')

    window.addEventListener('orientationchange', onOrient)
    window.addEventListener('resize', onResize)
    document.addEventListener('dblclick', onTap)

    return () => {
      window.removeEventListener('orientationchange', onOrient)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('dblclick', onTap)
    }
  }, [])

  return null
}
