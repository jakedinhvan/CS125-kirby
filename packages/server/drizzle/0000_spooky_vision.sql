CREATE TABLE "anime_genres" (
	"animeId" integer NOT NULL,
	"genreId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"seasonYear" integer,
	"description" varchar(5000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genres_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_animeId_anime_id_fk" FOREIGN KEY ("animeId") REFERENCES "public"."anime"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_genreId_genres_id_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;