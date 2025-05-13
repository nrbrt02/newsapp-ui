import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import UserForm from './UserForm';
import { useAuth } from '../../hooks/useAuth';
import type { RegisterRequest } from '../../types/auth.types';

const UserCreate = () => {
  const navigate = useNavigate();
  // Removed isLoading since it's not being used in this component
  const { register, error, clearError } = useAuth();
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear any existing errors
    clearError();
  }, [clearError]);

  const handleSubmit = async (userData: any) => {
    setIsSubmitting(true);
    setFormError(null);
    
    // Create registration data
    const registrationData: RegisterRequest = {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || ''
    };
    
    try {
      const result = await register(registrationData);
      
      if (result) {
        // Navigate to users list
        navigate('/admin/users');
      } else {
        setFormError('Failed to create user. Please try again.');
      }
    } catch (err) {
      setFormError('An error occurred while creating the user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center text-primary-600 hover:text-primary-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to Users
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Create New User</h1>
        </div>
        
        <div className="p-6">
          <UserForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={formError || error}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCreate;