export function getImageUrl(path: string | null, size: string = 'original'): string {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getVidifyUrl(type: 'movie' | 'tv', id: number): string {
  if (type === 'movie') {
    return `https://player.vidify.top/embed/movie/${id}?autoplay=true&poster=true&chromecast=true`;
  }
  return `https://player.vidify.top/embed/tv/${id}/1/1?autoplay=true&poster=true&chromecast=true`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
