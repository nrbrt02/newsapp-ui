import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useCategory, useCategories } from '../../context/CategoryContext';
import CategoryForm from './CategoryForm';
import type { CategoryFormData } from '../../types/categories.types';

const UpdateCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  
  const { data: category, isLoading, isError } = useCategory(categoryId);
  const { updateCategory, error } = useCategories();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    const result = await updateCategory(categoryId, data);
    setIsSubmitting(false);
    
    if (result) {
      // Show success message
      alert('Category updated successfully');
      // Navigate back to the category list
      navigate('/admin/categories');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
        <span className="ml-2 text-gray-700">Loading category...</span>
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
    <div className="max-w-3xl mx-auto py-8">
      <button
        onClick={() => navigate('/admin/categories')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="mr-1" />
        Back to Categories
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Category: {category.name}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        
        <CategoryForm 
          initialData={category} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default UpdateCategory;