CREATE TABLE "liked_anime" (
	"animeId" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "liked_anime" ADD CONSTRAINT "liked_anime_animeId_anime_id_fk" FOREIGN KEY ("animeId") REFERENCES "public"."anime"("id") ON DELETE cascade ON UPDATE no action;