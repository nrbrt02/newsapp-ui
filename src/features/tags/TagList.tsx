import React, { useState } from 'react';
import { FiPlus, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useTags } from '../../context/TagContext';
import { useToast } from '../../context/ToastContext';
import TagItem from './TagItem';
import Modal from '../categories/Modal';
import TagForm from './TagForm';
import TagDetailsModal from './TagDetailsModal';
import type { TagFormData, Tag } from '../../types/tag.types';
import { useAuth } from '../../hooks/useAuth';

const TagList: React.FC = () => {
  const { tags, loading, error, deleteTag, createTag } = useTags();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleDeleteClick = (id: number) => {
    setTagToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (tagToDelete) {
      setIsDeleting(true);
      const success = await deleteTag(tagToDelete);
      setIsDeleting(false);
      if (success) {
        setShowDeleteModal(false);
        setTagToDelete(null);
        showToast('Tag deleted successfully', 'success');
      } else {
        showToast('Failed to delete tag', 'error');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTagToDelete(null);
  };

  const handleCreateTag = async (data: TagFormData) => {
    setIsCreating(true);
    const result = await createTag(data);
    setIsCreating(false);
    
    if (result) {
      setShowCreateModal(false);
      showToast('Tag created successfully', 'success');
    } else {
      showToast('Failed to create tag', 'error');
    }
  };

  const handleViewDetails = (tag: Tag) => {
    setSelectedTag(tag);
    setShowDetailsModal(true);
  };

  if (loading && tags.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
        <span className="ml-2 text-gray-700">Loading tags...</span>
      </div>
    );
  }

  if (error && tags.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <FiAlertCircle className="text-3xl mr-2" />
        <span>Error loading tags: {error}</span>
      </div>
    );
  }

  const canCreateTag = user?.role === 'ADMIN' || user?.role === 'WRITER';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tags</h1>
        {canCreateTag && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
          >
            <FiPlus className="mr-1" />
            Add Tag
          </button>
        )}
      </div>

      {tags.length > 0 ? (
        <div className="space-y-4">
          {tags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              onDelete={handleDeleteClick}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tags found.</p>
          {canCreateTag && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create your first tag
            </button>
          )}
        </div>
      )}

      {/* Create Tag Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create New Tag"
      >
        <div className="p-6">
          <TagForm 
            onSubmit={handleCreateTag} 
            isSubmitting={isCreating} 
          />
        </div>
      </Modal>

      {/* View Details Modal */}
      {selectedTag && (
        <Modal 
          isOpen={showDetailsModal} 
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTag(null);
          }}
          title="Tag Details"
        >
          <TagDetailsModal tag={selectedTag} />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={cancelDelete}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="mb-6">
            Are you sure you want to delete this tag? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TagList;