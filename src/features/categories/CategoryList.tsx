import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useCategories } from '../../context/CategoryContext';
import CategoryItem from './CategoryItem';
import Modal from './Modal';

const CategoryList: React.FC = () => {
  const { categories, loading, error, deleteCategory } = useCategories();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
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
        <Link
          to="/admin/categories/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
        >
          <FiPlus className="mr-1" />
          Add Category
        </Link>
      </div>

      {categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No categories found.</p>
          <Link
            to="/admin/categories/create"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create your first category
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={cancelDelete}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
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