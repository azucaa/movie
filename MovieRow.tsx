import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { Play, Info, Star, Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  movies: Movie[];
}

export default function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % movies.length);
  const prevSlide = () => setCurrentIndex(prev => prev === 0 ? movies.length - 1 : prev - 1);

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-[#0B0B0C] mb-8 group">
      {movies.map((featured, index) => {
        const backdropUrl = getImageUrl(featured.backdrop_path, 'original');
        const isActive = index === currentIndex;

        return (
          <div 
            key={`${featured.id}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
          >
            <div className="absolute inset-0">
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out ${isActive ? 'scale-105' : 'scale-100'}`} 
                style={{ backgroundImage: `url(${backdropUrl})` }} 
              />
              {/* Gradient overlays to match the dark sleek cinematic feel */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/70 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-transparent z-10" />
            </div>

            <div className={`relative z-20 h-full flex flex-col justify-center px-6 md:px-16 w-full max-w-[800px] pt-16 transition-all duration-700 delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-semibold text-white border border-white/10 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /> {(featured.vote_average || 0).toFixed(1)}/10
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-semibold text-white border border-white/10 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-zinc-300" /> {(featured.release_date || featured.first_air_date)?.substring(0, 4) || '2023'}
                </span>
                {featured.media_type === 'tv' && (
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-semibold text-white border border-white/10 shadow-sm">
                    TV Series
                  </span>
                )}
              </div>

              <h1 className="text-[40px] md:text-[64px] font-[800] text-white leading-[1.1] tracking-tight mb-5 drop-shadow-sm line-clamp-2">
                {featured.title || featured.name}
              </h1>

              <p className="text-[16px] md:text-[20px] font-medium text-white leading-relaxed mb-8 max-w-[650px] drop-shadow-md line-clamp-3">
                {featured.overview}
              </p>

              <div className="flex items-center gap-4">
                <Link to={`/watch/${featured.media_type || 'movie'}/${featured.id}`}
                      className="bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-full font-semibold text-[14px] flex items-center gap-2 hover:bg-zinc-700 transition-all shadow-xl">
                  <Play fill="currentColor" className="w-4 h-4" />
                  Play
                </Link>
                <div className="flex items-center bg-zinc-800/80 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 shadow-xl">
                  <Link to={`/${featured.media_type || 'movie'}/${featured.id}`} 
                        className="p-1.5 hover:text-white text-zinc-300 transition-colors">
                    <Info className="w-4 h-4" />
                  </Link>
                  <div className="w-px h-4 bg-white/20 mx-1" />
                  <button className="p-1.5 hover:text-white text-zinc-300 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dots Navigation */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 left-6 md:left-16 z-30 flex items-center gap-2.5">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-10 h-1.5 bg-white' : 'w-2 h-1.5 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}

      {/* Arrow Navigation */}
      {movies.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}
