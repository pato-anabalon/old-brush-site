import { z } from 'zod'

/**
 * Old Brush · Environment validation and capability flags
 *
 * All integrations (Blob, Upstash Redis, Resend, Trello, Telegram) are
 * OPTIONAL in v1 — the site must build and run without any of them.
 *
 * When a capability is missing, features degrade *visibly*:
 * - Contact form still validates and returns 200, but the enquiry is
 *   dumped to a local file in dev and shows a banner in the UI.
 * - Never silently pretend a real integration ran.
 */

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Vercel Blob — attachments
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),

  // Upstash Redis — rate limiting + idempotency
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // Resend — email notifications
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM: z.string().email().optional(),
  RESEND_TO_INTERNAL: z.string().email().optional(),

  // Trello — optional lead card
  TRELLO_KEY: z.string().min(1).optional(),
  TRELLO_TOKEN: z.string().min(1).optional(),
  TRELLO_LIST_ID: z.string().min(1).optional(),

  // Telegram — optional internal notification
  TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
  TELEGRAM_CHAT_ID: z.string().min(1).optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('[old-brush] Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables — see logs above.')
}

export const env = parsed.data

/**
 * Which integrations are wired up. Used by API routes to decide whether
 * to run the real integration or fall back to visible degradation.
 */
export const capabilities = {
  blobUploads: Boolean(env.BLOB_READ_WRITE_TOKEN),
  rateLimiting: Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
  emailNotifications: Boolean(
    env.RESEND_API_KEY && env.RESEND_FROM && env.RESEND_TO_INTERNAL,
  ),
  trelloLeads: Boolean(env.TRELLO_KEY && env.TRELLO_TOKEN && env.TRELLO_LIST_ID),
  telegramAlerts: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
} as const

export type Capability = keyof typeof capabilities

export function missingCapabilities(): Capability[] {
  return (Object.keys(capabilities) as Capability[]).filter((k) => !capabilities[k])
}
