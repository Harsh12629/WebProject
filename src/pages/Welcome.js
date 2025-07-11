import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100); 
    }, []);

    return (
        <div className={`welcome-page ${loaded ? 'loaded' : ''}`}>
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">Stream Without Limits</h1>
                    <p className="hero-subtitle">Watch top-rated movies, exclusive series, and more. Anytime. Anywhere.</p>
                    <div className="hero-buttons">
                        <button onClick={() => navigate('/login')} className="btn advanced primary-btn">Sign In</button>
                        <button onClick={() => navigate('/register')} className="btn advanced secondary-btn">Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
