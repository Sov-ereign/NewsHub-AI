import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const summarizeArticle = async (articleContent: string, title: string): Promise<string> => {
  try {
    const prompt = `Summarize the following news article in exactly 3 clear bullet points. Focus on the most important facts and key takeaways:

Title: ${title}

Content: ${articleContent}

Please format your response as:
• [First key point]
• [Second key point]  
• [Third key point]`;

    const response = await axios.post<GeminiResponse>(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 200,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No summary generated');
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate article summary');
  }
};