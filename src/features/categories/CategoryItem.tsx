// src/features/categories/CategoryItem.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import type { Category } from '../../types/categories.types';
import Modal from './Modal';
import CategoryForm from './CategoryForm';
import type { CategoryFormData } from '../../types/categories.types';
import { useCategories } from '../../context/CategoryContext';
import { useToast } from '../../context/ToastContext';

interface CategoryItemProps {
  category: Category;
  onDelete: (id: number) => void;
  onViewDetails: (category: Category) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onDelete, onViewDetails }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateCategory } = useCategories();
  const { showToast } = useToast();

  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    setIsUpdating(true);
    const result = await updateCategory(category.id, data);
    setIsUpdating(false);
    
    if (result) {
      setShowEditModal(false);
      showToast('Category updated successfully', 'success');
    } else {
      showToast('Failed to update category', 'error');
    }
  };

  // Truncate description if it's too long for a better UI
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-4">
            <h3 className="text-xl font-semibold text-gray-800 hover:text-primary-600 cursor-pointer" 
                onClick={() => onViewDetails(category)}>
              {category.name}
            </h3>
            <p className="text-gray-600 mt-2">{truncateDescription(category.description)}</p>
            <div className="text-sm text-gray-500 mt-3 flex flex-wrap gap-x-4">
              <p>Created: {formattedDate(category.createdAt)}</p>
              <p>Updated: {formattedDate(category.updatedAt)}</p>
            </div>
          </div>
          
          <div className="flex flex-shrink-0 space-x-2">
            <button
              onClick={() => onViewDetails(category)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
              title="View Details"
              aria-label="View category details"
            >
              <FiInfo className="text-xl" />
            </button>
            <button
              onClick={handleEditClick}
              className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-full transition-colors"
              title="Edit Category"
              aria-label="Edit category"
            >
              <FiEdit className="text-xl" />
            </button>
            <button 
              onClick={() => onDelete(category.id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Category"
              aria-label="Delete category"
            >
              <FiTrash2 className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title={`Edit Category: ${category.name}`}
      >
        <div className="p-6">
          <CategoryForm 
            initialData={category}
            onSubmit={handleUpdateCategory} 
            isSubmitting={isUpdating} 
          />
        </div>
      </Modal>
    </>
  );
};

export default CategoryItem;