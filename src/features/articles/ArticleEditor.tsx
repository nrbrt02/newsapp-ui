import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useArticle } from '../../hooks/useArticle';
import { useToast } from '../../context/ToastContext';
import ArticleForm from './ArticleForm';
import type { ArticleCreateRequest } from '../../types/article.types';

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { 
    article, 
    isLoading, 
    error, 
    getArticleById, 
    createArticle, 
    updateArticle, 
    clearArticle 
  } = useArticle();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // If we have an ID, we're editing an existing article
    if (id) {
      setIsEditing(true);
      getArticleById(parseInt(id));
    } else {
      clearArticle(); // Ensure we start with a clean state
    }
    
    // Cleanup function
    return () => {
      clearArticle();
    };
  }, [id, getArticleById, clearArticle]);

  const handleSubmit = async (formData: ArticleCreateRequest) => {
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditing && id) {
        // Update existing article
        result = await updateArticle(parseInt(id), formData);
        if (result) {
          showToast('Article updated successfully', 'success');
          navigate(`/admin/articles`);
        } else {
          showToast('Failed to update article', 'error');
        }
      } else {
        // Create new article
        result = await createArticle(formData);
        if (result) {
          showToast('Article created successfully', 'success');
          navigate(`/admin/articles`);
        } else {
          showToast('Failed to create article', 'error');
        }
      }
    } catch (err) {
      showToast('An error occurred while saving the article', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/admin/articles')}
          className="flex items-center text-primary-600 hover:text-primary-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to Articles
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Article' : 'Create New Article'}
        </h1>
      </div>

      {isLoading && isEditing ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-primary-100 rounded"></div>
          </div>
        </div>
      ) : error && isEditing ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Error loading article</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <ArticleForm
              initialData={isEditing ? article : undefined}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleEditor;