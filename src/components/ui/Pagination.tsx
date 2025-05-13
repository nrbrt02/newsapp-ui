import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(0);
    
    // Calculate range around current page
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages - 2, currentPage + 1);
    
    // Adjust if we're at the beginning or end
    if (currentPage <= 2) {
      endPage = Math.min(3, totalPages - 2);
    } else if (currentPage >= totalPages - 3) {
      startPage = Math.max(totalPages - 4, 1);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 1) {
      pages.push('ellipsis1');
    }
    
    // Add page numbers around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 2) {
      pages.push('ellipsis2');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }
    
    return pages;
  };

  return (
    <div className={`flex justify-center items-center mt-6 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
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

      <div className="flex space-x-2 mx-2">
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis1' || page === 'ellipsis2') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`w-8 h-8 rounded-md ${
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {(typeof page === 'number' ? page + 1 : page).toString()}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`p-2 rounded-md ${
          currentPage === totalPages - 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Next page"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;