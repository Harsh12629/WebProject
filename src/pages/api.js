
import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { username, password });
        return response.data.token;
    } catch (error) {
        throw error;
    }
};

export const searchMovies = async (query, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/search?query=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMovieDetails = async (imdbID, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${imdbID}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getSearchHistory = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/history`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
