export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface Summary {
  id: string;
  articleTitle: string;
  articleUrl: string;
  summary: string;
  createdAt: string;
}

export type NewsCategory = 'general' | 'business' | 'technology' | 'sports' | 'health' | 'entertainment' | 'science';

export interface LoadingState {
  articles: boolean;
  summary: boolean;
}

export interface ErrorState {
  articles: string | null;
  summary: string | null;
}