import React from 'react';
import { Globe, User, Bookmark, Search, X, Sparkles } from 'lucide-react';
import { TimeDimension, UserProfile } from '../types/news';

interface HeaderProps {
  timeframe: TimeDimension;
  onTimeframeChange: (tf: TimeDimension) => void;
  searchKeyword: string;
  onSearchChange: (kw: string) => void;
  userProfile: UserProfile;
  onOpenUserProfile: () => void;
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  timeframe,
  onTimeframeChange,
  searchKeyword,
  onSearchChange,
  userProfile,
  onOpenUserProfile,
  onlyFavorites,
  onToggleOnlyFavorites,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
              <Globe className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-stone-900">全球头条</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300/60">
                  多平台汇聚
                </span>
              </div>
              <p className="text-xs text-stone-700 hidden sm:block">
                各国家与地区主流平台实时新闻风向标
              </p>
            </div>
          </div>

          {/* Timeframe Selector (Daily / Weekly / Monthly) */}
          <div className="hidden md:flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200">
            <button
              id="timeframe-daily-btn"
              onClick={() => onTimeframeChange('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                timeframe === 'daily'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              每日头条
            </button>
            <button
              id="timeframe-weekly-btn"
              onClick={() => onTimeframeChange('weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                timeframe === 'weekly'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              每周热榜
            </button>
            <button
              id="timeframe-monthly-btn"
              onClick={() => onTimeframeChange('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                timeframe === 'monthly'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              每月精选
            </button>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md justify-end">
            {/* Search Input */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
              <input
                id="global-news-search-input"
                type="text"
                value={searchKeyword}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜索标题、平台、地区或热点..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-stone-100/90 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white text-stone-900 placeholder:text-stone-500 transition-all"
              />
              {searchKeyword && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Bookmarks Quick Toggle */}
            <button
              id="quick-bookmarks-toggle-btn"
              onClick={onToggleOnlyFavorites}
              title="我的收藏新闻"
              className={`p-2 rounded-lg border transition-all flex items-center gap-1 text-xs font-medium ${
                onlyFavorites
                  ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${onlyFavorites ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span className="hidden lg:inline">{userProfile.bookmarkedIds.length}</span>
            </button>

            {/* User Profile Button */}
            <button
              id="user-profile-header-btn"
              onClick={onOpenUserProfile}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all bg-white"
            >
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="text-left hidden sm:block pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-stone-900 leading-none">{userProfile.name}</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </div>
                <span className="text-[10px] text-stone-600 leading-tight">偏好已定制</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Timeframe Bar */}
        <div className="flex md:hidden items-center justify-between pb-2.5 pt-1 border-t border-stone-100">
          <div className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200 w-full justify-between">
            <button
              id="mobile-tf-daily-btn"
              onClick={() => onTimeframeChange('daily')}
              className={`flex-1 py-1 text-xs font-medium rounded-md text-center transition-all ${
                timeframe === 'daily' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-700'
              }`}
            >
              每日头条
            </button>
            <button
              id="mobile-tf-weekly-btn"
              onClick={() => onTimeframeChange('weekly')}
              className={`flex-1 py-1 text-xs font-medium rounded-md text-center transition-all ${
                timeframe === 'weekly' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-700'
              }`}
            >
              每周热榜
            </button>
            <button
              id="mobile-tf-monthly-btn"
              onClick={() => onTimeframeChange('monthly')}
              className={`flex-1 py-1 text-xs font-medium rounded-md text-center transition-all ${
                timeframe === 'monthly' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-700'
              }`}
            >
              每月精选
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
