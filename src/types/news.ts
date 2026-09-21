export type TimeDimension = 'daily' | 'weekly' | 'monthly';

export type SortOption = 'recommend' | 'hot' | 'latest' | 'comments';

export interface Platform {
  id: string;
  name: string;
  regionId: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  flag: string;
  description: string;
  platforms: Platform[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string[];
  highlights: string[];
  regionId: string;
  regionName: string;
  platformId: string;
  platformName: string;
  category: 'tech' | 'politics' | 'economy' | 'social' | 'entertainment' | 'culture';
  categoryLabel: string;
  publishTime: string; // ISO or human-readable format
  timeframe: TimeDimension;
  rank: number;
  hotScore: number;
  commentCount: number;
  readCount: number;
  sourceUrl: string;
  tags: string[];
  heroImage?: string;
  author?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  preferredRegions: string[];
  preferredPlatforms: string[];
  preferredCategories: string[];
  readingHistory: { newsId: string; readAt: string }[];
  bookmarkedIds: string[];
  likedIds: string[];
  stats: {
    totalReadToday: number;
    weeklyReadCount: number;
    totalBookmarks: number;
    lastActive: string;
  };
}

export interface NewsQueryParams {
  regionId?: string; // 'all' or specific regionId
  platformId?: string; // 'all' or specific platformId
  timeframe: TimeDimension;
  sort: SortOption;
  category?: string;
  limit: number; // default 10, max 30
  searchKeyword?: string;
  onlyFavorites?: boolean;
}

export interface NewsApiResponse {
  items: NewsItem[];
  total: number;
  hasMore: boolean;
  limit: number;
  timeframe: TimeDimension;
  updatedAt: string;
}
