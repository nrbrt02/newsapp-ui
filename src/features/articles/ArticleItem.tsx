import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiEye, FiCalendar, FiEdit, FiTrash2 } from 'react-icons/fi';
import type { ArticlePreview } from '../../types/article.types';

interface ArticleItemProps {
  article: ArticlePreview;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  canEdit?: boolean;
}

const ArticleItem = ({
  article,
  onEdit,
  onDelete,
  onView,
  canEdit = false
}: ArticleItemProps) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={article.featuredImage || '/placeholder-image.jpg'}
          alt={article.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge(article.status)}
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/articles/${article.id}`} className="block">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary-600">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.description}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <FiEye className="mr-1" />
            <span>{article.views} views</span>
          </div>
        </div>
        
        {/* Category and Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={`/category/${article.category.id}`}
            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
          >
            {article.category.name}
          </Link>
          
          {article.tags?.slice(0, 3).map((tag) => (
            <Link
              key={tag.id}
              to={`/tag/${tag.id}`}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag.name}
            </Link>
          ))}
          
          {article.tags && article.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{article.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Actions */}
        {(onView || onEdit || onDelete) && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
            {onView && (
              <button
                onClick={() => onView(article.id)}
                className="p-2 text-gray-500 hover:text-primary-600"
                title="View"
              >
                <FiEye size={18} />
              </button>
            )}
            
            {onEdit && canEdit && (
              <button
                onClick={() => onEdit(article.id)}
                className="p-2 text-gray-500 hover:text-primary-600"
                title="Edit"
              >
                <FiEdit size={18} />
              </button>
            )}
            
            {onDelete && canEdit && (
              <button
                onClick={() => onDelete(article.id)}
                className="p-2 text-gray-500 hover:text-red-600"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleItem;