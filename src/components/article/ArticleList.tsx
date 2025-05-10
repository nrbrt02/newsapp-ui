import { useState, useEffect } from 'react';
import type { PaginatedResponse, ArticlePreview } from '../../types/article.types';
import ArticleCard from './ArticleCard';
import { FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ArticleListProps {
  articles: PaginatedResponse<ArticlePreview> | null;
  isLoading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
}

const ArticleList = ({
  articles,
  isLoading,
  error,
  onPageChange,
  emptyMessage = 'No articles found.'
}: ArticleListProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Reset current page when articles change
  useEffect(() => {
    if (articles) {
      setCurrentPage(articles.number);
    }
  }, [articles]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && (!articles || newPage < articles.totalPages)) {
      setCurrentPage(newPage);
      onPageChange(newPage);
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

  if (!articles || articles.content.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md p-6 text-center">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {articles.content.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {articles.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`p-2 rounded-md ${
              currentPage === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Previous page"
          >
            <FiChevronLeft size={18} />
          </button>

          {[...Array(articles.totalPages)].map((_, i) => {
            // Show ellipsis for large page numbers
            if (
              articles.totalPages > 7 &&
              i !== 0 &&
              i !== articles.totalPages - 1 &&
              Math.abs(i - currentPage) > 1
            ) {
              if (
                i === 1 && currentPage >= 4 ||
                i === articles.totalPages - 2 && currentPage <= articles.totalPages - 5
              ) {
                return (
                  <span
                    key={i}
                    className="p-2 text-gray-500"
                  >
                    ...
                  </span>
                );
              }
              if (Math.abs(i - currentPage) > 1) {
                return null;
              }
            }

            return (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`h-8 w-8 rounded-md ${
                  currentPage === i
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!articles || currentPage === articles.totalPages - 1}
            className={`p-2 rounded-md ${
              !articles || currentPage === articles.totalPages - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Next page"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleList;