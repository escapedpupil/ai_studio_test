import React from 'react';
import { REGIONS } from '../data/mockData';
import { Region, UserProfile } from '../types/news';
import { Star, Layers, ChevronRight } from 'lucide-react';

interface RegionPlatformNavProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
  selectedPlatformId: string;
  onSelectPlatform: (platformId: string) => void;
  userProfile: UserProfile;
}

export const RegionPlatformNav: React.FC<RegionPlatformNavProps> = ({
  selectedRegionId,
  onSelectRegion,
  selectedPlatformId,
  onSelectPlatform,
  userProfile,
}) => {
  // Find current region object
  const currentRegion = REGIONS.find((r) => r.id === selectedRegionId);
  const preferredRegionsSet = new Set(userProfile.preferredRegions);
  const preferredPlatformsSet = new Set(userProfile.preferredPlatforms);

  // Available platforms: if "all", show a combined list of notable platforms or "all platforms"
  const availablePlatforms = currentRegion ? currentRegion.platforms : [];

  return (
    <div className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Regions Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 font-semibold uppercase tracking-wider text-[11px] shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            <span>地区：</span>
          </div>

          {/* All Regions (全量) */}
          <button
            id="region-tab-all"
            onClick={() => {
              onSelectRegion('all');
              onSelectPlatform('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedRegionId === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
            }`}
          >
            <span>🌐</span>
            <span>全量探索 (全部)</span>
          </button>

          {/* Specific Regions */}
          {REGIONS.map((region) => {
            const isSelected = selectedRegionId === region.id;
            const isPreferred = preferredRegionsSet.has(region.id);

            return (
              <button
                key={region.id}
                id={`region-tab-${region.id}`}
                onClick={() => {
                  onSelectRegion(region.id);
                  onSelectPlatform('all');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                <span className="text-sm">{region.flag}</span>
                <span>{region.name}</span>
                {isPreferred && (
                  <span
                    title="在您的常用偏好列表中"
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-amber-400' : 'bg-amber-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Platforms Sub-row */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2.5 scrollbar-none text-xs border-t border-stone-100 mt-2">
          <span className="text-stone-500 font-medium text-[11px] shrink-0 mr-1">平台风向：</span>

          {/* All Platforms */}
          <button
            id="platform-tab-all"
            onClick={() => onSelectPlatform('all')}
            className={`px-2.5 py-1 rounded-md text-xs transition-all shrink-0 cursor-pointer ${
              selectedPlatformId === 'all'
                ? 'bg-stone-800 text-white font-medium'
                : 'bg-stone-100/90 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            全部平台
          </button>

          {/* If a specific region is selected, show its platforms */}
          {currentRegion &&
            availablePlatforms.map((platform) => {
              const isSelected = selectedPlatformId === platform.id;
              const isPreferred = preferredPlatformsSet.has(platform.id);

              return (
                <button
                  key={platform.id}
                  id={`platform-tab-${platform.id}`}
                  onClick={() => onSelectPlatform(platform.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-stone-800 text-white font-medium shadow-xs'
                      : 'bg-stone-100/90 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span>{platform.name}</span>
                  {isPreferred && <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />}
                </button>
              );
            })}

          {/* If 'all' region is selected, show prominent platforms across regions */}
          {selectedRegionId === 'all' && (
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] italic shrink-0">
              <span>(全量模式汇聚全球主流媒体与舆情平台，可点击上方地区进入单平台精准筛选)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
