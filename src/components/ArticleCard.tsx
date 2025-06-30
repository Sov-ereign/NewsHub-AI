import React from 'react';
import { Article } from '../types';
import { Clock, ExternalLink, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClick = () => {
    onClick(article);
  };

  return (
    <article
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    >
      {/* Image */}
      <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <ExternalLink className="w-12 h-12 text-blue-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Source and Date */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {article.source.name}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Author */}
        {article.author && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>By {article.author}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;