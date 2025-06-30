import React from 'react';
import { NewsCategory } from '../types';
import { 
  TrendingUp, 
  Briefcase, 
  Laptop, 
  Trophy, 
  Heart, 
  Film, 
  Atom 
} from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
  isLoading?: boolean;
}

const categories: { key: NewsCategory; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'general', label: 'General', icon: TrendingUp },
  { key: 'business', label: 'Business', icon: Briefcase },
  { key: 'technology', label: 'Technology', icon: Laptop },
  { key: 'sports', label: 'Sports', icon: Trophy },
  { key: 'health', label: 'Health', icon: Heart },
  { key: 'entertainment', label: 'Entertainment', icon: Film },
  { key: 'science', label: 'Science', icon: Atom },
];

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  isLoading = false 
}) => {
  return (
    <div className="bg-white border-b sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-4 scrollbar-hide">
          {categories.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => !isLoading && onCategoryChange(key)}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeCategory === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;