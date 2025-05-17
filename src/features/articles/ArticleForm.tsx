// src/features/articles/ArticleForm.tsx (updated)

import { useState, useEffect } from 'react';
import { useArticle } from '../../hooks/useArticle';
import FileUpload from '../../components/ui/FileUpload';
import type { ArticleCreateRequest, ArticleStatus, Article } from '../../types/article.types';

interface ArticleFormProps {
  initialData?: Article;
  isSubmitting: boolean;
  onSubmit: (formData: ArticleCreateRequest) => void;
  error?: string | null;
}

const ArticleForm = ({
  initialData,
  isSubmitting,
  onSubmit,
  error
}: ArticleFormProps) => {
  const { categories, tags, loadCategories, loadTags } = useArticle();
  
  const [formData, setFormData] = useState<ArticleCreateRequest>({
    title: '',
    content: '',
    description: '',
    featuredImage: '',
    status: 'DRAFT',
    categoryId: 0,
    tagIds: []
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load categories and tags when the component mounts
  useEffect(() => {
    loadCategories();
    loadTags();
  }, [loadCategories, loadTags]);

  // Populate form when article data is available
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        description: initialData.description,
        featuredImage: initialData.featuredImage || '',
        status: initialData.status,
        categoryId: initialData.category?.id || 0,
        tagIds: initialData.tags?.map(tag => tag.id) || []
      });
      
      if (initialData.featuredImage) {
        setImagePreview(initialData.featuredImage);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleTagChange = (tagId: number) => {
    const newTagIds = formData.tagIds.includes(tagId)
      ? formData.tagIds.filter(id => id !== tagId)
      : [...formData.tagIds, tagId];
    
    setFormData({
      ...formData,
      tagIds: newTagIds
    });
  };

  const handleImageUpload = (file: File) => {
    // In a real implementation, you would upload the file to your server here
    // For now, we'll just use the local file URL
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    
    setFormData({
      ...formData,
      featuredImage: imageUrl
    });
  };

  const handleImageUrlUpload = (url: string) => {
    setImagePreview(url);
    
    setFormData({
      ...formData,
      featuredImage: url
    });
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    
    setFormData({
      ...formData,
      featuredImage: ''
    });
  };

  const handleStatusChange = (status: ArticleStatus) => {
    setFormData({
      ...formData,
      status
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validate title
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    // Validate content
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    // Validate description
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    // Validate category
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Submit the form data
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Status Selection */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => handleStatusChange('DRAFT')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            formData.status === 'DRAFT'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          disabled={isSubmitting}
        >
          Draft
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange('PUBLISHED')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            formData.status === 'PUBLISHED'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          disabled={isSubmitting}
        >
          Published
        </button>
        {initialData && (
          <button
            type="button"
            onClick={() => handleStatusChange('ARCHIVED')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              formData.status === 'ARCHIVED'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isSubmitting}
          >
            Archived
          </button>
        )}
      </div>
      
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={`input ${formErrors.title ? 'border-red-500' : ''}`}
          value={formData.title}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter article title"
        />
        {formErrors.title && (
          <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
        )}
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className={`input ${formErrors.description ? 'border-red-500' : ''}`}
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter a brief description"
        ></textarea>
        {formErrors.description && (
          <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
        )}
      </div>
      
      {/* Featured Image */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Featured Image
        </label>
        
        <FileUpload
          onFileSelect={handleImageUpload}
          onUrlSelect={handleImageUrlUpload}
          preview={imagePreview}
          onRemove={handleRemoveImage}
          disabled={isSubmitting}
        />
      </div>
      
      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-gray-700 font-medium mb-2">
          Category*
        </label>
        <select
          id="categoryId"
          name="categoryId"
          className={`input ${formErrors.categoryId ? 'border-red-500' : ''}`}
          value={formData.categoryId}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value={0}>Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {formErrors.categoryId && (
          <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>
        )}
      </div>
      
      {/* Tags */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center">
              <input
                type="checkbox"
                className="hidden"
                checked={formData.tagIds.includes(tag.id)}
                onChange={() => handleTagChange(tag.id)}
                disabled={isSubmitting}
              />
              <span
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  formData.tagIds.includes(tag.id)
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
          Content*
        </label>
        <textarea
          id="content"
          name="content"
          rows={15}
          className={`input font-mono ${formErrors.content ? 'border-red-500' : ''}`}
          value={formData.content}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter article content (HTML supported)"
        ></textarea>
        {formErrors.content && (
          <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className={`btn btn-primary ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Saving...' 
            : initialData 
              ? 'Update Article' 
              : 'Create Article'
          }
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;