import { pgTable, bigserial, bigint, integer, text, date, timestamp, varchar, index } from 'drizzle-orm/pg-core';

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
