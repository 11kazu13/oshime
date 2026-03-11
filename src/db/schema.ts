import { pgTable, bigserial, bigint, integer, text, date, timestamp, varchar, index, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const artists = pgTable('artists', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  birthday: date('birthday', { mode: 'string' }),
  birthplace: varchar('birthplace', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  groupName: varchar('group_name', { length: 255 }),
  mbti: varchar('mbti', { length: 255 }),
  memberColor: varchar('member_color', { length: 255 }),
  name: varchar('name', { length: 255 }),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  xAccount: varchar('x_account', { length: 255 }),
});

export const artistComments = pgTable('artist_comments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  artistId: bigint('artist_id', { mode: 'number' }).notNull().references(() => artists.id),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  rating: integer('rating').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('index_artist_comments_on_artist_id').on(table.artistId),
]);

export const tags = pgTable('tags', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const artistTags = pgTable('artist_tags', {
  artistId: bigint('artist_id', { mode: 'number' }).notNull().references(() => artists.id),
  tagId: bigint('tag_id', { mode: 'number' }).notNull().references(() => tags.id),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.artistId, table.tagId] })
]);

export const artistsRelations = relations(artists, ({ many }) => ({
  artistTags: many(artistTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  artistTags: many(artistTags),
}));

export const artistTagsRelations = relations(artistTags, ({ one }) => ({
  artist: one(artists, {
    fields: [artistTags.artistId],
    references: [artists.id],
  }),
  tag: one(tags, {
    fields: [artistTags.tagId],
    references: [tags.id],
  }),
}));
