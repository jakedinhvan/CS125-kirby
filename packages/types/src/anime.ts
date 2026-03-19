export interface Anime {
  id: number;
  title: string;
  seasonYear: number;
  genres: string[];
  description?: string;
}

export interface Genre {
  id: number;
  name: string;
}