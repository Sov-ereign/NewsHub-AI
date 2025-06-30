// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

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
  const { article, text, title, content } = req.body;
  // Support both old and new formats
  let articleTitle = title;
  let articleContent = content;
  if (!articleTitle || !articleContent) {
    // Try to extract from 'article' or 'text' if present
    if (article && typeof article === 'object') {
      articleTitle = article.title || '';
      articleContent = article.content || article.description || '';
    } else if (typeof text === 'object') {
      articleTitle = text.title || '';
      articleContent = text.content || text.description || '';
    } else if (typeof article === 'string') {
      articleContent = article;
    } else if (typeof text === 'string') {
      articleContent = text;
    }
  }
  const articleText = articleContent || articleTitle;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment variables.' });
  }
  if (!articleText) {
    return res.status(400).json({ error: 'Missing article in request body.' });
  }

  try {
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiApiKey;
    const prompt = `Summarize the following news article in exactly 3 clear bullet points. Each point must start with a bullet (•) and be on its own line. Do not include any introduction or extra text. Only output the 3 bullet points, nothing else.\n\nTitle: ${articleTitle || '[No Title]'}\n\nContent: ${articleContent || articleText}\n\nFormat:\n• [First key point]\n• [Second key point]\n• [Third key point]`;

    const payload = {
      contents: [
        { parts: [ { text: prompt } ] }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 200,
      }
    };
    const response = await axios.post(geminiUrl, payload);
    // Log the raw Gemini response for debugging
    let rawGeminiText = '';
    if (response.data && response.data.candidates && response.data.candidates[0]?.content?.parts[0]?.text) {
      rawGeminiText = response.data.candidates[0].content.parts[0].text;
    } else {
      rawGeminiText = JSON.stringify(response.data);
    }
    console.log('Raw Gemini response:', rawGeminiText);
    // Improved helper to enforce 3 bullet points robustly
    function enforceThreeBullets(text) {
      // Extract lines starting with • or -
      let bullets = text.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
      if (bullets.length === 3) return bullets.join('\n');
      // Try to extract numbered list
      let numbered = text.split('\n').filter(line => /^\s*\d+[.)]/.test(line.trim()));
      if (numbered.length === 3) return numbered.map(line => '• ' + line.replace(/^\s*\d+[.)]\s*/, '')).join('\n');
      // Split by sentence-ending punctuation or newlines
      let sentences = text.match(/[^.!?\n]+[.!?]+/g) || [];
      if (sentences.length < 3) {
        // Fallback: split by period
        sentences = text.split('. ').filter(Boolean);
        if (sentences.length < 3) {
          // Fallback: split into 3 roughly equal parts
          const len = text.length;
          const partLen = Math.ceil(len / 3);
          sentences = [
            text.slice(0, partLen),
            text.slice(partLen, 2 * partLen),
            text.slice(2 * partLen)
          ];
        }
      }
      let top3 = sentences.slice(0, 3).map(s => '• ' + s.trim().replace(/^[•-]/, '').trim());
      return top3.join('\n');
    }
    // Try to extract summary from Gemini response
    let summary = '';
    if (rawGeminiText) {
      summary = enforceThreeBullets(rawGeminiText);
    } else {
      summary = response.data;
    }
    console.log('Processed summary:', summary);
    res.json({ summary, rawGeminiText });
  } catch (error) {
    res.status(500).json({ error: 'Failed to summarize article.' });
  }
});

export default app;

// If run directly, start the server
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 