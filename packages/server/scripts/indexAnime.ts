import { Anime } from "@kirby/types";
import axios from "axios";
import { db } from '../index';
import { animeGenresTable, animeTable, genresTable } from "../src/db/schema";
import { eq } from "drizzle-orm";

const ANILIST_URL = "https://graphql.anilist.co";
const PER_PAGE = 50;
const MAX_ANIME = 1000;

interface AniListResponse {
  data: {
    Page: {
      pageInfo: {
        hasNextPage: boolean;
      };
      media: Anime[];
    };
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(page: number): Promise<Anime[]> {
  const query = `
    query ($page: Int) {
      Page(page: $page, perPage: ${PER_PAGE}) {
        pageInfo {
          hasNextPage
        }
        media(type: ANIME, sort: SCORE_DESC) {
          id
          title {
            romaji
            english
          }
          seasonYear
          genres
          description
        }
      }
    }
  `;

  const response = await axios.post<AniListResponse>(
    ANILIST_URL,
    {
      query,
      variables: { page },
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data.data.Page.media;
}

async function fetch() {
  console.log("Fetching top 1000 anime");

  const genreCache = new Map<string, number>();

  let fetchedCount = 0;
  let page = 1;

  while (fetchedCount < MAX_ANIME) {
    console.log(`Fetching page ${page}...`);

    const animeList = await fetchPage(page);
    if (!animeList.length) break;

    for (const anime of animeList) {
      if (fetchedCount >= MAX_ANIME) break;

      const title =
        anime.title.english ??
        anime.title.romaji ??
        "Unknown Title";

      await db
        .insert(animeTable)
        .values({
          id: anime.id,
          name: title,
          seasonYear: anime.seasonYear ?? null,
          description: anime.description ?? "No description provided.",
        })
        .onConflictDoNothing();

      for (const genreName of anime.genres) {
        let genreId = genreCache.get(genreName);

        if (!genreId) {
          const existing = await db
            .select()
            .from(genresTable)
            .where(eq(genresTable.name, genreName))
            .limit(1);

          if (existing.length) {
            genreId = existing[0].id;
          } else {
            const inserted = await db
              .insert(genresTable)
              .values({ name: genreName })
              .returning({ id: genresTable.id });

            genreId = inserted[0].id;
          }

          genreCache.set(genreName, genreId);
        }

        await db
          .insert(animeGenresTable)
          .values({
            animeId: anime.id,
            genreId,
          })
          .onConflictDoNothing();
      }

      fetchedCount++;
      console.log(`Inserted: ${title}`);
    }

    page++;
    await sleep(400); // rate limit
  }

  console.log("Done fetching");
  process.exit(0);
}

fetch().catch((err) => {
  console.error("Fetching failed:", err);
  process.exit(1);
});