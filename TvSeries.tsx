import { useEffect, useState } from 'react';
import HeroSection from '@/components/movie/HeroSection';
import MovieRow from '@/components/movie/MovieRow';
import { tmdbClient } from '@/lib/tmdb';
import { Movie } from '@/types';

interface HomeData {
  featuredMovies: Movie[];
  nowPlaying: Movie[];
  popular: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
  anime: Movie[];
}

export default function Home() {
  const [data, setData] = useState<HomeData>({
    featuredMovies: [],
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
    anime: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getMovies() {
      try {
        const [trending, nowPlaying, popular, topRated, upcoming, anime] = await Promise.all([
          tmdbClient.get('/trending/all/day'),
          tmdbClient.get('/movie/now_playing'),
          tmdbClient.get('/movie/popular'),
          tmdbClient.get('/movie/top_rated'),
          tmdbClient.get('/movie/upcoming'),
          tmdbClient.get('/discover/tv', { params: { with_genres: '16', with_original_language: 'ja', sort_by: 'popularity.desc' } })
        ]);

        setData({
          // Fetch exact newest & most popular movies directly from TMDB's daily trending API
          featuredMovies: trending.data.results.slice(0, 5).map((m: any) => ({ ...m, media_type: m.media_type || 'movie' })),
          nowPlaying: nowPlaying.data.results.slice(0, 12),
          popular: popular.data.results.slice(0, 12),
          topRated: topRated.data.results.slice(0, 12),
          upcoming: upcoming.data.results.slice(0, 12),
          anime: anime.data.results.slice(0, 12),
        });
      } catch (error) {
        console.error("Error fetching movies", error);
      } finally {
        setLoading(false);
      }
    }
    getMovies();
  }, []);

  if (loading) {
     return <div className="text-white bg-[#0B0B0C] flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const { featuredMovies, nowPlaying, popular, topRated, upcoming, anime } = data;

  if (!featuredMovies || featuredMovies.length === 0) {
    return <div className="text-white text-center py-20 min-h-screen flex items-center justify-center flex-col">
      <h2 className="text-2xl font-bold mb-2">Error loading movies</h2>
      <p className="text-zinc-400">Please make sure your TMDB API key is set in the environment.</p>
    </div>;
  }

  return (
    <div className="pb-20">
      <HeroSection movies={featuredMovies} />
      <div className="pt-8 w-full bg-transparent">
        <MovieRow title="Populer Saat Ini" movies={popular} />
        <MovieRow title="Sedang Tayang" movies={nowPlaying} />
        <MovieRow title="Top Rating" movies={topRated} />
        <MovieRow title="Segera Tayang" movies={upcoming} />
        <MovieRow title="Anime Populer" movies={anime} type="tv" />
      </div>
    </div>
  );
}
