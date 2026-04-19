/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TvSeries from './pages/TvSeries';
import Anime from './pages/Anime';
import DetailPage from './pages/DetailPage';
import WatchPage from './pages/Watch';
import SearchPage from './pages/Search';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="tv" element={<TvSeries />} />
          <Route path="anime" element={<Anime />} />
          <Route path="movie/:id" element={<DetailPage />} />
          <Route path="tv/:id" element={<DetailPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
        <Route path="/watch/:type/:id" element={<WatchPage />} />
      </Routes>
    </Router>
  );
}
