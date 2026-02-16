export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  genres: string[];
  description?: string;
}