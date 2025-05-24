import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useArticle } from '../../hooks/useArticle';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { FiEdit, FiEye, FiTrash2, FiPlus, FiAlertCircle, FiUsers, FiFileText, FiBarChart2, FiTrendingUp, FiMessageSquare, FiThumbsUp } from 'react-icons/fi';
import { format } from 'date-fns';
import DateRangePicker from '../../components/ui/DateRangePicker';
import StatCard from '../../components/ui/StatCard';
import LineChart from '../../components/ui/LineChart';
import BarChart from '../../components/ui/BarChart';
import PieChart from '../../components/ui/PieChart';
import type { ArticlePreview } from '../../types/article.types';
import {
  transformArticlesByCategory,
  transformArticlesByStatus,
  transformUserActivity,
  transformCategoryPerformance,
  transformWriterArticlesPerformance,
  transformWriterArticlesEngagement,
  transformWriterCategoriesPerformance,
  formatNumber,
  calculateGrowth
} from '../../utils/dashboardUtils';

const Dashboard = () => {
  const { articles, isLoading: articlesLoading, error: articlesError, getArticles, deleteArticle } = useArticle();
  const { user } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  const debouncedDateRange = useMemo(() => ({
    startDate: dateRange.startDate.toISOString(),
    endDate: dateRange.endDate.toISOString()
  }), [dateRange.startDate, dateRange.endDate]);

  const {
    isLoading,
    error,
    adminStats,
    writerStats,
    refetch
  } = useDashboard(user?.role, debouncedDateRange);

  const handleDeleteClick = (articleId: number) => {
    setConfirmDelete(articleId);
  };

  const handleConfirmDelete = async (articleId: number) => {
    setIsDeletingArticle(true);
    try {
      await deleteArticle(articleId);
      setConfirmDelete(null);
      refetch();
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setIsDeletingArticle(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Published
          </span>
        );
      case 'DRAFT':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Draft
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Writer Dashboard'}
        </h1>
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={handleDateRangeChange}
        />
      </div>

      {user?.role === 'ADMIN' ? (
        // Admin Dashboard
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={formatNumber(adminStats.dashboardStats?.totalUsers || 0)}
              icon={<FiUsers className="h-6 w-6" />}
              trend={calculateGrowth(
                adminStats.dashboardStats?.totalUsers || 0,
                (adminStats.dashboardStats?.totalUsers || 0) - (adminStats.dashboardStats?.userGrowth || 0)
              )}
            />
            <StatCard
              title="Total Articles"
              value={formatNumber(adminStats.dashboardStats?.totalArticles || 0)}
              icon={<FiFileText className="h-6 w-6" />}
              trend={calculateGrowth(
                adminStats.dashboardStats?.totalArticles || 0,
                (adminStats.dashboardStats?.totalArticles || 0) - (adminStats.dashboardStats?.articleGrowth || 0)
              )}
            />
            <StatCard
              title="Total Views"
              value={formatNumber(adminStats.dashboardStats?.totalViews || 0)}
              icon={<FiEye className="h-6 w-6" />}
              trend={calculateGrowth(
                adminStats.dashboardStats?.totalViews || 0,
                (adminStats.dashboardStats?.totalViews || 0) - (adminStats.dashboardStats?.viewGrowth || 0)
              )}
            />
            <StatCard
              title="Total Comments"
              value={formatNumber(adminStats.dashboardStats?.totalComments || 0)}
              icon={<FiMessageSquare className="h-6 w-6" />}
              trend={calculateGrowth(
                adminStats.dashboardStats?.totalComments || 0,
                (adminStats.dashboardStats?.totalComments || 0) - (adminStats.dashboardStats?.commentGrowth || 0)
              )}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Articles Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Articles Overview</h2>
              {adminStats.articlesOverview?.data?.length ? (
                <LineChart
                  data={adminStats.articlesOverview.data}
                  xAxis="date"
                  yAxis="count"
                  series={['published', 'draft']}
                />
              ) : (
                <p className="text-gray-500 text-center">No data available for this period.</p>
              )}
            </div>

            {/* Users Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Users Overview</h2>
              {adminStats.usersOverview?.data?.length ? (
                <LineChart
                  data={adminStats.usersOverview.data}
                  xAxis="date"
                  yAxis="count"
                  series={['new', 'active']}
                />
              ) : (
                <p className="text-gray-500 text-center">No data available for this period.</p>
              )}
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Category Performance</h2>
              {transformCategoryPerformance(adminStats.categoryPerformance).length ? (
                <BarChart
                  data={transformCategoryPerformance(adminStats.categoryPerformance)}
                  xAxis="category"
                  yAxis="engagement"
                />
              ) : (
                <p className="text-gray-500 text-center">No data available for this period.</p>
              )}
            </div>

            {/* Writer Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Writer Performance</h2>
              {adminStats.writerPerformance?.data?.length ? (
                <BarChart
                  data={adminStats.writerPerformance.data}
                  xAxis="writer"
                  yAxis="articles"
                />
              ) : (
                <p className="text-gray-500 text-center">No data available for this period.</p>
              )}
            </div>

            {/* Engagement Metrics */}
            <div className="bg-white rounded-lg shadow p-6 col-span-2">
              <h2 className="text-lg font-semibold mb-4">Engagement Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Average Views"
                  value={formatNumber(adminStats.engagementMetrics?.averageViews || 0)}
                  icon={<FiEye className="h-6 w-6" />}
                />
                <StatCard
                  title="Average Comments"
                  value={formatNumber(adminStats.engagementMetrics?.averageComments || 0)}
                  icon={<FiMessageSquare className="h-6 w-6" />}
                />
                <StatCard
                  title="Average Likes"
                  value={formatNumber(adminStats.engagementMetrics?.averageLikes || 0)}
                  icon={<FiThumbsUp className="h-6 w-6" />}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Writer Dashboard
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Articles"
              value={formatNumber(writerStats.dashboardStats?.totalArticles || 0)}
              icon={<FiFileText className="h-6 w-6" />}
            />
            <StatCard
              title="Total Views"
              value={formatNumber(writerStats.dashboardStats?.totalViews || 0)}
              icon={<FiEye className="h-6 w-6" />}
            />
            <StatCard
              title="Total Comments"
              value={formatNumber(writerStats.dashboardStats?.totalComments || 0)}
              icon={<FiMessageSquare className="h-6 w-6" />}
            />
            <StatCard
              title="Total Likes"
              value={formatNumber(writerStats.dashboardStats?.totalLikes || 0)}
              icon={<FiThumbsUp className="h-6 w-6" />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Articles Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Articles Performance</h2>
              {transformWriterArticlesPerformance(writerStats.articlesPerformance).length ? (
                <BarChart
                  data={transformWriterArticlesPerformance(writerStats.articlesPerformance)}
                  xAxis="article"
                  yAxis="views"
                />
              ) : (
                <p className="text-gray-500 text-center">No data available for this period.</p>
              )}
            </div>

            {/* Articles Engagement */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Articles Engagement</h2>
              {transformWriterArticlesEngagement(writerStats.articlesEngagement).length ? (
                <LineChart
                  data={transformWriterArticlesEngagement(writerStats.articlesEngagement)}
                  xAxis="date"
                  yAxis="count"
                  series={['views', 'comments']}
                />
              ) : (
                <p className="text-gray-500 text-center">No data available for this period.</p>
              )}
            </div>

            {/* Categories Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Categories Performance</h2>
              {transformWriterCategoriesPerformance(writerStats.categoriesPerformance).length ? (
                <PieChart
                  data={transformWriterCategoriesPerformance(writerStats.categoriesPerformance)}
                  nameKey="category"
                  valueKey="engagement"
                />
              ) : (
                <p className="text-gray-500 text-center">No data available for this period.</p>
              )}
            </div>

            {/* Reader Feedback */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Reader Feedback</h2>
              <div className="space-y-4">
                {writerStats.articlesEngagement?.readerFeedback?.map(([article, feedback], index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <h3 className="text-sm font-medium text-gray-500 truncate">{article}</h3>
                    <p className="text-lg font-semibold">{feedback} feedback</p>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center">No feedback available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
        <h2 className="text-lg font-semibold p-4 border-b">Your Articles</h2>
        
        {!articles || articles.content.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>You haven't created any articles yet.</p>
            <Link to="/admin/articles/create" className="text-primary-600 hover:underline mt-2 inline-block">
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.content.map((article: ArticlePreview) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {article.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(article.views)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(article.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link 
                          to={`/articles/${article.id}`} 
                          className="text-gray-600 hover:text-primary-600"
                          title="View"
                        >
                          <FiEye size={18} />
                        </Link>
                        <Link 
                          to={`/admin/articles/edit/${article.id}`} 
                          className="text-gray-600 hover:text-primary-600"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(article.id)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                      
                      {/* Delete Confirmation */}
                      {confirmDelete === article.id && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-500 mb-6">
                              Are you sure you want to delete the article "{article.title}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                disabled={isDeletingArticle}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleConfirmDelete(article.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                disabled={isDeletingArticle}
                              >
                                {isDeletingArticle ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {articles && articles.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => getArticles(articles.number - 1)}
            disabled={articles.first}
            className={`px-3 py-1 rounded-md mr-2 ${
              articles.first
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {articles.number + 1} of {articles.totalPages}
          </span>
          <button
            onClick={() => getArticles(articles.number + 1)}
            disabled={articles.last}
            className={`px-3 py-1 rounded-md ml-2 ${
              articles.last
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;