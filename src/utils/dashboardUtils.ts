import type {
  ArticlesOverview,
  UsersOverview,
  CategoryPerformance,
  WriterArticlesPerformance,
  WriterArticlesEngagement,
  WriterCategoriesPerformance
} from '../types/dashboard.types';

export const transformArticlesByCategory = (data: ArticlesOverview | null) => {
  if (!data?.articlesByCategory) return [];
  
  return Object.entries(data.articlesByCategory).map(([category, count]) => ({
    category,
    count
  }));
};

export const transformArticlesByStatus = (data: ArticlesOverview | null) => {
  if (!data?.articlesByStatus) return [];
  
  return Object.entries(data.articlesByStatus).map(([status, count]) => ({
    status,
    count
  }));
};

export const transformUserActivity = (data: UsersOverview | null) => {
  if (!data?.userActivity) return [];
  
  return Object.entries(data.userActivity)
    .map(([date, count]) => ({
      date,
      count
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const transformCategoryPerformance = (data: CategoryPerformance | null) => {
  if (!data?.categoryEngagement) return [];
  
  return Object.entries(data.categoryEngagement).map(([category, engagement]) => ({
    category,
    engagement,
    views: data.categoryViews[category] || 0,
    comments: data.categoryComments[category] || 0
  }));
};

export const transformWriterArticlesPerformance = (data: WriterArticlesPerformance | null) => {
  if (!data?.topArticles) return [];
  
  return Object.entries(data.topArticles).map(([article, views]) => ({
    article,
    views,
    comments: data.commentCounts[article] || 0
  }));
};

export const transformWriterArticlesEngagement = (data: WriterArticlesEngagement | null) => {
  if (!data?.dailyViews) return [];
  
  return [{
    date: data.dailyViews.date,
    views: data.dailyViews.count,
    comments: data.dailyComments.count
  }];
};

export const transformWriterCategoriesPerformance = (data: WriterCategoriesPerformance | null) => {
  if (!data?.categoryEngagement) return [];
  
  return Object.entries(data.categoryEngagement).map(([category, engagement]) => ({
    category,
    engagement,
    views: data.categoryViews[category] || 0,
    comments: data.categoryComments[category] || 0
  }));
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}; 