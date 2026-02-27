import { drizzle } from 'drizzle-orm/node-postgres'
import { config } from 'dotenv'
import { sql } from 'drizzle-orm'

import * as schema from './schema.ts'

const isNonProd =
  process.env.VERCEL_ENV !== 'production' || process.env.NODE_ENV !== 'production'

if (isNonProd) {
  // Ensure local development consistently uses `.env.local` first.
  config({ path: ['.env.local', '.env'], override: true })
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

if (isNonProd) {
  try {
    const parsed = new URL(databaseUrl)
    console.info('[db] using database', {
      host: parsed.hostname,
      port: parsed.port || '5432',
      database: parsed.pathname.replace('/', ''),
      user: parsed.username || 'unknown',
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'unknown',
    })
  } catch {
    console.warn('[db] DATABASE_URL is set but could not be parsed')
  }
}

export const db = drizzle(databaseUrl, { schema })

if (isNonProd && !(globalThis as { __dbProbeLogged?: boolean }).__dbProbeLogged) {
  ;(globalThis as { __dbProbeLogged?: boolean }).__dbProbeLogged = true
  void db
    .execute(sql`
      select
        current_database() as database_name,
        current_user as user_name,
        to_regclass('public.artists') as artists_table,
        to_regclass('public.artist_comments') as comments_table
    `)
    .then((result) => {
      const row = (result as { rows?: unknown[] }).rows?.[0]
      console.info('[db] runtime probe', row)
    })
    .catch((error) => {
      const err = error as { message?: string; code?: string }
      console.warn('[db] runtime probe failed', {
        message: err?.message,
        code: err?.code,
      })
    })
}
