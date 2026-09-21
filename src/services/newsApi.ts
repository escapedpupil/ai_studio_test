import { NewsApiResponse, NewsItem, NewsQueryParams, UserProfile } from '../types/news';
import { REGIONS, INITIAL_USER_PROFILE, generateExpandedNews } from '../data/mockData';

const USER_STORAGE_KEY = 'global_headlines_user_profile';

// Get user profile with localStorage fallback
export function getStoredUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return INITIAL_USER_PROFILE;
}

// Save user profile
export function saveStoredUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock Backend API: GET /api/news
 */
export async function apiFetchNews(params: NewsQueryParams, userProfile?: UserProfile): Promise<NewsApiResponse> {
  await delay(180); // simulate realistic async API latency

  const activeUser = userProfile || getStoredUserProfile();
  const timeframe = params.timeframe || 'daily';
  const targetRegionId = params.regionId || 'all';

  // Gather dataset
  let allItems: NewsItem[] = [];

  if (targetRegionId === 'all') {
    // Collect from each region
    for (const reg of REGIONS) {
      const regItems = generateExpandedNews(reg.id, timeframe);
      allItems.push(...regItems);
    }
  } else {
    allItems = generateExpandedNews(targetRegionId, timeframe);
  }

  // Filter by platform if specified
  if (params.platformId && params.platformId !== 'all') {
    allItems = allItems.filter((item) => item.platformId === params.platformId);
  }

  // Filter by category if specified
  if (params.category && params.category !== 'all') {
    allItems = allItems.filter((item) => item.category === params.category);
  }

  // Filter by search keyword
  if (params.searchKeyword && params.searchKeyword.trim() !== '') {
    const kw = params.searchKeyword.toLowerCase().trim();
    allItems = allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) ||
        item.summary.toLowerCase().includes(kw) ||
        item.platformName.toLowerCase().includes(kw) ||
        item.regionName.toLowerCase().includes(kw) ||
        item.tags.some((t) => t.toLowerCase().includes(kw))
    );
  }

  // Filter by only favorites if toggled
  if (params.onlyFavorites) {
    const bookmarkedSet = new Set(activeUser.bookmarkedIds);
    allItems = allItems.filter((item) => bookmarkedSet.has(item.id));
  }

  // Sorting
  if (params.sort === 'recommend') {
    // Calculate recommendation score based on user preferences
    const prefRegions = new Set(activeUser.preferredRegions);
    const prefPlatforms = new Set(activeUser.preferredPlatforms);
    const prefCategories = new Set(activeUser.preferredCategories);

    allItems.sort((a, b) => {
      let scoreA = a.hotScore;
      let scoreB = b.hotScore;

      if (prefRegions.has(a.regionId)) scoreA += 5000000;
      if (prefRegions.has(b.regionId)) scoreB += 5000000;

      if (prefPlatforms.has(a.platformId)) scoreA += 3000000;
      if (prefPlatforms.has(b.platformId)) scoreB += 3000000;

      if (prefCategories.has(a.category)) scoreA += 2000000;
      if (prefCategories.has(b.category)) scoreB += 2000000;

      return scoreB - scoreA;
    });
  } else if (params.sort === 'hot') {
    allItems.sort((a, b) => b.hotScore - a.hotScore);
  } else if (params.sort === 'latest') {
    allItems.sort((a, b) => a.rank - b.rank);
  } else if (params.sort === 'comments') {
    allItems.sort((a, b) => b.commentCount - a.commentCount);
  }

  // Ensure rank is re-assigned cleanly according to current view
  allItems = allItems.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  // Limit: default 10, strictly capped at maximum 30
  const maxLimit = Math.min(30, Math.max(1, params.limit || 10));
  const pagedItems = allItems.slice(0, maxLimit);

  return {
    items: pagedItems,
    total: Math.min(30, allItems.length),
    hasMore: allItems.length > maxLimit && maxLimit < 30,
    limit: maxLimit,
    timeframe: timeframe,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Mock Backend API: GET /api/news/:id
 */
export async function apiFetchNewsDetail(id: string): Promise<NewsItem | null> {
  await delay(120);
  for (const reg of REGIONS) {
    for (const tf of ['daily', 'weekly', 'monthly'] as const) {
      const items = generateExpandedNews(reg.id, tf);
      const found = items.find((it) => it.id === id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Mock Backend API: User Interaction Actions
 */
export async function apiToggleBookmark(newsId: string): Promise<UserProfile> {
  await delay(50);
  const profile = getStoredUserProfile();
  const exists = profile.bookmarkedIds.includes(newsId);
  const updatedBookmarks = exists
    ? profile.bookmarkedIds.filter((id) => id !== newsId)
    : [...profile.bookmarkedIds, newsId];

  const updatedProfile: UserProfile = {
    ...profile,
    bookmarkedIds: updatedBookmarks,
    stats: {
      ...profile.stats,
      totalBookmarks: updatedBookmarks.length,
    },
  };

  saveStoredUserProfile(updatedProfile);
  return updatedProfile;
}

export async function apiToggleLike(newsId: string): Promise<UserProfile> {
  await delay(50);
  const profile = getStoredUserProfile();
  const exists = profile.likedIds.includes(newsId);
  const updatedLikes = exists
    ? profile.likedIds.filter((id) => id !== newsId)
    : [...profile.likedIds, newsId];

  const updatedProfile: UserProfile = {
    ...profile,
    likedIds: updatedLikes,
  };

  saveStoredUserProfile(updatedProfile);
  return updatedProfile;
}

export async function apiRecordHistory(newsId: string): Promise<UserProfile> {
  const profile = getStoredUserProfile();
  const nowStr = '刚刚';
  const filtered = profile.readingHistory.filter((h) => h.newsId !== newsId);
  const updatedHistory = [{ newsId, readAt: nowStr }, ...filtered].slice(0, 30);

  const updatedProfile: UserProfile = {
    ...profile,
    readingHistory: updatedHistory,
    stats: {
      ...profile.stats,
      totalReadToday: profile.stats.totalReadToday + 1,
      weeklyReadCount: profile.stats.weeklyReadCount + 1,
      lastActive: nowStr,
    },
  };

  saveStoredUserProfile(updatedProfile);
  return updatedProfile;
}

export async function apiUpdateUserPreferences(
  preferences: Partial<Pick<UserProfile, 'preferredRegions' | 'preferredPlatforms' | 'preferredCategories' | 'name' | 'bio'>>
): Promise<UserProfile> {
  await delay(100);
  const profile = getStoredUserProfile();
  const updated: UserProfile = {
    ...profile,
    ...preferences,
  };
  saveStoredUserProfile(updated);
  return updated;
}
