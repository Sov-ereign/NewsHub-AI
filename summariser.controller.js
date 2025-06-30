const axios = require('axios');

const summarizeArticle = async (req, res) => {
  try {
    const prompt = `Summarise the following article in 3 bullet points: ${req.body.text}`;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }
    );
    res.status(200).json({ summary: response.data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to summarize article.' });
  }
};

module.exports = { summarizeArticle };