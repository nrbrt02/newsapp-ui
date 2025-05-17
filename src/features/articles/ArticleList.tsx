import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useArticle } from '../../hooks/useArticle';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import ArticleTable from './ArticleTable';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
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
    getArticlesByCurrentUser,
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

  // Load articles function - stable reference
  const loadArticles = useCallback(async (page = 0) => {
    try {
      if (user?.role === 'ADMIN') {
        await getArticles(page);
      } else {
        await getArticlesByCurrentUser(page);
      }
    } catch (error) {
      console.error("Error loading articles:", error);
    }
  }, [user?.role, getArticles, getArticlesByCurrentUser]);

  // Load articles effect
  useEffect(() => {
    const fetchData = async () => {
      await loadArticles(currentPage);
    };
    
    fetchData();
  }, [currentPage]); // Only depend on currentPage

  // Cleanup effect
  useEffect(() => {
    return () => {
      clearArticle();
      clearError();
    };
  }, [clearArticle, clearError]);

  // Search handler with debounce
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  }, []);

  // Other handlers remain the same...
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCreateClick = useCallback(() => {
    clearArticle();
    setShowCreateModal(true);
  }, [clearArticle]);

  const handleEditClick = useCallback(async (id: number) => {
    setSelectedArticleId(id);
    const success = await getArticleById(id);
    if (success) {
      setShowEditModal(true);
    } else {
      showToast('Failed to load article details', 'error');
    }
  }, [getArticleById, showToast]);

  const handleViewClick = useCallback(async (id: number) => {
    setSelectedArticleId(id);
    const success = await getArticleById(id);
    if (success) {
      setShowDetailsModal(true);
    } else {
      showToast('Failed to load article details', 'error');
    }
  }, [getArticleById, showToast]);

  const handleDeleteClick = useCallback((id: number) => {
    setSelectedArticleId(id);
    setShowDeleteModal(true);
  }, []);
  
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
  
  // Get filtered articles based on search term (client-side filtering)
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
        <h1 className="text-2xl font-bold text-gray-800">
          {user?.role === 'ADMIN' ? 'All Articles' : 'My Articles'}
        </h1>
        {canManageArticles && (
          <Link
            to="/admin/articles/create"
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            New Article
          </Link>
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
          {/* Article Table */}
          <ArticleTable 
            articles={filteredArticles}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
          
          {/* Pagination */}
          {articles.totalPages > 1 && (
            <div className="mt-6">
              <Pagination 
                currentPage={currentPage}
                totalPages={articles.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md p-6 text-center">
          <p className="text-lg">
            {searchTerm
              ? `No articles found matching "${searchTerm}"`
              : user?.role === 'ADMIN' 
                ? 'No articles found in the system.' 
                : 'You haven\'t created any articles yet.'
            }
          </p>
          {canManageArticles && (
            <Link
              to="/admin/articles/create"
              className="mt-4 btn btn-primary inline-block"
            >
              Create your first article
            </Link>
          )}
        </div>
      )}

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