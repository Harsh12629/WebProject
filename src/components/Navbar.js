import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; 

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="nav-bar">
      <button onClick={() => navigate('/')}>🎬 Home</button>
      <button onClick={() => navigate('/favorites')}>❤️ Favorites</button>
      <button onClick={() => navigate('/settings')}>⚙️ Settings</button>
    </div>
  );
}
