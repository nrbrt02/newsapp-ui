import api from './api';

// Admin Statistics
export const getAdminDashboardStats = async () => {
  const response = await api.get('/admin/statistics/dashboard');
  return response.data;
};

export const getArticlesOverview = async (startDate: string, endDate: string) => {
  const response = await api.get(`/admin/statistics/articles/overview?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

export const getUsersOverview = async (startDate: string, endDate: string) => {
  const response = await api.get(`/admin/statistics/users/overview?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

export const getCategoryPerformance = async () => {
  const response = await api.get('/admin/statistics/categories/performance');
  return response.data;
};

export const getWriterPerformance = async () => {
  const response = await api.get('/admin/statistics/writers/performance');
  return response.data;
};

export const getEngagementMetrics = async () => {
  const response = await api.get('/admin/statistics/engagement');
  return response.data;
};

// Writer Statistics
export const getWriterDashboardStats = async () => {
  const response = await api.get('/writer/statistics/dashboard');
  return response.data;
};

export const getWriterArticlesPerformance = async () => {
  const response = await api.get('/writer/statistics/articles/performance');
  return response.data;
};

export const getWriterArticlesEngagement = async () => {
  const response = await api.get('/writer/statistics/articles/engagement');
  return response.data;
};

export const getWriterCategoriesPerformance = async () => {
  const response = await api.get('/writer/statistics/categories/performance');
  return response.data;
};

export const getWriterReaderInsights = async () => {
  const response = await api.get('/writer/statistics/readers/insights');
  return response.data;
}; 