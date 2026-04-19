import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, User, Menu, X, Rocket, Image as ImageIcon } from 'lucide-react';
import { tmdbClient } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/utils';
import { Movie } from '@/types';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setIsSearching(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await tmdbClient.get('/search/multi', {
          params: { query: searchQuery }
        });
        const filtered = data.results
          .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 5); // Limit to top 5 results for dropdown
        setSuggestions(filtered);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsMenuOpen(false);
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setSearchQuery('');
    setIsSearchActive(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 flex items-center justify-between shadow-2xl transition-all">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-white font-bold text-lg flex items-center gap-2">
          <Rocket className="w-5 h-5"/>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-zinc-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link to="/tv" className="hover:text-white transition-colors">Series</Link>
          <Link to="/anime" className="hover:text-white transition-colors">Discover</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:flex items-center" ref={searchContainerRef}>
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-transparent relative z-10">
            <Search className="w-4 h-4 text-zinc-400 cursor-pointer" onClick={() => setIsSearchActive(!isSearchActive)} />
            <input 
              type="text" 
              placeholder="Search movies, tv..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsSearchActive(true);
                if (searchQuery.trim().length >= 2) setShowSuggestions(true);
              }}
              className={`bg-transparent border-none text-sm text-white placeholder-zinc-500 transition-all duration-300 outline-none ${isSearchActive || searchQuery ? 'w-[160px] focus:w-[200px]' : 'w-0 focus:w-[200px]'}`} 
            />
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-[140%] right-0 w-[320px] bg-[#1A1A1E] border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col pt-2 pb-2 mt-2">
              {isSearching ? (
                <div className="flex justify-center py-6 text-zinc-500 text-sm">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  {suggestions.map((item) => {
                    const title = item.title || item.name;
                    const date = item.release_date || item.first_air_date;
                    const year = date ? date.split('-')[0] : '';
                    const imageUrl = item.poster_path ? getImageUrl(item.poster_path, 'w92') : null;

                    return (
                      <Link 
                        key={item.id} 
                        to={`/${item.media_type}/${item.id}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group"
                      >
                        {imageUrl ? (
                          <img src={imageUrl} alt={title} className="w-10 h-14 object-cover rounded-md bg-zinc-800" />
                        ) : (
                          <div className="w-10 h-14 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-600">
                             <ImageIcon className="w-5 h-5"/>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-[14px] font-semibold truncate group-hover:text-indigo-400 transition-colors">{title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 uppercase">
                              {item.media_type === 'tv' ? 'TV' : 'MOV'}
                            </span>
                            {year && <span className="text-zinc-500 text-[12px]">{year}</span>}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  <button 
                    onClick={() => handleSearch()} 
                    className="mt-2 text-[13px] text-zinc-400 hover:text-white font-medium text-center py-2 border-t border-white/5 transition-colors"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </>
              ) : (
                <div className="text-center py-6 text-zinc-500 text-sm">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4">
          <Bell className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
          <Settings className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
          <User className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
        </div>
        
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-[120%] left-0 w-full rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="Search..." value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-white/10 border border-white/10 rounded-full px-4 py-2 text-white outline-none text-sm placeholder-zinc-400" />
          </form>
          <div className="flex flex-col gap-3 text-zinc-300 font-medium px-2 text-sm">
            <Link to="/" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/movies" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Movies</Link>
            <Link to="/tv" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Series</Link>
            <Link to="/anime" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Discover</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
