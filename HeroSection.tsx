export interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  media_type?: string;
}

export interface Movie extends Media {}
export interface TVShow extends Media {}

export interface MovieDetail extends Media {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  tagline: string;
  status: string;
  budget?: number;
  revenue?: number;
  homepage: string;
  seasons?: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }[];
  recommendations?: {
    results: Movie[];
  };
}
