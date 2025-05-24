import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle';
import { format } from 'date-fns';

const Home = () => {
  const { articles, isLoading, error, getArticles } = useArticle();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getArticles(currentPage);
  }, [currentPage]);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to NewsApp</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.content.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                <Link to={`/news/${article.id}`} className="hover:text-primary-600">
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {article.summary}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
                <span>{article.category.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {articles && articles.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={articles.first}
            className={`px-4 py-2 rounded-md mr-2 ${
              articles.first
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {articles.number + 1} of {articles.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={articles.last}
            className={`px-4 py-2 rounded-md ml-2 ${
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

export default Home; 