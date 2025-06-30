export default async function handler(req: any, res: any) {
  const { category = 'general', country = 'us', pageSize = '20' } = req.query;
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing NEWS_API_KEY in environment variables.' });
  }

  const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news from NewsAPI.' });
  }
} 