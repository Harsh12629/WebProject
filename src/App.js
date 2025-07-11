import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Logout from './components/Logout';
import MovieDetail from './pages/MovieDetail';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={token ? <Navigate to="/home" /> : <Register />} />
        <Route path="/login" element={token ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/home" element={token ? <Home token={token} /> : <Navigate to="/login" />} />
        <Route path="/movie/:id" element={token ? <MovieDetail /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout setToken={setToken} />} />
        <Route path="*" element={<div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;