import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const { article, text } = req.body;
  const articleText = article || text;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment variables.' });
  }
  if (!articleText) {
    return res.status(400).json({ error: 'Missing article in request body.' });
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`;

    const prompt = `
You are an expert summarizer.

Your task: Summarize the following article into **exactly 3 bullet points**.
**Important rules**:
- Each point must begin with **"- "** (dash and space)
- **No paragraphs or extra explanation** allowed
- **No intro or outro text**, just 3 bullet points
- Format strictly as:

- Point 1  
- Point 2  
- Point 3

Do not break this format under any condition.

Article:
${articleText}
    `;

    const payload = {
      contents: [
        { parts: [ { text: prompt.trim() } ] }
      ],
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    };

    const response = await axios.post(geminiUrl, payload);

    let summary = '';
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      summary = response.data.candidates[0].content.parts[0].text;
    } else {
      summary = response.data;
    }

    // Fallback: Reformat to bullet points if needed
    if (summary && !summary.trim().startsWith('-')) {
      summary = summary
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => `- ${line.trim().replace(/^[-•*]\s*/, '')}`)
        .slice(0, 3)
        .join('\n');
    }

    res.json({ summary });

  } catch (error) {
    console.error('Error calling Gemini:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to summarize article.' });
  }
} 