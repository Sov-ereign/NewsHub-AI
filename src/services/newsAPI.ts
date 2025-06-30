import axios from 'axios';
import { NewsResponse, NewsCategory } from '../types';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// Check if API key is configured
if (!NEWS_API_KEY || NEWS_API_KEY === 'your_news_api_key_here') {
  console.warn('NewsAPI key is not configured. Please add your API key to the .env file.');
}

// Create axios instance
const newsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': NEWS_API_KEY,
  },
});

export const fetchTopHeadlines = async (
  category: NewsCategory = 'general',
  country: string = 'us'
): Promise<NewsResponse> => {
  try {
    const response = await axios.get('/api/news', {
      params: {
        category,
        country,
        pageSize: 20,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching headlines:', error);
    throw new Error('Failed to fetch news articles. Please check your API configuration.');
  }
};

export const searchArticles = async (
  query: string,
  sortBy: string = 'publishedAt'
): Promise<NewsResponse> => {
  try {
    if (!NEWS_API_KEY || NEWS_API_KEY === 'your_news_api_key_here') {
      throw new Error('NewsAPI key is not configured. Please add your API key to the .env file.');
    }

    const response = await newsAPI.get('/everything', {
      params: {
        q: query,
        sortBy,
        pageSize: 20,
        language: 'en',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 426) {
        throw new Error('Invalid or missing NewsAPI key. Please check your API key in the .env file.');
      }
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Please check your NewsAPI key.');
      }
    }
    console.error('Error searching articles:', error);
    throw new Error('Failed to search articles. Please check your API configuration.');
  }
};