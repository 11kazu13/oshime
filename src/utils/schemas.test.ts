import { describe, it, expect } from 'vitest'
import { createArtistSchema, createArtistCommentSchema } from './schemas'

describe('Zod Schemas Validation', () => {
  it('validates a correct artist payload', () => {
    const validArtist = {
      name: 'Sample Idol',
      groupName: 'Sample Group',
      memberColor: '#ff0000',
    }
    const result = createArtistSchema.safeParse(validArtist)
    expect(result.success).toBe(true)
  })

  it('fails if artist name is empty', () => {
    const invalidArtist = {
      name: '',
      groupName: 'Sample Group',
    }
    const result = createArtistSchema.safeParse(invalidArtist)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('validates a correct comment payload', () => {
    const validComment = {
      artistId: 1,
      body: '最高でした！',
      rating: 5,
    }
    const result = createArtistCommentSchema.safeParse(validComment)
    expect(result.success).toBe(true)
  })

  it('fails if comment rating is out of bounds', () => {
    const invalidComment = {
      artistId: 1,
      body: 'ちょっとイマイチ',
      rating: 10,
    }
    const result = createArtistCommentSchema.safeParse(invalidComment)
    expect(result.success).toBe(false)
  })
})
