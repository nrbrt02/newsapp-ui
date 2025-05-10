import React from 'react';
import { format } from 'date-fns';
import type { Category } from '../../types/categories.types';

interface CategoryDetailsModalProps {
  category: Category;
}

const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({ category }) => {
  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy, h:mm a');
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600">{category.description}</p>
        </div>
        
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">ID</p>
              <p className="text-gray-800 font-medium">{category.id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-gray-800 font-medium">{category.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Created At</p>
              <p className="text-gray-800">{formattedDate(category.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Last Updated</p>
              <p className="text-gray-800">{formattedDate(category.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;