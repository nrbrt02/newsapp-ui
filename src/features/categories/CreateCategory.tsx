import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useCategories } from '../../context/CategoryContext';
import CategoryForm from './CategoryForm';
import type { CategoryFormData } from '../../types/categories.types';

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();
  const { createCategory, error } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    const result = await createCategory(data);
    setIsSubmitting(false);
    
    if (result) {
      // Show success message
      alert('Category created successfully');
      // Navigate back to the category list
      navigate('/admin/categories');
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Category</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        
        <CategoryForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default CreateCategory;