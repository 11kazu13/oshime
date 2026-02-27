import { z } from 'zod'

export const artistSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  groupName: z.string().nullable(),
  memberColor: z.string().nullable(),
  birthday: z.string().nullable(), // date string
  birthplace: z.string().nullable(),
  mbti: z.string().nullable(),
  xAccount: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createArtistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  groupName: z.string().nullish(),
  memberColor: z.string().nullish(),
  birthday: z.string().nullish(),
  birthplace: z.string().nullish(),
  mbti: z.string().nullish(),
  xAccount: z.string().nullish(),
})

export const updateArtistSchema = createArtistSchema.partial()

export const artistCommentSchema = z.object({
  id: z.number(),
  artistId: z.number(),
  body: z.string().min(1, 'Comment body is required'),
  rating: z.number().int().min(1).max(5),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createArtistCommentSchema = z.object({
  artistId: z.number(),
  body: z.string().min(1, 'Comment body is required'),
  rating: z.number().int().min(1).max(5),
})
