export interface AdminDashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalViews: number;
  totalComments: number;
  userGrowth: number;
  articleGrowth: number;
  viewGrowth: number;
  commentGrowth: number;
}

export interface ArticlesOverview {
  totalComments: number;
  publishedArticles: number;
  totalArticles: number;
  articlesByCategory: Record<string, number>;
  articlesByStatus: Record<string, number>;
  totalViews: number;
  data?: Array<{
    date: string;
    published: number;
    draft: number;
  }>;
}

export interface UsersOverview {
  usersByRole: Record<string, number>;
  totalUsers: number;
  activeWriters: number;
  userActivity: Record<string, number>;
  newWriters: number;
  data?: Array<{
    date: string;
    new: number;
    active: number;
  }>;
}

export interface CategoryPerformance {
  categoryEngagement: Record<string, number>;
  totalComments: number;
  totalArticles: number;
  totalViews: number;
  categoryComments: Record<string, number>;
  totalEngagement: number;
  topCategories: Record<string, number>;
  categoryViews: Record<string, number>;
  data?: Array<{
    category: string;
    articles: number;
    engagement: number;
    views: number;
    comments: number;
  }>;
}

export interface WriterPerformance {
  data?: Array<{
    writer: string;
    articles: number;
    views: number;
    comments: number;
  }>;
}

export interface EngagementMetrics {
  dailyViews: Record<string, number>;
  dailyComments: {
    date: string;
    count: number;
  };
  engagementByCategory: Record<string, number>;
  userEngagement: Record<string, number>;
  averageViews?: number;
  averageComments?: number;
  averageLikes?: number;
}

export interface WriterDashboardStats {
  totalArticles: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  articlesByStatus: Record<string, number>;
  topArticles: Record<string, number>;
  categoryPerformance: Record<string, number>;
  dailyViews: null | {
    date: string;
    count: number;
  };
  dailyComments: null | {
    date: string;
    count: number;
  };
  readerEngagement: null | Record<string, number>;
}

export interface WriterArticlesPerformance {
  commentCounts: Record<string, number>;
  viewCounts: Record<string, number>;
  topArticles: Record<string, number>;
  articleCounts: Record<string, number>;
}

export interface WriterArticlesEngagement {
  readerFeedback: Array<[string, number]>;
  dailyViews: {
    date: string;
    count: number;
  };
  dailyComments: {
    date: string;
    count: number;
  };
  engagementByArticle: Record<string, number>;
}

export interface WriterCategoriesPerformance {
  categoryEngagement: Record<string, number>;
  categoryComments: Record<string, number>;
  topCategories: Record<string, number>;
  categoryViews: Record<string, number>;
}

export interface WriterReaderInsights {
  readerFeedback: Record<string, any>;
  engagementPatterns: Record<string, number>;
  readerDemographics: Record<string, any>;
  popularTopics: Record<string, any>;
  topReadingTime?: string;
  averageReadingTime?: string;
  topTopics?: string[];
} 