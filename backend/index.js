const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const client = new MongoClient(MONGODB_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

connectDB();

const db = client.db('movieDB');
const usersCollection = db.collection('users');
const historyCollection = db.collection('searchHistory'); 


app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '❌ Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, password: hashedPassword });

        res.status(201).json({ message: '✅ User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Registration failed', error: error.message });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '❌ Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: '❌ Invalid credentials' });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: '❌ Login failed', error: error.message });
    }
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


app.get('/search', authenticateToken, async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: '❌ Query parameter is required' });
    }

    try {

        await historyCollection.insertOne({
            username: req.user.username,
            query,
            timestamp: new Date()
        });

        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`);
        const data = response.data;

        if (data.Response === 'True') {
            res.json(data.Search);
        } else {
            res.status(404).json({ error: data.Error || 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `❌ Error fetching data: ${error.message}` });
    }
});


app.get('/movie/:imdbID', authenticateToken, async (req, res) => {
    const imdbID = req.params.imdbID;

    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`);
        const data = response.data;

        if (data.Response === 'True') {
            res.json(data);
        } else {
            res.status(404).json({ error: data.Error || 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `❌ Error fetching movie details: ${error.message}` });
    }
});


app.get('/history', authenticateToken, async (req, res) => {
    try {
        const history = await historyCollection
            .find({ username: req.user.username })
            .sort({ timestamp: -1 })
            .limit(10)
            .toArray();

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: '❌ Error fetching history' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});