
import React, { useState } from 'react';
import { loginUser } from '../pages/api';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const token = await loginUser(username, password);


        localStorage.setItem('token', token);
        localStorage.setItem('username', username); 

        onLogin(token);
        navigate('/');
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
    }
};


    return (
        <div className="login-container">
    <h2>Sign In</h2>
    <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
    </form>
    <p>
        Don't have an account? <a href="/register">Register</a>
    </p>
</div>

    );
}

export default Login;