import React, { useState, useEffect } from 'react';
import { Summary } from '../types';
import { getSavedSummaries, deleteSummary } from '../utils/storage';
import { 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Copy, 
  Check, 
  BookOpen,
  Sparkles
} from 'lucide-react';

const SummariesView: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [copiedId, setCopiedId] = useState<string>('');

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = () => {
    const savedSummaries = getSavedSummaries();
    setSummaries(savedSummaries);
  };

  const handleDeleteSummary = (id: string) => {
    deleteSummary(id);
    loadSummaries();
  };

  const handleCopySummary = async (summary: string, id: string) => {
    await navigator.clipboard.writeText(summary);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (summaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
        <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No summaries yet</h3>
        <p className="text-gray-500 text-center">
          Generate AI summaries from articles to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My AI Summaries</h2>
          <p className="text-gray-600">Your saved article summaries</p>
        </div>
      </div>

      <div className="grid gap-6">
        {summaries.map((summary) => (
          <div
            key={summary.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {summary.articleTitle}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(summary.createdAt)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleCopySummary(summary.summary, summary.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy summary"
                >
                  {copiedId === summary.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteSummary(summary.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete summary"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Summary Content */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {summary.summary}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <a
                href={summary.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Read Original Article
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummariesView;