/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TimeDimension, SortOption, NewsItem, UserProfile } from './types/news';
import {
  apiFetchNews,
  apiToggleBookmark,
  apiToggleLike,
  apiRecordHistory,
  apiUpdateUserPreferences,
  getStoredUserProfile,
} from './services/newsApi';
import { MOCK_NEWS_LIST, REGIONS } from './data/mockData';
import { Header } from './components/Header';
import { RegionPlatformNav } from './components/RegionPlatformNav';
import { SortAndFilterBar } from './components/SortAndFilterBar';
import { PersonalizedBanner } from './components/PersonalizedBanner';
import { NewsCard } from './components/NewsCard';
import { NewsDetailModal } from './components/NewsDetailModal';
import { UserProfileModal } from './components/UserProfileModal';
import {
  RefreshCw,
  ChevronDown,
  AlertCircle,
  Sparkles,
  Inbox,
  FilterX
} from 'lucide-react';

export default function App() {
  // Navigation & Filter States
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<TimeDimension>('daily');
  const [sortOption, setSortOption] = useState<SortOption>('recommend');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [limit, setLimit] = useState<number>(10); // default 10, max 30
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile());
  const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);

  // News Data State
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [updatedAt, setUpdatedAt] = useState<string>('');

  // News Detail Modal State
  const [activeNewsDetail, setActiveNewsDetail] = useState<NewsItem | null>(null);

  // Load News Handler
  const loadNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetchNews(
        {
          regionId: selectedRegionId,
          platformId: selectedPlatformId,
          timeframe,
          sort: sortOption,
          category: selectedCategory,
          limit,
          searchKeyword,
          onlyFavorites,
        },
        userProfile
      );

      setNewsList(res.items);
      setTotalCount(res.total);
      setHasMore(res.hasMore);
      setUpdatedAt(res.updatedAt);
    } catch (err) {
      console.error('Failed to fetch news', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedRegionId,
    selectedPlatformId,
    timeframe,
    sortOption,
    selectedCategory,
    limit,
    searchKeyword,
    onlyFavorites,
    userProfile,
  ]);

  // Trigger load when filter dependencies change
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Reset limit to 10 when switching region or timeframe
  const handleSelectRegion = (rId: string) => {
    setSelectedRegionId(rId);
    setSelectedPlatformId('all');
    setLimit(10); // reset to default 10 per region
  };

  const handleTimeframeChange = (tf: TimeDimension) => {
    setTimeframe(tf);
    setLimit(10);
  };

  // Load more handler (max 30 items)
  const handleLoadMore = () => {
    if (limit < 30) {
      setLimit((prev) => Math.min(30, prev + 10));
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async (newsId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = await apiToggleBookmark(newsId);
    setUserProfile(updated);
  };

  // Toggle Like
  const handleToggleLike = async (newsId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = await apiToggleLike(newsId);
    setUserProfile(updated);
  };

  // Open News Detail
  const handleSelectNews = async (item: NewsItem) => {
    setActiveNewsDetail(item);
    // Record reading history in user profile
    const updated = await apiRecordHistory(item.id);
    setUserProfile(updated);
  };

  // Update user preferences
  const handleUpdatePreferences = async (
    newPref: Partial<Pick<UserProfile, 'preferredRegions' | 'preferredPlatforms' | 'preferredCategories' | 'name' | 'bio'>>
  ) => {
    const updated = await apiUpdateUserPreferences(newPref);
    setUserProfile(updated);
  };

  // Helper to find related news for active detail
  const relatedNews = activeNewsDetail
    ? newsList.filter((n) => n.id !== activeNewsDetail.id).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* 1. Global Header */}
      <Header
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        userProfile={userProfile}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        onlyFavorites={onlyFavorites}
        onToggleOnlyFavorites={() => setOnlyFavorites((prev) => !prev)}
        onRefresh={loadNews}
        isLoading={isLoading}
      />

      {/* 2. Region & Platform Navigation Tabs */}
      <RegionPlatformNav
        selectedRegionId={selectedRegionId}
        onSelectRegion={handleSelectRegion}
        selectedPlatformId={selectedPlatformId}
        onSelectPlatform={(pId) => {
          setSelectedPlatformId(pId);
          setLimit(10);
        }}
        userProfile={userProfile}
      />

      {/* 3. Personalized Habits Banner */}
      <PersonalizedBanner
        userProfile={userProfile}
        onOpenPreferences={() => setIsUserProfileOpen(true)}
        isRecommendMode={sortOption === 'recommend'}
        onSwitchToRecommend={() => setSortOption('recommend')}
        onSwitchToNeutral={() => setSortOption('hot')}
      />

      {/* 4. Sorting & Filter Bar */}
      <SortAndFilterBar
        sortOption={sortOption}
        onSortChange={setSortOption}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        limit={limit}
        onLimitChange={setLimit}
        totalLoaded={newsList.length}
        maxAllowed={30}
      />

      {/* 5. Main News List Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Active Filters Summary & Refresh Indicator */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-stone-200 text-xs text-stone-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-stone-900">
              {selectedRegionId === 'all'
                ? '🌐 全球各地区热榜'
                : `${REGIONS.find((r) => r.id === selectedRegionId)?.flag} ${
                    REGIONS.find((r) => r.id === selectedRegionId)?.name
                  }`}
            </span>
            <span>•</span>
            <span className="text-stone-700">
              {timeframe === 'daily' ? '每日头条' : timeframe === 'weekly' ? '每周热点' : '每月精选'}
            </span>
            {onlyFavorites && (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                仅看收藏
              </span>
            )}
            {searchKeyword && (
              <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-medium">
                搜索：“{searchKeyword}”
              </span>
            )}
            <span className="text-stone-500 hidden sm:inline">
              (数据按{sortOption === 'recommend' ? '智能偏好' : sortOption === 'hot' ? '综合热度' : sortOption === 'latest' ? '发布时间' : '互动讨论'}排序)
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {updatedAt && (
              <span className="text-[11px] text-stone-500 hidden md:inline">
                更新于 {updatedAt}
              </span>
            )}
            <button
              id="refresh-news-list-btn"
              onClick={loadNews}
              disabled={isLoading}
              className="flex items-center gap-1 text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
              title="重新向模拟后端拉取最新头条数据"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? '同步中...' : '刷新'}</span>
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && newsList.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-stone-200 p-5 animate-pulse space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-stone-200 rounded" />
                  <div className="w-20 h-4 bg-stone-200 rounded" />
                  <div className="w-16 h-4 bg-stone-200 rounded" />
                </div>
                <div className="w-3/4 h-5 bg-stone-200 rounded" />
                <div className="w-full h-12 bg-stone-100 rounded" />
                <div className="flex justify-between pt-2 border-t border-stone-100">
                  <div className="w-24 h-4 bg-stone-200 rounded" />
                  <div className="w-16 h-4 bg-stone-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && newsList.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">未检索到对应头条新闻</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {onlyFavorites
                ? '您在当前筛选条件下暂无收藏的新闻。可关闭“仅看收藏”浏览更多内容。'
                : '请尝试切换地区、重置搜索关键词或调整分类标签。'}
            </p>
            <div className="pt-2">
              <button
                id="reset-filter-btn"
                onClick={() => {
                  setSelectedRegionId('all');
                  setSelectedPlatformId('all');
                  setSelectedCategory('all');
                  setSearchKeyword('');
                  setOnlyFavorites(false);
                  setLimit(10);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>重置所有筛选条件</span>
              </button>
            </div>
          </div>
        )}

        {/* News Cards Grid */}
        {newsList.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {newsList.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onSelect={handleSelectNews}
                  isBookmarked={userProfile.bookmarkedIds.includes(item.id)}
                  onToggleBookmark={handleToggleBookmark}
                  isLiked={userProfile.likedIds.includes(item.id)}
                  onToggleLike={handleToggleLike}
                  isRead={userProfile.readingHistory.some((h) => h.newsId === item.id)}
                />
              ))}
            </div>

            {/* Load More / Limit Expansion Area (Default 10, Max 30) */}
            <div className="pt-4 flex flex-col items-center justify-center space-y-2">
              {limit < 30 ? (
                <button
                  id="load-more-news-btn"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronDown className="w-4 h-4 text-stone-500 group-hover:translate-y-0.5 transition-transform" />
                  <span>
                    加载更多头条资讯 (当前已展示 {newsList.length} 条 / 最多可扩展至 30 条)
                  </span>
                </button>
              ) : (
                <div className="text-center py-2 px-4 bg-stone-200/60 rounded-full text-[11px] font-medium text-stone-600">
                  已达到该榜单最大呈现上限（30条新闻头条全量展示完毕）
                </div>
              )}
              <span className="text-[11px] text-stone-500">
                本期为纯前端 Mock 架构，全部数据结构对接后端通用 RESTful 标准
              </span>
            </div>
          </div>
        )}

      </main>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-stone-200 mt-auto py-6 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">全球多平台头条新闻</span>
            <span>•</span>
            <span>中国大陆 / 港澳台 / 新加坡 / 美国 / 德国等</span>
          </div>
          <p className="text-stone-500">
            按用户习惯优先展示 • 每日 / 每周 / 每月跨维度资讯聚合平台
          </p>
        </div>
      </footer>

      {/* 7. User Profile & Habits Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        userProfile={userProfile}
        onUpdatePreferences={handleUpdatePreferences}
        allNewsList={MOCK_NEWS_LIST}
        onSelectNews={handleSelectNews}
      />

      {/* 8. Full News Detail Modal */}
      <NewsDetailModal
        item={activeNewsDetail}
        onClose={() => setActiveNewsDetail(null)}
        isBookmarked={activeNewsDetail ? userProfile.bookmarkedIds.includes(activeNewsDetail.id) : false}
        onToggleBookmark={(id) => handleToggleBookmark(id)}
        isLiked={activeNewsDetail ? userProfile.likedIds.includes(activeNewsDetail.id) : false}
        onToggleLike={(id) => handleToggleLike(id)}
        relatedNews={relatedNews}
        onSelectRelated={handleSelectNews}
      />

    </div>
  );
}
