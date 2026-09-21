import React from 'react';
import { SortOption } from '../types/news';
import { CATEGORIES_CONFIG } from '../data/mockData';
import { Sparkles, Flame, Clock, MessageSquare, SlidersHorizontal, Layers } from 'lucide-react';

interface SortAndFilterBarProps {
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  totalLoaded: number;
  maxAllowed: number;
}

export const SortAndFilterBar: React.FC<SortAndFilterBarProps> = ({
  sortOption,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  limit,
  onLimitChange,
  totalLoaded,
  maxAllowed = 30,
}) => {
  return (
    <div className="bg-stone-50 border-b border-stone-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Sorting Modes */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-stone-500" />
              排序：
            </span>

            {/* Smart Preference Recommendation */}
            <button
              id="sort-btn-recommend"
              onClick={() => onSortChange('recommend')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                sortOption === 'recommend'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>智能偏好优先</span>
            </button>

            {/* Hot Score */}
            <button
              id="sort-btn-hot"
              onClick={() => onSortChange('hot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${
                sortOption === 'hot'
                  ? 'bg-red-50 text-red-900 border border-red-300 shadow-xs font-semibold'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>综合热度榜</span>
            </button>

            {/* Latest */}
            <button
              id="sort-btn-latest"
              onClick={() => onSortChange('latest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${
                sortOption === 'latest'
                  ? 'bg-stone-800 text-white border border-stone-800 shadow-xs font-semibold'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>最新时间</span>
            </button>

            {/* Comments / Discussions */}
            <button
              id="sort-btn-comments"
              onClick={() => onSortChange('comments')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${
                sortOption === 'comments'
                  ? 'bg-blue-50 text-blue-900 border border-blue-300 shadow-xs font-semibold'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>互动讨论量</span>
            </button>
          </div>

          {/* Right: Category Chips & Limit Control */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            {/* Categories */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {CATEGORIES_CONFIG.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat-chip-${cat.id}`}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-stone-900 text-white font-medium'
                        : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Quantity Limit Indicator and Selector (Default 10, Max 30) */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-stone-200 text-xs shrink-0">
              <span className="text-stone-500 text-[11px]">条数：</span>
              {[10, 20, 30].map((num) => (
                <button
                  key={num}
                  id={`limit-choice-${num}-btn`}
                  onClick={() => onLimitChange(num)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-all ${
                    limit === num
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {num}条
                </button>
              ))}
              <span className="text-[10px] text-stone-500 font-mono pl-1 border-l border-stone-200">
                (已显{totalLoaded}/上限{maxAllowed})
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
