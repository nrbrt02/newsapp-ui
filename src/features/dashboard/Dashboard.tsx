import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticle } from '../../hooks/useArticle';
import { useAuth } from '../../hooks/useAuth';
import type { ArticlePreview } from '../../types/article.types';
import { FiEdit, FiEye, FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const Dashboard = () => {
  const { articles, isLoading, error, getArticles, deleteArticle } = useArticle();
  const { user } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  const handleDeleteClick = (articleId: number) => {
    setConfirmDelete(articleId);
  };

  const handleConfirmDelete = async (articleId: number) => {
    setIsDeletingArticle(true);
    try {
      await deleteArticle(articleId);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setIsDeletingArticle(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
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
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-primary-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 flex items-start">
        <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium">Error loading articles</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link to="/admin/articles/create" className="btn btn-primary flex items-center">
          <FiPlus className="mr-2" />
          New Article
        </Link>
      </div>

      {/* Welcome Message */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome, {user?.firstName || user?.username}!
        </h2>
        <p className="text-gray-600">
          This is your dashboard where you can manage your articles, view statistics, and more.
        </p>
      </div>

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
                      {article.views}
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