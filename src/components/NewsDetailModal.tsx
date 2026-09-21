import React, { useState } from 'react';
import { NewsItem } from '../types/news';
import {
  X,
  Flame,
  MessageSquare,
  Clock,
  Bookmark,
  Heart,
  Share2,
  ExternalLink,
  Check,
  Type,
  Eye,
  Globe,
  ArrowLeft
} from 'lucide-react';

interface NewsDetailModalProps {
  item: NewsItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (newsId: string) => void;
  isLiked: boolean;
  onToggleLike: (newsId: string) => void;
  relatedNews: NewsItem[];
  onSelectRelated: (item: NewsItem) => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  item,
  onClose,
  isBookmarked,
  onToggleBookmark,
  isLiked,
  onToggleLike,
  relatedNews,
  onSelectRelated,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'xlarge':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-relaxed';
    }
  };

  const formatHotScore = (score: number) => {
    if (score >= 100000000) return `${(score / 100000000).toFixed(1)}亿`;
    if (score >= 10000) return `${(score / 10000).toFixed(0)}万`;
    return score.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Top Header Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-stone-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <button
              id="back-to-feed-btn"
              onClick={onClose}
              className="flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium px-2 py-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回列表</span>
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="font-semibold text-stone-800">{item.regionName}</span>
            <span className="text-stone-400">/</span>
            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium border border-stone-200">
              {item.platformName}
            </span>
            <span className="text-amber-600 font-bold">第{item.rank}名</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs">
              <button
                id="font-size-normal-btn"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded ${fontSize === 'normal' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600'}`}
                title="标准字号"
              >
                小
              </button>
              <button
                id="font-size-large-btn"
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded ${fontSize === 'large' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600'}`}
                title="中等字号"
              >
                中
              </button>
              <button
                id="font-size-xlarge-btn"
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded ${fontSize === 'xlarge' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600'}`}
                title="加大字号"
              >
                大
              </button>
            </div>

            {/* Like */}
            <button
              id="detail-like-btn"
              onClick={() => onToggleLike(item.id)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
              title={isLiked ? '取消点赞' : '点赞'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Bookmark */}
            <button
              id="detail-bookmark-btn"
              onClick={() => onToggleBookmark(item.id)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
              title={isBookmarked ? '取消收藏' : '收藏'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {/* Share */}
            <button
              id="detail-share-btn"
              onClick={handleShare}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-all cursor-pointer relative"
              title="分享新闻链接"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              {copied && (
                <span className="absolute -bottom-8 right-0 bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                  链接已复制
                </span>
              )}
            </button>

            {/* Close Button */}
            <button
              id="detail-close-btn"
              onClick={onClose}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto px-4 sm:px-8 py-6 flex-1 space-y-6">
          
          {/* Article Meta Bar */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap text-xs text-stone-600">
              <span className="bg-stone-100 text-stone-800 font-semibold px-2 py-0.5 rounded">
                {item.categoryLabel}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-red-600 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-red-500" />
                {formatHotScore(item.hotScore)} 热度指数
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-600">
                <Clock className="w-3.5 h-3.5" />
                发布于 {item.publishTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-600">
                <Eye className="w-3.5 h-3.5" />
                {formatHotScore(item.readCount)} 次阅读
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900 leading-tight tracking-tight">
              {item.title}
            </h1>

            {/* Author / Source Attribution */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600">
              <span>采编发布：{item.author || `${item.platformName}编辑部`}</span>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 hover:underline"
              >
                <span>前往源平台原网页</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Optional Hero Image */}
          {item.heroImage && (
            <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100 aspect-video max-h-80">
              <img
                src={item.heroImage}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Key Takeaways Box (30-second summary) */}
          {item.highlights && item.highlights.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>核心看点 / 30秒速览</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-stone-800 list-disc list-inside">
                {item.highlights.map((h, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary Lead Paragraph */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-stone-800 text-sm sm:text-base font-medium leading-relaxed italic">
            导读：{item.summary}
          </div>

          {/* Full Text Paragraphs */}
          <div className={`space-y-4 text-stone-800 ${getFontSizeClass()}`}>
            {item.content && item.content.length > 0 ? (
              item.content.map((p, idx) => (
                <p key={idx} className="indent-6 sm:indent-8">
                  {p}
                </p>
              ))
            ) : (
              <p className="indent-6 sm:indent-8">{item.summary}</p>
            )}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-stone-200 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-600 font-medium">标签热词：</span>
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-md transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Cross-Platform Stories */}
          {relatedNews && relatedNews.length > 0 && (
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-stone-700" />
                  <span>同期其他平台热榜推荐</span>
                </h4>
                <span className="text-xs text-stone-500">点击即刻切换阅读</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relatedNews.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1">
                      <span className="font-semibold text-stone-700">{rel.platformName}</span>
                      <span>•</span>
                      <span className="text-red-600 font-medium">第{rel.rank}位</span>
                    </div>
                    <p className="text-xs font-semibold text-stone-800 line-clamp-2 leading-snug">
                      {rel.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <span>数据同步自各平台公共头条热榜 • 模拟API实时聚合</span>
          <button
            id="modal-close-bottom-btn"
            onClick={onClose}
            className="px-3 py-1 bg-white border border-stone-200 rounded-md text-stone-700 hover:bg-stone-100 font-medium cursor-pointer"
          >
            完成阅读
          </button>
        </div>

      </div>
    </div>
  );
};
