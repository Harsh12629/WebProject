import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?apikey=936cabe1&i=${id}`);
        if (response.data.Response === "True") {
          setMovie(response.data);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError('Failed to fetch movie data');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <div className="loader">Loading movie details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="movie-detail">
      <img src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.png'} alt={movie.Title} />
      <div className="movie-content">
        <h2>{movie.Title}</h2>
        <p><span>Year:</span> {movie.Year}</p>
        <p><span>Genre:</span> {movie.Genre}</p>
        <p><span>Director:</span> {movie.Director}</p>
        <p><span>Actors:</span> {movie.Actors}</p>
        <p><span>Plot:</span> {movie.Plot}</p>
        <p><span>IMDB Rating:</span> ⭐ {movie.imdbRating}</p>
        <p><span>Language:</span> {movie.Language}</p>
        <p><span>Runtime:</span> {movie.Runtime}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
