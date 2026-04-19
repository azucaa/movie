import { useRef } from 'react';
import { Movie } from '@/types';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface MovieRowProps {
  title: string;
  movies: any[];
  type?: 'movie' | 'tv';
}

export default function MovieRow({ title, movies, type = 'movie' }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      rowRef.current.scrollTo({ 
        left: direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth,
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full mb-14">
      <div className="flex items-center justify-between px-4 md:px-12 mb-6">
        <h2 className="text-[20px] md:text-[24px] font-bold text-white tracking-tight flex items-center gap-2 cursor-pointer group">
          {title} <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </h2>
        <span className="text-zinc-400 text-[13px] font-medium hover:text-white transition-colors cursor-pointer flex items-center gap-1">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className="relative group/row">
        <button onClick={() => scroll('left')}
                className="absolute left-2 md:left-8 top-[45%] -translate-y-1/2 z-40 bg-[#1A1A1E]/90 border border-white/10 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 hover:bg-[#1A1A1E]">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => scroll('right')}
                className="absolute right-2 md:right-8 top-[45%] -translate-y-1/2 z-40 bg-[#1A1A1E]/90 border border-white/10 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 hover:bg-[#1A1A1E]">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        <div ref={rowRef}
             className="flex gap-4 md:gap-5 overflow-x-scroll scrollbar-hide px-4 md:px-12 pb-8 pt-2"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {movies.map((movie, index) => (
             <div key={`${movie.id}-${index}`} className="flex-none w-[160px] md:w-[220px]">
              <MovieCard movie={movie} index={index} type={type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
