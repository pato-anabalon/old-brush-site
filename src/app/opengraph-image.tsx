import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { brand } from '@/lib/content'

// Node runtime (not edge, per project convention) — needed for
// `node:fs` to read the logo and photo off disk below.
export const runtime = 'nodejs'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${brand.name} — ${brand.tagline}. Interior plastering and painting in Auckland, New Zealand.`

// Neither asset depends on request data, so read them once at module
// scope rather than per-request (see Next.js "Predictable values").
const logoData = await readFile(
  join(process.cwd(), 'public/brand/logo-white-transparent.png'),
  'base64',
)
const logoSrc = `data:image/png;base64,${logoData}`

const crewData = await readFile(
  join(process.cwd(), 'public/images/photo-9.jpg'),
  'base64',
)
const crewSrc = `data:image/jpeg;base64,${crewData}`

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#242F17',
        }}
      >
        {/* Left — brand mark on the green surface. */}
        <div
          style={{
            width: 460,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={logoSrc} width={340} height={340} alt="" />
        </div>

        {/* Gold seam between the two halves. */}
        <div style={{ width: 2, height: '100%', backgroundColor: '#9B762B' }} />

        {/* Right — real crew photo, vertically centred. */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={crewSrc}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  )
}
