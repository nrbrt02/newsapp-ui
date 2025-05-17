import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit, FiEye, FiTrash2, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useArticle } from '../../hooks/useArticle';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import ArticleCard from '../../components/article/ArticleCard';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ArticleForm from './ArticleForm';
import ArticleDetailsModal from './ArticleDetailsModal';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import type { ArticleCreateRequest } from '../../types/article.types';

const ArticleList = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const { 
    articles, 
    article,
    isLoading, 
    error, 
    getArticles,
    getArticleById,
    createArticle,
    updateArticle, 
    deleteArticle,
    clearArticle,
    clearError
  } = useArticle();
  
  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // State for operations
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for pagination and search
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Load articles when component mounts
  const loadArticles = useCallback((page = 0) => {
    getArticles(page);
  }, [getArticles]);

  useEffect(() => {
    loadArticles(currentPage);
    
    // Cleanup function to prevent memory leaks and reset state
    return () => {
      clearArticle();
      clearError();
    };
  }, [loadArticles, currentPage, clearArticle, clearError]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
    // If search term is empty, load all articles
    // Otherwise, implement search functionality
    if (!term.trim()) {
      loadArticles(0);
    } else {
      // Implement search logic or filter client-side for now
      // This could be replaced with an API call to search articles
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateClick = () => {
    clearArticle(); // Clear any existing article data
    setShowCreateModal(true);
  };

  const handleEditClick = async (id: number) => {
    setSelectedArticleId(id);
    const success = await getArticleById(id);
    if (success) {
      setShowEditModal(true);
    } else {
      showToast('Failed to load article details', 'error');
    }
  };

  const handleViewClick = async (id: number) => {
    setSelectedArticleId(id);
    const success = await getArticleById(id);
    if (success) {
      setShowDetailsModal(true);
    } else {
      showToast('Failed to load article details', 'error');
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedArticleId(id);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = async (formData: ArticleCreateRequest) => {
    setIsSubmitting(true);
    
    try {
      const result = await createArticle(formData);
      
      if (result) {
        showToast('Article created successfully', 'success');
        setShowCreateModal(false);
        loadArticles(currentPage);
      } else {
        showToast('Failed to create article', 'error');
      }
    } catch (err) {
      showToast('An error occurred while creating the article', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (formData: ArticleCreateRequest) => {
    if (!selectedArticleId) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await updateArticle(selectedArticleId, formData);
      
      if (result) {
        showToast('Article updated successfully', 'success');
        setShowEditModal(false);
        loadArticles(currentPage);
      } else {
        showToast('Failed to update article', 'error');
      }
    } catch (err) {
      showToast('An error occurred while updating the article', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedArticleId) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteArticle(selectedArticleId);
      
      if (success) {
        showToast('Article deleted successfully', 'success');
        setShowDeleteModal(false);
        loadArticles(currentPage);
      } else {
        showToast('Failed to delete article', 'error');
      }
    } catch (err) {
      showToast('An error occurred while deleting the article', 'error');
    } finally {
      setIsDeleting(false);
      setSelectedArticleId(null);
    }
  };

  // Check if user can create/edit articles
  const canManageArticles = user?.role === 'ADMIN' || user?.role === 'WRITER';
  
  // Filter articles based on search term (client-side filtering)
  const filteredArticles = articles?.content
    ? articles.content.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading && (!articles || articles.content.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-primary-600 text-4xl mr-2" />
        <span className="text-gray-700">Loading articles...</span>
      </div>
    );
  }

  if (error && (!articles || articles.content.length === 0)) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 flex items-start">
        <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium">Error loading articles</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Articles</h1>
        {canManageArticles && (
          <button
            onClick={handleCreateClick}
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            New Article
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search articles..." 
          initialValue={searchTerm}
        />
      </div>

      {articles && articles.content.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredArticles.map((article) => (
              <div key={article.id} className="relative group">
                <ArticleCard article={article} />
                
                {/* Overlay with action buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewClick(article.id)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                    
                    {canManageArticles && (user?.role === 'ADMIN' || user?.id === article.author.id) && (
                      <>
                        <button
                          onClick={() => handleEditClick(article.id)}
                          className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(article.id)}
                          className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {articles.totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={articles.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md p-6 text-center">
          <p className="text-lg">
            {searchTerm
              ? `No articles found matching "${searchTerm}"`
              : 'No articles found.'
            }
          </p>
          {canManageArticles && (
            <button
              onClick={handleCreateClick}
              className="mt-4 btn btn-primary"
            >
              Create your first article
            </button>
          )}
        </div>
      )}

      {/* Create Article Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Article"
        size="xl"
      >
        <ArticleForm
          onSubmit={handleCreateSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </Modal>

      {/* Edit Article Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Article"
        size="xl"
      >
        {article && (
          <ArticleForm
            initialData={article}
            onSubmit={handleEditSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
      </Modal>

      {/* View Article Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Article Details"
        size="xl"
      >
        {article && <ArticleDetailsModal article={article} />}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isSubmitting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ArticleList;