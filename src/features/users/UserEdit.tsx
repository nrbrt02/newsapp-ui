import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useUser } from '../../hooks/useUser';
import UserForm from './UserForm';
import type { UserUpdateRequest } from '../../types/user.types';

const UserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');
  const navigate = useNavigate();
  const { user, isLoading, error, getUserById, updateUser, resetError, resetUser } = useUser();
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      getUserById(userId);
    }

    // Reset error when component mounts
    resetError();

    // Cleanup when component unmounts
    return () => {
      resetUser();
      resetError();
    };
  }, [userId, getUserById, resetError, resetUser]);

  const handleSubmit = async (userData: UserUpdateRequest) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const result = await updateUser(userId, userData);
      
      if (result) {
        // Navigate to user details page
        navigate(`/admin/users/${userId}`);
      } else {
        setFormError('Failed to update user. Please try again.');
      }
    } catch (err) {
      setFormError('An error occurred while updating the user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-primary-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !user) {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/admin/users/${userId}`)}
          className="flex items-center text-primary-600 hover:text-primary-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to User Details
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
        </div>
        
        <div className="p-6">
          {user ? (
            <UserForm
              initialData={user}
              isEdit={true}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={formError}
            />
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">User not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEdit;