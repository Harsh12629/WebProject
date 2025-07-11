import React, { useEffect, useState } from 'react';
import NavBar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import './Favorites.css'; 

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
  }, []);

  const handleToggleFavorite = (movie) => {
    const updated = favorites.filter(fav => fav.imdbID !== movie.imdbID);
    localStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div className="favorites-container">
      <h2>❤️ Your Favorites</h2>
      <div className="movie-grid">
        {favorites.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={true}
            onFavoriteToggle={() => handleToggleFavorite(movie)}
            onTrailerClick={() => {}}
          />
        ))}
      </div>
      <NavBar />
    </div>
  );
}
