import axios from 'axios';

export const summarizeArticle = async (articleContent: string, title: string): Promise<string> => {
  try {
    const response = await axios.post('/api/summarize', {
      text: `${title}\n\n${articleContent}`
    });
    if (response.data.summary) {
      return response.data.summary;
    } else {
      throw new Error('No summary generated');
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate article summary');
  }
};