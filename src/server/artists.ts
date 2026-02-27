import { createServerFn } from '@tanstack/react-start'
import { db } from '../db/index'
import { artists, artistComments } from '../db/schema'
import { eq, or, ilike, desc, sql } from 'drizzle-orm'
import { createArtistSchema, updateArtistSchema, createArtistCommentSchema } from '../utils/schemas'
import { z } from 'zod'

const isNonProd =
  process.env.VERCEL_ENV !== 'production' || process.env.NODE_ENV !== 'production'

function logDbError(context: string, error: unknown) {
  if (!isNonProd) return
  const err = error as {
    message?: string
    code?: string
    detail?: string
    hint?: string
  }
  console.error(`[db] ${context} failed`, {
    message: err?.message,
    code: err?.code,
    detail: err?.detail,
    hint: err?.hint,
  })
}

function toClientDbError(error: unknown) {
  const err = error as { message?: string; code?: string }
  const errorCode = err?.code
  if (!isNonProd) {
    return new Error(errorCode ? `Database query failed (${errorCode})` : 'Database query failed')
  }
  const detail = [err?.code, err?.message].filter(Boolean).join(': ')
  return new Error(detail ? `Database query failed (${detail})` : 'Database query failed')
}

export const getArtists = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ q: z.string().optional() }))
  .handler(async ({ data }: { data: { q?: string } }) => {
    const { q } = data
    try {
      if (q) {
        return await db
          .select()
          .from(artists)
          .where(
            or(
              ilike(artists.name, `%${q}%`),
              ilike(artists.groupName, `%${q}%`)
            )
          )
      }
      return await db.select().from(artists)
    } catch (error) {
      logDbError('getArtists', error)
      throw toClientDbError(error)
    }
  })

export const getArtistById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }: { data: { id: number } }) => {
    const { id } = data
    let result
    try {
      result = await db
        .select()
        .from(artists)
        .where(eq(artists.id, id))
        .limit(1)
    } catch (error) {
      logDbError('getArtistById', error)
      throw toClientDbError(error)
    }
    
    if (result.length === 0) {
      throw new Error(`Artist ${id} not found`) // Or customize error handling
    }
    return result[0]
  })

export const createArtist = createServerFn({ method: 'POST' })
  .inputValidator(createArtistSchema)
  .handler(async ({ data }: { data: z.infer<typeof createArtistSchema> }) => {
    try {
      const result = await db.insert(artists).values(data).returning()
      return result[0]
    } catch (error) {
      logDbError('createArtist', error)
      throw toClientDbError(error)
    }
  })

export const updateArtist = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number(), payload: updateArtistSchema }))
  .handler(async ({ data }: { data: { id: number; payload: z.infer<typeof updateArtistSchema> } }) => {
    const { id, payload } = data
    let result
    try {
      result = await db
        .update(artists)
        .set({ ...payload, updatedAt: new Date() })
        .where(eq(artists.id, id))
        .returning()
    } catch (error) {
      logDbError('updateArtist', error)
      throw toClientDbError(error)
    }
    
    if (result.length === 0) {
        throw new Error(`Artist ${id} not found`)
    }
    return result[0]
  })

export const deleteArtist = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }: { data: { id: number } }) => {
    const { id } = data
    try {
      await db.delete(artistComments).where(eq(artistComments.artistId, id)) // clear comments first to avoid FK constraint error
      const result = await db.delete(artists).where(eq(artists.id, id)).returning()
      return result[0]
    } catch (error) {
      logDbError('deleteArtist', error)
      throw toClientDbError(error)
    }
  })

export const getArtistComments = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ artistId: z.number() }))
  .handler(async ({ data }: { data: { artistId: number } }) => {
    const { artistId } = data
    try {
      return await db
        .select()
        .from(artistComments)
        .where(eq(artistComments.artistId, artistId))
        .orderBy(desc(artistComments.createdAt))
    } catch (error) {
      logDbError('getArtistComments', error)
      throw toClientDbError(error)
    }
  })

export const createArtistComment = createServerFn({ method: 'POST' })
  .inputValidator(createArtistCommentSchema)
  .handler(async ({ data }: { data: z.infer<typeof createArtistCommentSchema> }) => {
    try {
      const result = await db.insert(artistComments).values(data).returning()
      return result[0]
    } catch (error) {
      logDbError('createArtistComment', error)
      throw toClientDbError(error)
    }
  })

export const getDbHealth = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      await db.execute(sql`select 1`)
      return { ok: true }
    } catch (error) {
      logDbError('getDbHealth', error)
      return { ok: false }
    }
  })
