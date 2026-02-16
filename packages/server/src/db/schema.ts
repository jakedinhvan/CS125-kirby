import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const animeTable = pgTable("anime", {
  id: integer().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  seasonYear: integer(),
  description: varchar({ length: 5000 }).notNull(),
});

export const genresTable = pgTable("genres", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const animeGenresTable = pgTable("anime_genres", {
  animeId: integer().notNull().references(() => animeTable.id),
  genreId: integer().notNull().references(() => genresTable.id),
});

export const likedAnimeTable = pgTable("liked_anime", {
  animeId: integer()
    .notNull()
    .references(() => animeTable.id, { onDelete: "cascade" })
    .primaryKey(),
});