import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle';
import { format } from 'date-fns';
import { FiArrowLeft, FiEye, FiMessageSquare, FiThumbsUp } from 'react-icons/fi';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getArticle, article, isLoading, error } = useArticle();
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (id) {
      getArticle(parseInt(id));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4">
        <p>{error || 'Article not found'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back to Home
      </Link>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span className="mr-4">
              {format(new Date(article.createdAt), 'MMMM d, yyyy')}
            </span>
            <span className="mr-4">By {article.author.username}</span>
            <span>{article.category.name}</span>
          </div>

          <div className="prose max-w-none mb-8">
            {article.content}
          </div>

          <div className="flex items-center space-x-6 text-gray-500 border-t pt-4">
            <div className="flex items-center">
              <FiEye className="mr-2" />
              <span>{views} views</span>
            </div>
            <div className="flex items-center">
              <FiMessageSquare className="mr-2" />
              <span>{article.comments?.length || 0} comments</span>
            </div>
            <div className="flex items-center">
              <FiThumbsUp className="mr-2" />
              <span>{likes} likes</span>
            </div>
          </div>
        </div>
      </article>

      {/* Comments section can be added here */}
    </div>
  );
};

export default NewsDetail; 