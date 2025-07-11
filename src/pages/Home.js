import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { searchMovies } from './api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const YOUTUBE_API_KEY = 'AIzaSyCYzf6xD5xEFWeqA5Z43QMLHlJ8If7V0_U';
const trendingTitles = [
  "Oppenheimer", "The Batman", "John Wick", "Dune", "Avatar",
  "Spider-Man", "Barbie", "Inception", "The Dark Knight", "Interstellar"
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [trailers, setTrailers] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'Guest');
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (query.length > 2 && activeTab === 'search') {
      searchMovies(query, token)
        .then((data) => setMovies(data))
        .catch((error) => {
          console.error('Search failed:', error);
          if (error.response?.status === 401) {
            navigate('/login');
          }
        });
    } else {
      setMovies([]);
    }
  }, [query, token, activeTab, navigate]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const results = await Promise.all(
          trendingTitles.map(async (title) => {
            const res = await axios.get(`https://www.omdbapi.com/?apikey=936cabe1&t=${encodeURIComponent(title)}`);
            return res.data?.Response === "True" ? res.data : null;
          })
        );
        setTrendingMovies(results.filter(movie => movie !== null));
      } catch (error) {
        console.error("Failed to fetch trending movies", error);
      }
    };

    fetchTrending();
  }, []);

  const fetchTrailer = async (title) => {
    if (trailers[title]) return trailers[title];

    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(title + ' official trailer')}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`
      );
      const videoId = res.data.items[0]?.id?.videoId;
      const trailerUrl = `https://www.youtube.com/embed/${videoId}`;
      setTrailers(prev => ({ ...prev, [title]: trailerUrl }));
      return trailerUrl;
    } catch (err) {
      console.error('Trailer fetch error:', err);
      return null;
    }
  };

  const handleShowTrailer = async (movie) => {
    const trailerUrl = await fetchTrailer(movie.Title);
    if (trailerUrl) {
      window.open(trailerUrl, '_blank');
    }
  };

  const handleToggleFavorite = (movie) => {
    const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.imdbID !== movie.imdbID)
      : [...favorites, movie];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const displayedMovies = {
    trending: trendingMovies,
    search: movies,
    favorites: favorites
  }[activeTab];

  return (
    <div className="home-container">
      <div className="top-bar">
        <h1 className="logo">🎬 HMovies</h1>
        <div className="nav-tabs">
          <button onClick={() => setActiveTab('trending')} className={activeTab === 'trending' ? 'nav-btn active' : 'nav-btn'}>🔥 Trending</button>
          <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'nav-btn active' : 'nav-btn'}>🔍 Search</button>
          <button onClick={() => setActiveTab('favorites')} className={activeTab === 'favorites' ? 'nav-btn active' : 'nav-btn'}>❤️ Favorites</button>
        </div>
      </div>

      {/* Slide Settings Icon */}
      <button
        className="settings-icon"
        onClick={() => setShowSettings(prev => !prev)}
      >
        ⚙️
      </button>

      {/* Slide-out panel */}
      <div className={`settings-panel ${showSettings ? 'open' : 'closed'}`}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>👤 {username}</h3>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {activeTab === 'search' && (
        <SearchBar query={query} setQuery={setQuery} onSearch={(q) => setQuery(q)} />
      )}

      <h2 className="section-title">
        {activeTab === 'trending' ? '🔥 Trending Movies' : activeTab === 'search' ? '🎯 Search Results' : '❤️ Your Favorites'}
      </h2>

      <div className="movie-grid">
        {displayedMovies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onTrailerClick={() => handleShowTrailer(movie)}
            onFavoriteToggle={() => handleToggleFavorite(movie)}
            isFavorite={favorites.some(fav => fav.imdbID === movie.imdbID)}
          />
        ))}
      </div>
    </div>
  );
}
