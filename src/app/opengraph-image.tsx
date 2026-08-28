import { ImageResponse } from 'next/og'
import { brand } from '@/lib/content'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${brand.name} — ${brand.tagline}. Interior plastering and painting in Auckland, New Zealand.`

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#242F17',
          color: '#F5F1EA',
          padding: 80,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 40,
            border: '1px solid #9B762B',
            borderRadius: 2,
          }}
        />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 14,
            color: '#9B762B',
            textTransform: 'uppercase',
          }}
        >
          {brand.tagline}
        </div>
        <div
          style={{
            fontSize: 128,
            fontWeight: 500,
            letterSpacing: 4,
            marginTop: 24,
            lineHeight: 1,
          }}
        >
          {brand.name.toUpperCase()}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 32,
            alignItems: 'center',
            marginTop: 40,
            fontSize: 20,
            letterSpacing: 8,
            color: '#7B9685',
            textTransform: 'uppercase',
          }}
        >
          <span>AKL</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>NZ</span>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            fontSize: 20,
            letterSpacing: 3,
            color: '#A19079',
          }}
        >
          Interior plastering & painting · Auckland
        </div>
      </div>
    ),
    { ...size },
  )
}
