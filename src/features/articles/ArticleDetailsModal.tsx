import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiEye, FiTag, FiList } from 'react-icons/fi';
import type { Article } from '../../types/article.types';

interface ArticleDetailsModalProps {
  article: Article;
}

const ArticleDetailsModal = ({ article }: ArticleDetailsModalProps) => {
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
    <div className="p-6 max-h-[80vh] overflow-auto">
      <div className="space-y-6">
        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-4">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        {/* Title and Status */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800">{article.title}</h1>
          {getStatusBadge(article.status)}
        </div>
        
        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            <span>
              {format(new Date(article.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>
              Last updated: {format(new Date(article.updatedAt), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center">
            <FiEye className="mr-1" />
            <span>{article.views} views</span>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600">{article.description}</p>
        </div>
        
        {/* Content Preview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Content Preview</h2>
          <div className="bg-gray-50 p-4 rounded-md h-56 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: article.content.substring(0, 500) + '...' }} />
          </div>
          <div className="mt-2 text-right">
            <Link 
              to={`/articles/${article.id}`} 
              className="text-primary-600 hover:text-primary-700"
              target="_blank"
            >
              View Full Article
            </Link>
          </div>
        </div>
        
        {/* Category */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Category</h2>
          <div className="flex items-center">
            <FiList className="text-gray-500 mr-2" />
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md">
              {article.category?.name || 'Uncategorized'}
            </span>
          </div>
        </div>
        
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <div key={tag.id} className="flex items-center">
                  <FiTag className="text-gray-500 mr-1" />
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md">
                    {tag.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Author */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Author</h2>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">
              {article.author?.firstName?.charAt(0) || article.author?.username?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium">
                {article.author?.firstName && article.author?.lastName
                  ? `${article.author.firstName} ${article.author.lastName}`
                  : article.author?.username || 'Unknown'
                }
              </p>
              <p className="text-sm text-gray-500">{article.author?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsModal;