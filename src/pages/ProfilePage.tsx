import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiAlertCircle, FiEye, FiEyeOff, FiSave, FiCheck } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, isLoading, error, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePic: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  // Populate form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePic: user.profilePic || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Clear success message when form changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
    if (!changePassword) {
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validate basic fields
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }
    
    // Phone is optional, but validate format if provided
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
      errors.phone = 'Phone number should be 10-15 digits';
    }
    
    // Validate password fields if changing password
    if (changePassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }
      
      if (!formData.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm() || !user) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Create update request object (exclude password fields if not changing password)
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profilePic: formData.profilePic,
        ...(changePassword && {
          password: formData.newPassword
        })
      };
      
      const success = await updateUserProfile(user.id, updateData);
      
      if (success) {
        setSuccessMessage('Profile updated successfully!');
        // Reset password fields if they were filled
        if (changePassword) {
          setFormData({
            ...formData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setChangePassword(false);
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsUpdating(false);
    }
  };

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

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 flex items-start">
        <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium">User not found</h3>
          <p className="text-sm">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
      
      {/* Display error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Display success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded flex items-start">
          <FiCheck className="mt-1 mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`input ${formErrors.firstName ? 'border-red-500' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`input ${formErrors.lastName ? 'border-red-500' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`input ${formErrors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`input ${formErrors.phone ? 'border-red-500' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>
              
              {/* Profile Picture URL */}
              <div className="md:col-span-2">
                <label htmlFor="profilePic" className="block text-gray-700 font-medium mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  id="profilePic"
                  name="profilePic"
                  className="input"
                  value={formData.profilePic}
                  onChange={handleChange}
                  placeholder="https://example.com/profile-picture.jpg"
                />
                {formData.profilePic && (
                  <div className="mt-2 flex items-center">
                    <img
                      src={formData.profilePic}
                      alt="Profile Preview"
                      className="h-12 w-12 rounded-full object-cover mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                    <span className="text-sm text-gray-500">Preview (if URL is valid)</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Change Password Toggle */}
            <div className="mb-6">
              <button
                type="button"
                onClick={toggleChangePassword}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {changePassword ? 'Cancel Password Change' : 'Change Password'}
              </button>
            </div>
            
            {/* Password Fields */}
            {changePassword && (
              <div className="space-y-4 mb-6 border-t border-gray-200 pt-6">
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                    Current Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      className={`input pr-10 ${formErrors.currentPassword ? 'border-red-500' : ''}`}
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {formErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.currentPassword}</p>
                  )}
                </div>
                
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                    New Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      className={`input pr-10 ${formErrors.newPassword ? 'border-red-500' : ''}`}
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {formErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>
                  )}
                </div>
                
                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm New Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`input pr-10 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`btn btn-primary flex items-center ${
                  isUpdating ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={isUpdating}
              >
                <FiSave className="mr-2" />
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Account Info */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 text-sm">Username</span>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Role</span>
              <p className="font-medium">{user.role}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Account Status</span>
              <p className="font-medium">
                {user.isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Member Since</span>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;