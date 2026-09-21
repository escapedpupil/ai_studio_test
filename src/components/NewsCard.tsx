import React from 'react';
import { NewsItem } from '../types/news';
import { Flame, MessageSquare, Clock, Bookmark, Heart, ChevronRight, Check } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
  onSelect: (item: NewsItem) => void;
  isBookmarked: boolean;
  onToggleBookmark: (newsId: string, e: React.MouseEvent) => void;
  isLiked: boolean;
  onToggleLike: (newsId: string, e: React.MouseEvent) => void;
  isRead: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  item,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  isLiked,
  onToggleLike,
  isRead,
}) => {
  // Format hot score in Chinese standard (万 / 亿)
  const formatHotScore = (score: number) => {
    if (score >= 100000000) return `${(score / 100000000).toFixed(1)}亿`;
    if (score >= 10000) return `${(score / 10000).toFixed(0)}万`;
    return score.toLocaleString();
  };

  const formatComments = (count: number) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
    return count.toLocaleString();
  };

  // Rank styling
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return 'bg-amber-500 text-white font-bold shadow-xs ring-2 ring-amber-300/60';
    }
    if (rank === 2) {
      return 'bg-slate-500 text-white font-bold ring-2 ring-slate-300/60';
    }
    if (rank === 3) {
      return 'bg-amber-700 text-white font-bold ring-2 ring-amber-500/40';
    }
    return 'bg-stone-100 text-stone-600 font-semibold border border-stone-200';
  };

  return (
    <article
      id={`news-card-${item.id}`}
      onClick={() => onSelect(item)}
      className={`group relative bg-white rounded-xl border transition-all duration-150 p-4 sm:p-5 flex flex-col justify-between cursor-pointer ${
        isRead ? 'border-stone-200 bg-stone-50/50' : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
      }`}
    >
      <div>
        {/* Card Header: Rank, Platform, Region, and Publishing Time */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Rank Badge */}
            <span
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 ${getRankBadge(
                item.rank
              )}`}
            >
              {item.rank}
            </span>

            {/* Platform Tag */}
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-800 border border-stone-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-600" />
              {item.platformName}
            </span>

            {/* Region Pill */}
            <span className="text-xs text-stone-600 font-medium flex items-center gap-1">
              <span>{item.regionName}</span>
            </span>

            {/* Category */}
            <span className="text-[11px] text-stone-500 bg-stone-100/80 px-1.5 py-0.5 rounded">
              {item.categoryLabel}
            </span>
          </div>

          {/* Time & Read Status */}
          <div className="flex items-center gap-2 text-stone-500 text-xs shrink-0">
            {isRead && (
              <span className="text-[11px] text-stone-500 flex items-center gap-0.5">
                <Check className="w-3 h-3 text-stone-500" />
                <span>已读</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-stone-500" />
              {item.publishTime}
            </span>
          </div>
        </div>

        {/* Article Title */}
        <h3 className={`text-base sm:text-lg font-bold leading-snug tracking-tight mb-2 group-hover:text-amber-700 transition-colors ${
          isRead ? 'text-stone-700' : 'text-stone-900'
        }`}>
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2 mb-3">
          {item.summary}
        </p>

        {/* Highlights Pill snippet if available */}
        {item.highlights && item.highlights.length > 0 && (
          <div className="mb-3.5 bg-stone-50 rounded-lg p-2.5 border border-stone-100 text-xs text-stone-700">
            <div className="flex items-center gap-1.5 font-semibold text-stone-800 mb-1 text-[11px]">
              <span className="w-1 h-3 rounded-full bg-amber-500" />
              <span>核心要点</span>
            </div>
            <p className="text-stone-600 line-clamp-1">
              • {item.highlights[0]}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer: Metrics & Actions */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
        {/* Hot score & comment counts */}
        <div className="flex items-center gap-3 text-stone-600">
          <div className="flex items-center gap-1 text-red-600 font-semibold" title="平台热度指数">
            <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>{formatHotScore(item.hotScore)}</span>
          </div>
          <div className="flex items-center gap-1 text-stone-600" title="讨论评论数">
            <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
            <span>{formatComments(item.commentCount)}</span>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Like */}
          <button
            id={`like-btn-${item.id}`}
            onClick={(e) => onToggleLike(item.id, e)}
            title={isLiked ? '取消点赞' : '点赞'}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isLiked ? 'text-rose-600 bg-rose-50' : 'text-stone-500 hover:text-rose-600 hover:bg-stone-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Bookmark */}
          <button
            id={`bookmark-btn-${item.id}`}
            onClick={(e) => onToggleBookmark(item.id, e)}
            title={isBookmarked ? '取消收藏' : '收藏'}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-amber-600 bg-amber-50'
                : 'text-stone-500 hover:text-amber-600 hover:bg-stone-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          {/* View Details Chevron */}
          <span className="p-1 text-stone-500 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </article>
  );
};
