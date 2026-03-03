export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  seasonYear: number;
  genres: string[];
  description?: string;
}

export interface Genre {
  id: number;
  name: string;
}