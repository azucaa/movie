import { Link } from 'react-router-dom';
import { Movie, TVShow } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { Play, Plus } from 'lucide-react';

interface MovieCardProps {
  movie: Movie | TVShow | any;
  index?: number;
  type?: 'movie' | 'tv';
  key?: string | number;
}

export default function MovieCard({ movie, type = 'movie' }: MovieCardProps) {
  const imageUrl = getImageUrl(movie.poster_path || movie.backdrop_path, 'w500');
  const title = movie.title || movie.name;
  const dateStr = movie.release_date || movie.first_air_date;
  const year = dateStr ? dateStr.split('-')[0] : '';
  const itemType = movie.media_type || type;

  return (
    <Link to={`/${itemType}/${movie.id}`}>
      <div className="group relative aspect-[2/3] w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg">
        <img src={imageUrl}
             alt={title} 
             className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
          {/* Action buttons centered */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500 delay-100">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 p-3 rounded-full text-white transition-all">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-full text-white transition-all">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Title and year at the bottom */}
          <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
             <h3 className="font-bold text-white text-[15px] leading-snug line-clamp-2">{title}</h3>
             <p className="text-[12px] font-medium text-zinc-400 mt-1.5">{year} • {itemType === 'tv' ? 'Series' : 'Movie'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
