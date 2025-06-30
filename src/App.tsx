import React, { useState, useEffect, useCallback } from 'react';
import { Article, NewsCategory, LoadingState, ErrorState } from './types';
import { fetchTopHeadlines, searchArticles } from './services/newsAPI';
import { getCachedArticles, setCachedArticles } from './utils/storage';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import SummariesView from './components/SummariesView';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'summaries'>('home');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const [loading, setLoading] = useState<LoadingState>({
    articles: false,
    summary: false,
  });
  
  const [errors, setErrors] = useState<ErrorState>({
    articles: null,
    summary: null,
  });

  // Load articles for category
  const loadArticles = useCallback(async (category: NewsCategory, useCache = true) => {
    // Check cache first
    if (useCache) {
      const cachedArticles = getCachedArticles(category);
      if (cachedArticles) {
        setArticles(cachedArticles);
        return;
      }
    }

    setLoading(prev => ({ ...prev, articles: true }));
    setErrors(prev => ({ ...prev, articles: null }));

    try {
      const response = await fetchTopHeadlines(category);
      const validArticles = response.articles.filter(
        article => article.title && article.title !== '[Removed]'
      );
      
      setArticles(validArticles);
      setCachedArticles(category, validArticles);
    } catch (error) {
      setErrors(prev => ({ ...prev, articles: 'Failed to load articles. Please try again.' }));
    } finally {
      setLoading(prev => ({ ...prev, articles: false }));
    }
  }, []);

  // Search articles
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(prev => ({ ...prev, articles: true }));
    setErrors(prev => ({ ...prev, articles: null }));
    setIsSearchMode(true);
    setSearchQuery(query);

    try {
      const response = await searchArticles(query);
      const validArticles = response.articles.filter(
        article => article.title && article.title !== '[Removed]'
      );
      
      setArticles(validArticles);
    } catch (error) {
      setErrors(prev => ({ ...prev, articles: 'Failed to search articles. Please try again.' }));
    } finally {
      setLoading(prev => ({ ...prev, articles: false }));
    }
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((category: NewsCategory) => {
    if (category === activeCategory && !isSearchMode) return;
    
    setActiveCategory(category);
    setIsSearchMode(false);
    setSearchQuery('');
    loadArticles(category);
  }, [activeCategory, isSearchMode, loadArticles]);

  // Handle article click
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  // Handle article detail close
  const handleCloseDetail = () => {
    setSelectedArticle(null);
  };

  // Handle view change
  const handleViewChange = (view: 'home' | 'summaries') => {
    setCurrentView(view);
    if (view === 'home' && articles.length === 0) {
      loadArticles(activeCategory);
    }
  };

  // Handle retry
  const handleRetry = () => {
    if (isSearchMode && searchQuery) {
      handleSearch(searchQuery);
    } else {
      loadArticles(activeCategory, false);
    }
  };

  // Load initial articles
  useEffect(() => {
    loadArticles('general');
  }, [loadArticles]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        onSearch={handleSearch}
        isSearching={loading.articles}
      />

      <main className="pt-16">
        {currentView === 'home' ? (
          <>
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              isLoading={loading.articles}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Search Results Header */}
              {isSearchMode && searchQuery && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Search Results for "{searchQuery}"
                  </h2>
                  <button
                    onClick={() => handleCategoryChange(activeCategory)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Back to {activeCategory} news
                  </button>
                </div>
              )}

              {/* Articles List */}
              <ArticleList
                articles={articles}
                isLoading={loading.articles}
                error={errors.articles}
                onArticleClick={handleArticleClick}
                onRetry={handleRetry}
              />
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SummariesView />
          </div>
        )}

        {/* Article Detail Modal */}
        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={handleCloseDetail}
          />
        )}
      </main>
    </div>
  );
}

export default App;