// src/features/categories/CategoryList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useCategories } from '../../context/CategoryContext';
import { useToast } from '../../context/ToastContext';
import CategoryItem from './CategoryItem';
import Modal from './Modal';
import CategoryForm from './CategoryForm';
import CategoryDetails from './CategoryDetails';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import type { CategoryFormData, Category } from '../../types/categories.types';
import CategoryDetailsModal from './CategoryDetailsModal';

const ITEMS_PER_PAGE = 10;

const CategoryList: React.FC = () => {
  const { categories, loading, error, deleteCategory, createCategory } = useCategories();
  const { showToast } = useToast();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      setIsDeleting(true);
      const success = await deleteCategory(categoryToDelete);
      setIsDeleting(false);
      if (success) {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        showToast('Category deleted successfully', 'success');
      } else {
        showToast('Failed to delete category', 'error');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleCreateCategory = async (data: CategoryFormData) => {
    setIsCreating(true);
    const result = await createCategory(data);
    setIsCreating(false);
    
    if (result) {
      setShowCreateModal(false);
      showToast('Category created successfully', 'success');
    } else {
      showToast('Failed to create category', 'error');
    }
  };

  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category);
    setShowDetailsModal(true);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
        <span className="ml-2 text-gray-700">Loading categories...</span>
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <FiAlertCircle className="text-3xl mr-2" />
        <span>Error loading categories: {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
        >
          <FiPlus className="mr-1" />
          Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search categories..." 
          initialValue={searchTerm}
        />
      </div>

      {filteredCategories.length > 0 ? (
        <div>
          <div className="space-y-4 mb-6">
            {paginatedCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onDelete={handleDeleteClick}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          {searchTerm ? (
            <p className="text-gray-500">No categories found matching "{searchTerm}".</p>
          ) : (
            <>
              <p className="text-gray-500">No categories found.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create your first category
              </button>
            </>
          )}
        </div>
      )}

      {/* Create Category Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create New Category"
      >
        <div className="p-6">
          <CategoryForm 
            onSubmit={handleCreateCategory} 
            isSubmitting={isCreating} 
          />
        </div>
      </Modal>

      {/* View Details Modal */}
      {selectedCategory && (
  <Modal 
    isOpen={showDetailsModal} 
    onClose={() => {
      setShowDetailsModal(false);
      setSelectedCategory(null);
    }}
    title="Category Details"
  >
    <CategoryDetailsModal category={selectedCategory} />
  </Modal>
)}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={cancelDelete}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="mb-6">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;