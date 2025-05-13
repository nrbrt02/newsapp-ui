import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useUser } from '../../hooks/useUser';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useState } from 'react';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');
  const navigate = useNavigate();
  const { user, isLoading, error, getUserById, deleteUser, resetUser } = useUser();
  const { user: currentUser } = useAuth();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userId) {
      getUserById(userId);
    }

    // Cleanup when component unmounts
    return () => {
      resetUser();
    };
  }, [userId, getUserById, resetUser]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const success = await deleteUser(userId);
    setIsDeleting(false);
    
    if (success) {
      setShowDeleteModal(false);
      navigate('/admin/users');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Check if current user can edit or delete this user
  const canModify = currentUser?.role === 'ADMIN' || currentUser?.id === userId;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-primary-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 flex items-start">
        <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium">Error loading user</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md p-6 text-center">
        <p className="text-lg">User not found.</p>
        <button
          onClick={() => navigate('/admin/users')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center text-primary-600 hover:text-primary-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to Users
        </button>
        
        {canModify && (
          <div className="flex space-x-2">
            <Link
              to={`/admin/users/edit/${user.id}`}
              className="btn btn-secondary flex items-center"
            >
              <FiEdit className="mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="btn bg-red-600 text-white hover:bg-red-700 flex items-center"
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-20 w-20">
              {user.profilePic ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={user.profilePic}
                  alt={user.username}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-semibold text-primary-600">
                  {user.firstName ? user.firstName[0] : user.username[0]}
                </div>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h1>
              <div className="mt-1 flex items-center text-gray-500">
                @{user.username}
                {user.isActive ? (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-xs text-green-800 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-xs text-red-800 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <div className="mt-1">
                <span className="px-2 py-1 bg-primary-100 text-xs text-primary-800 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <p className="text-gray-800">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Phone
              </label>
              <p className="text-gray-800">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Member Since
              </label>
              <p className="text-gray-800">
                {format(new Date(user.createdAt), 'PPP')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </label>
              <p className="text-gray-800">
                {format(new Date(user.updatedAt), 'PPP')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity section placeholder - could be expanded with actual user activity */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <p className="text-gray-500 text-center py-4">
            Activity tracking is not implemented yet.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete the user ${user.username}? This action cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isSubmitting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default UserDetails;