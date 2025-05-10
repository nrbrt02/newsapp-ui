import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import type { Category } from '../../types/categories.types';

interface CategoryItemProps {
  category: Category;
  onDelete: (id: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onDelete }) => {
  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
          <p className="text-gray-600 mt-2">{category.description}</p>
          <div className="text-sm text-gray-500 mt-3">
            <p>Created: {formattedDate(category.createdAt)}</p>
            <p>Last updated: {formattedDate(category.updatedAt)}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link 
            to={`/admin/categories/${category.id}`} 
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiInfo className="text-xl" />
          </Link>
          <Link 
            to={`/admin/categories/edit/${category.id}`} 
            className="p-2 text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            <FiEdit className="text-xl" />
          </Link>
          <button 
            onClick={() => onDelete(category.id)}
            className="p-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <FiTrash2 className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryItem;