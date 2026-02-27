import { createServerFn } from '@tanstack/react-start'
import { db } from '../db/index'
import { artists, artistComments } from '../db/schema'
import { eq, or, ilike, desc } from 'drizzle-orm'
import { createArtistSchema, updateArtistSchema, createArtistCommentSchema } from '../utils/schemas'
import { z } from 'zod'

export const getArtists = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ q: z.string().optional() }))
  .handler(async ({ data }: { data: { q?: string } }) => {
    const { q } = data
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
  })

export const getArtistById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }: { data: { id: number } }) => {
    const { id } = data
    const result = await db
      .select()
      .from(artists)
      .where(eq(artists.id, id))
      .limit(1)
    
    if (result.length === 0) {
      throw new Error(`Artist ${id} not found`) // Or customize error handling
    }
    return result[0]
  })

export const createArtist = createServerFn({ method: 'POST' })
  .inputValidator(createArtistSchema)
  .handler(async ({ data }: { data: z.infer<typeof createArtistSchema> }) => {
    const result = await db.insert(artists).values(data).returning()
    return result[0]
  })

export const updateArtist = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number(), payload: updateArtistSchema }))
  .handler(async ({ data }: { data: { id: number; payload: z.infer<typeof updateArtistSchema> } }) => {
    const { id, payload } = data
    const result = await db
      .update(artists)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(artists.id, id))
      .returning()
    
    if (result.length === 0) {
        throw new Error(`Artist ${id} not found`)
    }
    return result[0]
  })

export const deleteArtist = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }: { data: { id: number } }) => {
    const { id } = data
    await db.delete(artistComments).where(eq(artistComments.artistId, id)) // clear comments first to avoid FK constraint error
    const result = await db.delete(artists).where(eq(artists.id, id)).returning()
    return result[0]
  })

export const getArtistComments = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ artistId: z.number() }))
  .handler(async ({ data }: { data: { artistId: number } }) => {
    const { artistId } = data
    return await db
      .select()
      .from(artistComments)
      .where(eq(artistComments.artistId, artistId))
      .orderBy(desc(artistComments.createdAt))
  })

export const createArtistComment = createServerFn({ method: 'POST' })
  .inputValidator(createArtistCommentSchema)
  .handler(async ({ data }: { data: z.infer<typeof createArtistCommentSchema> }) => {
    const result = await db.insert(artistComments).values(data).returning()
    return result[0]
  })
