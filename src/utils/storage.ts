import { Article, Summary } from '../types';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const ARTICLES_CACHE_KEY = 'news_articles_cache';
const SUMMARIES_KEY = 'article_summaries';

interface CacheEntry {
  data: Article[];
  timestamp: number;
  category: string;
}

export const getCachedArticles = (category: string): Article[] | null => {
  try {
    const cached = sessionStorage.getItem(`${ARTICLES_CACHE_KEY}_${category}`);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    const now = Date.now();

    if (now - entry.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(`${ARTICLES_CACHE_KEY}_${category}`);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error('Error reading cached articles:', error);
    return null;
  }
};

export const setCachedArticles = (category: string, articles: Article[]): void => {
  try {
    const entry: CacheEntry = {
      data: articles,
      timestamp: Date.now(),
      category,
    };
    sessionStorage.setItem(`${ARTICLES_CACHE_KEY}_${category}`, JSON.stringify(entry));
  } catch (error) {
    console.error('Error caching articles:', error);
  }
};

export const getSavedSummaries = (): Summary[] => {
  try {
    const summaries = localStorage.getItem(SUMMARIES_KEY);
    return summaries ? JSON.parse(summaries) : [];
  } catch (error) {
    console.error('Error reading saved summaries:', error);
    return [];
  }
};

export const saveSummary = (summary: Summary): void => {
  try {
    const summaries = getSavedSummaries();
    summaries.unshift(summary); // Add to beginning
    localStorage.setItem(SUMMARIES_KEY, JSON.stringify(summaries.slice(0, 50))); // Keep only 50 summaries
  } catch (error) {
    console.error('Error saving summary:', error);
  }
};

export const deleteSummary = (id: string): void => {
  try {
    const summaries = getSavedSummaries();
    const filtered = summaries.filter(s => s.id !== id);
    localStorage.setItem(SUMMARIES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting summary:', error);
  }
};