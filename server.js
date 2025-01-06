const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const OPEN_WEATHER_KEY = '4fe24b355df769a67639a42b8aff0485'; 
const NEWS_API_KEY = 'a5bf1fd2e4dd4873b246d06e8d3b24e5';  
const TRIVIA_API_URL = 'https://uselessfacts.jsph.pl/random.json?language=en';

app.get('/api/weather', async (req, res) => {
    const { city } = req.query;
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_KEY}&units=metric`;
        const weatherResponse = await axios.get(weatherUrl);
        res.json(weatherResponse.data);
    } catch (error) {
        console.error('Weather API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.get('/api/news', async (req, res) => {
    const { city } = req.query;
    try {
        const newsUrl = `https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}`;
        const newsResponse = await axios.get(newsUrl);

        if (!newsResponse.data.articles || newsResponse.data.articles.length === 0) {
            return res.status(404).json({ error: 'No news found for this city' });
        }

        res.json(newsResponse.data.articles.slice(0, 5)); 
    } catch (error) {
        console.error('News API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});

app.get('/api/trivia', async (req, res) => {
    try {
        const triviaResponse = await axios.get(TRIVIA_API_URL);
        res.json(triviaResponse.data);
    } catch (error) {
        console.error('Trivia API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch trivia' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
