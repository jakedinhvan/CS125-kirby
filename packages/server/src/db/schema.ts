import { relations } from "drizzle-orm";
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
}, );

export const likedAnimeTable = pgTable("liked_anime", {
  animeId: integer()
    .notNull()
    .references(() => animeTable.id, { onDelete: "cascade" })
    .primaryKey(),
});

export const visitedPageTable = pgTable("visited_page", {
  animeId: integer()
    .notNull()
    .references(() => animeTable.id, { onDelete: "cascade" })
    .primaryKey(),
});

export const likedGenreTable = pgTable("liked_genre", {
  genreId: integer()
    .notNull()
    .references(() => genresTable.id, { onDelete: "cascade" })
    .primaryKey(),
});

export const animeRelations = relations(animeTable, ({ many }) => ({
  animeGenres: many(animeGenresTable),
}));

export const animeGenresRelations = relations(animeGenresTable, ({ one }) => ({
  anime: one(animeTable, {
    fields: [animeGenresTable.animeId],
    references: [animeTable.id],
  }),
  genre: one(genresTable, {
    fields: [animeGenresTable.genreId],
    references: [genresTable.id],
  }),
}));

export const genreRelations = relations(genresTable, ({ many }) => ({
  animeGenres: many(animeGenresTable),
}));