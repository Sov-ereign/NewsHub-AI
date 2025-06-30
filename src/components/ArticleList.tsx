import React from 'react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { FileX } from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  onArticleClick: (article: Article) => void;
  onRetry?: () => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  isLoading,
  error,
  onArticleClick,
  onRetry
}) => {
  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading articles..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
        <FileX className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
        <p className="text-gray-500 text-center">
          Try searching for different keywords or selecting another category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <ArticleCard
          key={`${article.url}-${index}`}
          article={article}
          onClick={onArticleClick}
        />
      ))}
    </div>
  );
};

export default ArticleList;