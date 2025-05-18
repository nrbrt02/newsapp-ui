import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow, format } from 'date-fns';
import { FiEdit, FiEye, FiClock, FiCalendar, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import CommentsSection from '../components/article/CommentsSection';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const { article, isLoading, error, getArticleById, clearArticle } = useArticle();
  const { user, isAuthenticated } = useAuth();
  const [isUserAuthor, setIsUserAuthor] = useState(false);
  const [articleId, setArticleId] = useState<number | null>(null);

  // Parse and set the article ID once when the component mounts or when the ID param changes
  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id);
      if (!isNaN(parsedId)) {
        setArticleId(parsedId);
      }
    }
  }, [id]);

  // Fetch article data when articleId changes
  useEffect(() => {
    if (articleId !== null) {
      getArticleById(articleId);
    }
    
    // Cleanup function
    return () => {
      clearArticle();
    };
  }, [articleId, getArticleById, clearArticle]);

  // Check if the current user is the author of the article
  useEffect(() => {
    if (article && user) {
      setIsUserAuthor(article.author.id === user.id || user.role === 'ADMIN');
    } else {
      setIsUserAuthor(false);
    }
  }, [article, user]);

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
          <h3 className="font-medium">Error loading article</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md p-6 text-center">
        <p className="text-lg">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Category */}
      <div className="mb-4">
        <Link
          to={`/category/${article.category.id}`}
          className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-md"
        >
          {article.category.name}
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {article.title}
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
        <div className="flex items-center">
          <FiCalendar className="mr-1" />
          <span>
            {format(new Date(article.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center">
          <FiClock className="mr-1" />
          <span>
            {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center">
          <FiEye className="mr-1" />
          <span>{article.views} views</span>
        </div>
        <div className="flex items-center">
          <FiMessageSquare className="mr-1" />
          <span>{article.comments?.length || 0} comments</span>
        </div>
      </div>

      {/* Author Information */}
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
          {article.author.firstName?.charAt(0) || article.author.username.charAt(0)}
        </div>
        <div className="ml-3">
          <span className="text-sm font-medium text-gray-700 block">
            {`${article.author.firstName || ''} ${article.author.lastName || ''}`}
            {!article.author.firstName && !article.author.lastName && article.author.username}
          </span>
          <span className="text-xs text-gray-500">Author</span>
        </div>
        
        {/* Edit Button for Author or Admin */}
        {isUserAuthor && (
          <Link
            to={`/admin/articles/edit/${article.id}`}
            className="ml-auto flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <FiEdit className="mr-1" />
            Edit Article
          </Link>
        )}
      </div>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="mb-8">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/tag/${tag.id}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Additional Images */}
      {article.images && article.images.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {article.images.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.image}
                  alt={image.description || article.title}
                  className="w-full h-48 object-cover rounded-md shadow-sm"
                />
                {image.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                    {image.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section - Only render when we have a valid articleId */}
      {articleId !== null && <CommentsSection articleId={articleId} />}
    </div>
  );
};

export default ArticlePage;