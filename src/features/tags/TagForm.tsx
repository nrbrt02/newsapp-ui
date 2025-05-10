import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Tag, TagFormData } from '../../types/tag.types';

const tagSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(30, 'Name must be less than 30 characters'),
});

interface TagFormProps {
  initialData?: Tag;
  onSubmit: (data: TagFormData) => void;
  isSubmitting: boolean;
}

const TagForm: React.FC<TagFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: initialData ? {
      name: initialData.name,
    } : {
      name: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tag Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter tag name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Tag' : 'Create Tag'}
        </button>
      </div>
    </form>
  );
};

export default TagForm;