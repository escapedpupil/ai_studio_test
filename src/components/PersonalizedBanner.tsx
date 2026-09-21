import React from 'react';
import { UserProfile } from '../types/news';
import { REGIONS } from '../data/mockData';
import { Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

interface PersonalizedBannerProps {
  userProfile: UserProfile;
  onOpenPreferences: () => void;
  isRecommendMode: boolean;
  onSwitchToRecommend: () => void;
  onSwitchToNeutral: () => void;
}

export const PersonalizedBanner: React.FC<PersonalizedBannerProps> = ({
  userProfile,
  onOpenPreferences,
  isRecommendMode,
  onSwitchToRecommend,
  onSwitchToNeutral,
}) => {
  const preferredRegionNames = userProfile.preferredRegions
    .map((rId) => {
      const found = REGIONS.find((r) => r.id === rId);
      return found ? `${found.flag} ${found.name}` : rId;
    })
    .slice(0, 4);

  return (
    <div className="bg-gradient-to-r from-amber-50/70 via-stone-50 to-orange-50/50 border-b border-amber-200/60 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        
        {/* Left: Personalized state */}
        <div className="flex items-center gap-2.5 text-xs text-stone-700">
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div>
            <span className="font-semibold text-stone-900 mr-1.5">
              {isRecommendMode ? '已启用用户偏好优先算法：' : '当前为全量探索模式：'}
            </span>
            <span className="text-stone-600">
              当前偏好常看地区 {preferredRegionNames.join('、')} 等
            </span>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {isRecommendMode ? (
            <button
              id="switch-to-all-neutral-btn"
              onClick={onSwitchToNeutral}
              className="text-xs text-stone-600 hover:text-stone-900 px-2 py-1 rounded hover:bg-stone-200/60 transition-colors"
            >
              切回全量客观榜
            </button>
          ) : (
            <button
              id="switch-to-recommend-btn"
              onClick={onSwitchToRecommend}
              className="text-xs text-amber-800 font-semibold hover:text-amber-950 px-2 py-1 rounded hover:bg-amber-100/70 transition-colors"
            >
              优先展示我的偏好
            </button>
          )}

          <button
            id="tune-user-preferences-btn"
            onClick={onOpenPreferences}
            className="flex items-center gap-1 text-xs bg-white text-stone-800 font-medium px-2.5 py-1 rounded-md border border-stone-200 hover:border-stone-300 hover:bg-stone-50 shadow-2xs transition-all"
          >
            <Sliders className="w-3 h-3 text-stone-500" />
            <span>调整偏好</span>
          </button>
        </div>

      </div>
    </div>
  );
};
