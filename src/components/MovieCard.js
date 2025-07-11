import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, onTrailerClick, onFavoriteToggle, isFavorite }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  const truncateTitle = (title) => {
    return title.length > 15 ? title.slice(0, 15) + '…' : title;
  };

  return (
    <div className="movie-card">
      <img src={movie.Poster} alt={movie.Title} onClick={handleCardClick} />
      <h3 onClick={handleCardClick}>{truncateTitle(movie.Title)}</h3>
      <div className="card-buttons">
        <button onClick={(e) => {
          e.stopPropagation();
          onTrailerClick(movie);
        }}>
          🎥 Trailer
        </button>
        <button onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle(movie);
        }}>
          {isFavorite ? '💔 Unfav' : '❤️ Fav'}
        </button>
      </div>
    </div>
  );
}
