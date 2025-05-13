// src/features/categories/CategoryDetails.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FiArrowLeft, FiEdit, FiLoader, FiAlertCircle, FiCalendar, FiClock } from 'react-icons/fi';
import { useCategories } from '../../context/CategoryContext';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import { useArticle } from '../../hooks/useArticle';
import ArticleCard from '../../components/article/ArticleCard';
import type { Category } from '../../types/categories.types';
import CategoryDetailsModal from './CategoryDetailsModal';

const ITEMS_PER_PAGE = 8; // Articles per page

const CategoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  
  const { fetchCategoryById } = useCategories();
  const { getArticlesByCategory, articles, isLoading: articlesLoading } = useArticle();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch category details
  useEffect(() => {
    const loadCategory = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCategoryById(categoryId);
        setCategory(data);
        
        // Load initial articles for this category
        await getArticlesByCategory(categoryId, 0, ITEMS_PER_PAGE);
        
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategory();
  }, [categoryId, fetchCategoryById, getArticlesByCategory]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
    
    // If we had a search API for articles in a category, we would call it here
    // For now, client-side filtering would happen in the parent component
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getArticlesByCategory(categoryId, page, ITEMS_PER_PAGE);
  };

  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy, h:mm a');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
        <span className="ml-2 text-gray-700">Loading category details...</span>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <FiAlertCircle className="text-3xl mr-2" />
        <span>Error loading category. It may have been deleted or you don't have permission to view it.</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <button
        onClick={() => navigate('/admin/categories')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="mr-1" />
        Back to Categories
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
          <button
            onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center"
          >
            <FiEdit className="mr-1" />
            Edit
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">ID:</span>
                <span className="text-gray-800 font-medium">{category.id}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="text-gray-500 mr-2" />
                <span className="text-gray-800">{formattedDate(category.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="text-gray-500 mr-2" />
                <span className="text-gray-800">{formattedDate(category.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Articles in this category */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Articles in this Category</h2>
        
        {/* Search bar for articles */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search articles..." 
            initialValue={searchTerm}
          />
        </div>
        
        {articlesLoading ? (
          <div className="flex justify-center items-center h-40">
            <FiLoader className="animate-spin text-blue-600 text-2xl" />
            <span className="ml-2 text-gray-700">Loading articles...</span>
          </div>
        ) : articles && articles.content.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.content.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            {/* Pagination */}
            {articles.totalPages > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={articles.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="bg-gray-50 text-center p-8 rounded-lg">
            <p className="text-gray-600">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;