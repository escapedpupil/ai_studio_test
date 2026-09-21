import React, { useState } from 'react';
import { UserProfile, NewsItem } from '../types/news';
import { REGIONS, CATEGORIES_CONFIG } from '../data/mockData';
import {
  X,
  User,
  Sliders,
  Bookmark,
  History,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  Mail,
  Edit3
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdatePreferences: (
    newPref: Partial<Pick<UserProfile, 'preferredRegions' | 'preferredPlatforms' | 'preferredCategories' | 'name' | 'bio'>>
  ) => void;
  allNewsList: NewsItem[];
  onSelectNews: (item: NewsItem) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdatePreferences,
  allNewsList,
  onSelectNews,
}) => {
  const [activeTab, setActiveTab] = useState<'preferences' | 'bookmarks' | 'history'>('preferences');
  
  // Local state for preferences editing
  const [selectedRegions, setSelectedRegions] = useState<string[]>(userProfile.preferredRegions);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(userProfile.preferredPlatforms);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(userProfile.preferredCategories);
  const [bio, setBio] = useState<string>(userProfile.bio);
  const [isSavedToast, setIsSavedToast] = useState(false);

  if (!isOpen) return null;

  // Toggle helpers
  const toggleRegion = (regId: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regId) ? prev.filter((r) => r !== regId) : [...prev, regId]
    );
  };

  const togglePlatform = (platId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platId) ? prev.filter((p) => p !== platId) : [...prev, platId]
    );
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleSave = () => {
    onUpdatePreferences({
      preferredRegions: selectedRegions,
      preferredPlatforms: selectedPlatforms,
      preferredCategories: selectedCategories,
      bio,
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2200);
  };

  const handleResetDefaults = () => {
    setSelectedRegions(['cn_mainland', 'cn_hk', 'sg', 'us']);
    setSelectedPlatforms(['weibo', 'thepaper', 'zaobao', 'scmp', 'nyt']);
    setSelectedCategories(['tech', 'economy', 'politics']);
  };

  // Resolve bookmarked items
  const bookmarkedNews = allNewsList.filter((n) => userProfile.bookmarkedIds.includes(n.id));

  // Resolve reading history
  const historyNews = userProfile.readingHistory
    .map((h) => {
      const found = allNewsList.find((n) => n.id === h.newsId);
      return found ? { item: found, readAt: h.readAt } : null;
    })
    .filter(Boolean) as { item: NewsItem; readAt: string }[];

  // Collect all platforms from regions
  const allPlatforms = REGIONS.flatMap((r) =>
    r.platforms.map((p) => ({ ...p, regionName: r.name, regionFlag: r.flag }))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with User Info summary */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 relative">
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-stone-900 rounded-full" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{userProfile.name}</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  智能推荐模型已就绪
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                <Mail className="w-3 h-3 text-stone-400" />
                <span>{userProfile.email}</span>
              </div>
              <p className="text-xs text-stone-300 mt-1 line-clamp-1 italic">
                “{userProfile.bio}”
              </p>
            </div>
          </div>

          {/* User Reading Statistics */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-800 text-center">
            <div className="bg-stone-800/80 rounded-lg p-2">
              <span className="text-xs text-stone-400 block">今日已读</span>
              <span className="text-base font-bold text-white">{userProfile.stats.totalReadToday} 篇</span>
            </div>
            <div className="bg-stone-800/80 rounded-lg p-2">
              <span className="text-xs text-stone-400 block">本周累计</span>
              <span className="text-base font-bold text-white">{userProfile.stats.weeklyReadCount} 篇</span>
            </div>
            <div className="bg-stone-800/80 rounded-lg p-2">
              <span className="text-xs text-stone-400 block">已收藏</span>
              <span className="text-base font-bold text-amber-400">{userProfile.bookmarkedIds.length} 篇</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50 px-4">
          <button
            id="tab-preferences-btn"
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>偏好设置 (影响推荐算法)</span>
          </button>

          <button
            id="tab-bookmarks-btn"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>我的收藏 ({userProfile.bookmarkedIds.length})</span>
          </button>

          <button
            id="tab-history-btn"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>阅读足迹 ({userProfile.readingHistory.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto p-5 flex-1 space-y-5">
          
          {/* TAB 1: Preferences Customizer */}
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  系统将依据您勾选的地区、平台和领域，在「智能偏好优先」模式下自动计算加权分，让您第一时间看到最关心的头条资讯。
                </p>
              </div>

              {/* 1. Preferred Regions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                  <span>1. 偏好常看地区 / 国家</span>
                  <span className="text-[11px] text-stone-600 font-normal">已选 {selectedRegions.length} 个</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {REGIONS.map((reg) => {
                    const isChecked = selectedRegions.includes(reg.id);
                    return (
                      <button
                        key={reg.id}
                        id={`pref-region-${reg.id}`}
                        onClick={() => toggleRegion(reg.id)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{reg.flag}</span>
                          <span>{reg.name}</span>
                        </span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Preferred Platforms */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                  <span>2. 关注核心媒体平台</span>
                  <span className="text-[11px] text-stone-600 font-normal">已选 {selectedPlatforms.length} 个</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {allPlatforms.map((plat) => {
                    const isChecked = selectedPlatforms.includes(plat.id);
                    return (
                      <button
                        key={plat.id}
                        id={`pref-platform-${plat.id}`}
                        onClick={() => togglePlatform(plat.id)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-amber-50 text-amber-950 border-amber-300 font-semibold'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{plat.regionFlag}</span>
                          <span className="truncate">{plat.name}</span>
                        </span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Preferred Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                  <span>3. 关注资讯领域</span>
                  <span className="text-[11px] text-stone-600 font-normal">已选 {selectedCategories.length} 个</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES_CONFIG.filter((c) => c.id !== 'all').map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        id={`pref-category-${cat.id}`}
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-stone-800 text-white border-stone-800 font-semibold'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isChecked && <Check className="w-3 h-3 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  id="reset-preferences-btn"
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>恢复推荐默认设置</span>
                </button>

                <div className="flex items-center gap-2">
                  {isSavedToast && (
                    <span className="text-xs text-emerald-600 font-semibold animate-fade-in flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      偏好已成功更新！
                    </span>
                  )}
                  <button
                    id="save-preferences-btn"
                    onClick={handleSave}
                    className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    保存偏好配置
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarkedNews.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  <p>暂无收藏的新闻，浏览时点击书签图标即可收录在此。</p>
                </div>
              ) : (
                bookmarkedNews.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => {
                      onSelectNews(news);
                      onClose();
                    }}
                    className="p-3 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800">{news.regionName}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 font-medium">{news.platformName}</span>
                      </div>
                      <span className="text-stone-400">{news.publishTime}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2">
                      {news.title}
                    </h4>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {historyNews.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  <History className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  <p>暂无阅读记录，点击任意新闻展开阅读后将自动记录。</p>
                </div>
              ) : (
                historyNews.map((h, idx) => (
                  <div
                    key={`${h.item.id}-${idx}`}
                    onClick={() => {
                      onSelectNews(h.item);
                      onClose();
                    }}
                    className="p-3 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
                        <span>{h.item.regionName}</span>
                        <span>•</span>
                        <span className="font-medium text-stone-700">{h.item.platformName}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                        {h.item.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-stone-400 shrink-0">{h.readAt}</span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
