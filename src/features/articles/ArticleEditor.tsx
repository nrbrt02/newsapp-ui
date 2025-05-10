import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle } from '../../hooks/useArticle';
import type { ArticleCreateRequest, ArticleStatus } from '../../types/article.types';
import { FiAlertCircle, FiX, FiImage, FiCheck, FiSave } from 'react-icons/fi';

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    article, 
    categories, 
    tags, 
    isLoading, 
    error, 
    getArticleById, 
    createArticle, 
    updateArticle, 
    reloadCategories,
    reloadTags
  } = useArticle();
  
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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [tempImage, setTempImage] = useState('');

 // First useEffect - only for article fetching
useEffect(() => {
  if (id) {
    setIsEditing(true);
    getArticleById(parseInt(id));
  }
}, [id, getArticleById]);

// Second useEffect - for categories and tags, runs only once on component mount
useEffect(() => {
  // Load categories and tags
  reloadCategories();
  reloadTags();
}, []); // Empty dependency array = only runs once when component mounts

  // Populate form when article data is available
  useEffect(() => {
    if (isEditing && article) {
      setFormData({
        title: article.title,
        content: article.content,
        description: article.description,
        featuredImage: article.featuredImage,
        status: article.status,
        categoryId: article.category.id,
        tagIds: article.tags.map(tag => tag.id)
      });
    }
  }, [isEditing, article]);

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

  const handleImageAdd = () => {
    if (tempImage) {
      setFormData({
        ...formData,
        featuredImage: tempImage
      });
      setTempImage('');
      setShowImageInput(false);
    }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isEditing && id) {
        // Update existing article
        const result = await updateArticle(parseInt(id), formData);
        if (result) {
          navigate(`/articles/${result.id}`);
        }
      } else {
        // Create new article
        const result = await createArticle(formData);
        if (result) {
          navigate(`/articles/${result.id}`);
        }
      }
    } catch (err) {
      console.error('Error saving article:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (status: ArticleStatus) => {
    setFormData({
      ...formData,
      status
    });
  };

  if (isLoading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-primary-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Article' : 'Create New Article'}
        </h1>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleStatusChange('DRAFT')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              formData.status === 'DRAFT'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
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
          >
            Published
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => handleStatusChange('ARCHIVED')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                formData.status === 'ARCHIVED'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Archived
            </button>
          )}
        </div>
      </div>
      
      {/* Display error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
          
          {formData.featuredImage ? (
            <div className="relative">
              <img
                src={formData.featuredImage}
                alt="Featured"
                className="w-full h-48 object-cover rounded-md shadow-sm mb-2"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featuredImage: '' })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            showImageInput ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="input flex-grow"
                  value={tempImage}
                  onChange={(e) => setTempImage(e.target.value)}
                  placeholder="Enter image URL"
                />
                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="btn btn-primary"
                  disabled={!tempImage}
                >
                  <FiCheck size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowImageInput(false);
                    setTempImage('');
                  }}
                  className="btn btn-secondary"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowImageInput(true)}
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition duration-150"
              >
                <div className="text-center">
                  <FiImage size={24} className="mx-auto text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-600">Add featured image</span>
                </div>
              </button>
            )
          )}
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
            placeholder="Enter article content (HTML supported)"
          ></textarea>
          {formErrors.content && (
            <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary flex items-center ${
              isSaving ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isSaving}
          >
            <FiSave className="mr-2" />
            {isSaving ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;