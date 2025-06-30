import React, { useState } from 'react';
import { Article, Summary } from '../types';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  User, 
  Building2, 
  Sparkles, 
  BookOpen,
  Copy,
  Check
} from 'lucide-react';
import { summarizeArticle } from '../services/geminiAPI';
import { saveSummary } from '../utils/storage';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleGenerateSummary = async () => {
    if (!article.content && !article.description) {
      setSummaryError('No content available to summarize');
      return;
    }

    setIsGeneratingSummary(true);
    setSummaryError('');

    try {
      const contentToSummarize = article.content || article.description || '';
      // Call backend directly
      const response = await axios.post('/api/summarize', {
        text: `${article.title}\n\n${contentToSummarize}`
      });
      const generatedSummary = response.data.summary;
      setSummary(generatedSummary);

      // Save to local storage
      const summaryData: Summary = {
        id: Date.now().toString(),
        articleTitle: article.title,
        articleUrl: article.url,
        summary: generatedSummary,
        createdAt: new Date().toISOString(),
      };
      saveSummary(summaryData);
    } catch (error) {
      setSummaryError('Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCopySummary = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 pr-8">Article Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {article.urlToImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{article.source.name}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>

          {/* Description */}
          {article.description && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-700 text-lg leading-relaxed">
                {article.description}
              </p>
            </div>
          )}

          {/* Content */}
          {article.content && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {article.content}
              </p>
            </div>
          )}

          {/* AI Summary Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Summary</h3>
              </div>
              {!summary && !isGeneratingSummary && (
                <button
                  onClick={handleGenerateSummary}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Summary
                </button>
              )}
            </div>

            {isGeneratingSummary && (
              <LoadingSpinner size="md" text="Generating AI summary..." />
            )}

            {summaryError && (
              <div className="text-red-600 bg-red-50 rounded-lg p-3">
                {summaryError}
              </div>
            )}

            {summary && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {summary}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Summary
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Read Full Article
            </a>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Back to Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;