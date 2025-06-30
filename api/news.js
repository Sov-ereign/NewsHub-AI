import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
} 