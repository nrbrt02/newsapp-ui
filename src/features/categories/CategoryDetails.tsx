import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FiArrowLeft, FiEdit, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useCategory } from '../../context/CategoryContext';

const CategoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  
  const { data: category, isLoading, isError } = useCategory(categoryId);

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
    <div className="max-w-3xl mx-auto py-8">
      <button
        onClick={() => navigate('/admin/categories')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="mr-1" />
        Back to Categories
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
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
              <div>
                <p className="text-gray-500">ID</p>
                <p className="text-gray-800">{category.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Created At</p>
                <p className="text-gray-800">{formattedDate(category.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="text-gray-800">{formattedDate(category.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;