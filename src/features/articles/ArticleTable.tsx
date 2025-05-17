import { format } from 'date-fns';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import type { ArticlePreview } from '../../types/article.types';
import { useAuth } from '../../hooks/useAuth';

interface ArticleTableProps {
  articles: ArticlePreview[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}

const ArticleTable = ({ articles, onEdit, onDelete, onView }: ArticleTableProps) => {
  const { user } = useAuth();
  
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

  // Check if user can edit/delete based on role and ownership
  const canEdit = (article: ArticlePreview) => {
    return user?.role === 'ADMIN' || user?.id === article.author.id;
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
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
          {articles.length > 0 ? (
            articles.map(article => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{article.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                    {onView && (
                      <button
                        onClick={() => onView(article.id)}
                        className="text-gray-600 hover:text-primary-600"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
                    )}
                    
                    {onEdit && canEdit(article) && (
                      <button
                        onClick={() => onEdit(article.id)}
                        className="text-gray-600 hover:text-primary-600"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                    )}
                    
                    {onDelete && canEdit(article) && (
                      <button
                        onClick={() => onDelete(article.id)}
                        className="text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                No articles found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;