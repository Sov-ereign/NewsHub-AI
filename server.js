// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// /api/news route
app.get('/api/news', async (req, res) => {
  const { category = 'general', country = 'us', pageSize = '20' } = req.query;
  const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing NEWS_API_KEY in environment variables.' });
  }

  const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news from NewsAPI.' });
  }
});

// /api/summarize route
app.post('/api/summarize', async (req, res) => {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const { article } = req.body;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment variables.' });
  }
  if (!article) {
    return res.status(400).json({ error: 'Missing article in request body.' });
  }

  try {
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiApiKey;
    const payload = {
      contents: [
        { parts: [ { text: `Summarize this news article in 3-4 sentences: ${article}` } ] }
      ]
    };
    const response = await axios.post(geminiUrl, payload);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to summarize article.' });
  }
});

// Export the app for deployment
module.exports = app;

// If run directly, start the server
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 