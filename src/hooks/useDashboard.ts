import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import {
  getAdminDashboardStats,
  getArticlesOverview,
  getUsersOverview,
  getCategoryPerformance,
  getWriterPerformance,
  getEngagementMetrics,
  getWriterDashboardStats,
  getWriterArticlesPerformance,
  getWriterArticlesEngagement,
  getWriterCategoriesPerformance,
  getWriterReaderInsights
} from '../services/statisticsService';
import type {
  AdminDashboardStats,
  ArticlesOverview,
  UsersOverview,
  CategoryPerformance,
  WriterPerformance,
  EngagementMetrics,
  WriterDashboardStats,
  WriterArticlesPerformance,
  WriterArticlesEngagement,
  WriterCategoriesPerformance,
  WriterReaderInsights
} from '../types/dashboard.types';

interface DashboardState {
  isLoading: boolean;
  error: string | null;
  adminStats: {
    dashboardStats: AdminDashboardStats | null;
    articlesOverview: ArticlesOverview | null;
    usersOverview: UsersOverview | null;
    categoryPerformance: CategoryPerformance | null;
    writerPerformance: WriterPerformance | null;
    engagementMetrics: EngagementMetrics | null;
  };
  writerStats: {
    dashboardStats: WriterDashboardStats | null;
    articlesPerformance: WriterArticlesPerformance | null;
    articlesEngagement: WriterArticlesEngagement | null;
    categoriesPerformance: WriterCategoriesPerformance | null;
    readerInsights: WriterReaderInsights | null;
  };
}

const initialState: DashboardState = {
  isLoading: false,
  error: null,
  adminStats: {
    dashboardStats: null,
    articlesOverview: null,
    usersOverview: null,
    categoryPerformance: null,
    writerPerformance: null,
    engagementMetrics: null
  },
  writerStats: {
    dashboardStats: null,
    articlesPerformance: null,
    articlesEngagement: null,
    categoriesPerformance: null,
    readerInsights: null
  }
};

export const useDashboard = (userRole: string | undefined, dateRange: { startDate: string; endDate: string }) => {
  const [state, setState] = useState<DashboardState>(initialState);
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchWithRetry = useCallback(async (apiCall: () => Promise<any>, retryCount: number = 0): Promise<any> => {
    const maxRetries = 3;
    const retryDelay = 1000;

    try {
      return await apiCall();
    } catch (error) {
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retryCount)));
        return fetchWithRetry(apiCall, retryCount + 1);
      }
      throw error;
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (userRole === 'ADMIN') {
        const [
          dashboardStats,
          articlesData,
          usersData,
          categoriesData,
          writersData,
          engagementData
        ] = await Promise.all([
          fetchWithRetry(() => getAdminDashboardStats()),
          fetchWithRetry(() => getArticlesOverview(dateRange.startDate, dateRange.endDate)),
          fetchWithRetry(() => getUsersOverview(dateRange.startDate, dateRange.endDate)),
          fetchWithRetry(() => getCategoryPerformance()),
          fetchWithRetry(() => getWriterPerformance()),
          fetchWithRetry(() => getEngagementMetrics())
        ]);

        if (!signal.aborted) {
          setState(prev => ({
            ...prev,
            adminStats: {
              dashboardStats,
              articlesOverview: articlesData,
              usersOverview: usersData,
              categoryPerformance: categoriesData,
              writerPerformance: writersData,
              engagementMetrics: engagementData
            }
          }));
        }
      } else if (userRole === 'WRITER') {
        const [
          dashboardStats,
          articlesPerformance,
          articlesEngagement,
          categoriesPerformance,
          readerInsights
        ] = await Promise.all([
          fetchWithRetry(() => getWriterDashboardStats()),
          fetchWithRetry(() => getWriterArticlesPerformance()),
          fetchWithRetry(() => getWriterArticlesEngagement()),
          fetchWithRetry(() => getWriterCategoriesPerformance()),
          fetchWithRetry(() => getWriterReaderInsights())
        ]);

        if (!signal.aborted) {
          setState(prev => ({
            ...prev,
            writerStats: {
              dashboardStats,
              articlesPerformance,
              articlesEngagement,
              categoriesPerformance,
              readerInsights
            }
          }));
        }
      }
    } catch (err) {
      if (!signal.aborted) {
        const errorMessage = 'Failed to load dashboard statistics';
        setState(prev => ({ ...prev, error: errorMessage }));
        showToast(errorMessage, 'error');
      }
    } finally {
      if (!signal.aborted) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [userRole, dateRange, fetchWithRetry, showToast]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchData();
    }, 500);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData
  };
}; 