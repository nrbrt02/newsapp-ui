import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiEye, FiTag, FiList, FiUser, FiMessageSquare } from 'react-icons/fi';
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
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="mb-6">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* Title and Status */}
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{article.title}</h1>
        {getStatusBadge(article.status)}
      </div>
      
      {/* Meta Information */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
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
        <div className="flex items-center">
          <FiMessageSquare className="mr-1" />
          <span>{article.commentCount} comments</span>
        </div>
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
        <p className="text-gray-600">{article.description}</p>
      </div>
      
      {/* Content Preview */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Content</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
      
      {/* Category */}
      <div className="mb-6">
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
        <div className="mb-6">
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
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Author</h2>
        <div className="flex items-center">
          {article.author.profilePic ? (
            <img
              src={article.author.profilePic}
              alt={article.author.username}
              className="h-10 w-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">
              {article.author.firstName?.charAt(0) || article.author.username.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium">
              {article.author.firstName && article.author.lastName
                ? `${article.author.firstName} ${article.author.lastName}`
                : article.author.username
              }
            </p>
            <p className="text-sm text-gray-500">{article.author.email}</p>
            <p className="text-sm text-gray-500">Role: {article.author.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsModal;