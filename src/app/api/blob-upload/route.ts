import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { MAX_TOTAL_BYTES } from '@/lib/quote'

/**
 * Issues client tokens for direct browser → Vercel Blob uploads.
 *
 * Quote attachments (up to 20 MB total) never pass through this route —
 * Vercel Functions cap request bodies at 4.5 MB, so the browser uploads
 * straight to Blob storage and this handler only grants the token.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/*', 'application/pdf'],
        maximumSizeInBytes: MAX_TOTAL_BYTES,
        addRandomSuffix: true,
      }),
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 },
    )
  }
}
