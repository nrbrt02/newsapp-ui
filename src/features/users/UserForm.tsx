import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import type { User, UserUpdateRequest } from '../../types/user.types';

// Set up validation schema with Zod
const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  profilePic: z.string().optional().nullable(),
  role: z.enum(['ADMIN', 'WRITER', 'READER']),
  isActive: z.boolean(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  // If password is provided, confirmPassword should match
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: User;
  isEdit?: boolean;
  onSubmit: (data: UserUpdateRequest | UserFormData) => void;
  isSubmitting: boolean;
  error?: string | null;
}

const UserForm = ({ 
  initialData,
  isEdit = false,
  onSubmit,
  isSubmitting,
  error
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      password: '',
      confirmPassword: '',
    } : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profilePic: '',
      role: 'READER',
      isActive: true,
      username: '',
      password: '',
      confirmPassword: '',
    }
  });

  // Watch profilePic to update preview
  const profilePicValue = watch('profilePic');

  useEffect(() => {
    if (profilePicValue && typeof profilePicValue === 'string') {
      setPreviewImage(profilePicValue);
    } else {
      setPreviewImage(null);
    }
  }, [profilePicValue]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const processSubmit = (data: UserFormData) => {
    // If no password is provided in edit mode, remove it from the data
    if (isEdit && !data.password) {
      const { password, confirmPassword, ...rest } = data;
      onSubmit(rest);
    } else {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username*
          </label>
          <input
            id="username"
            type="text"
            className={`input ${errors.username ? 'border-red-500' : ''}`}
            disabled={isEdit || isSubmitting}
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            id="email"
            type="email"
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name*
          </label>
          <input
            id="firstName"
            type="text"
            className={`input ${errors.firstName ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        
        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name*
          </label>
          <input
            id="lastName"
            type="text"
            className={`input ${errors.lastName ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className={`input ${errors.phone ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
            {...register('phone')}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
        
        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role*
          </label>
          <select
            id="role"
            className={`input ${errors.role ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
            {...register('role')}
          >
            <option value="READER">Reader</option>
            <option value="WRITER">Writer</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
        
        {/* Is Active */}
        <div>
          <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
            Status*
          </label>
          <div className="flex items-center mt-2">
            <input
              id="isActive"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              disabled={isSubmitting}
              {...register('isActive')}
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>
          {errors.isActive && (
            <p className="mt-1 text-sm text-red-600">{errors.isActive.message}</p>
          )}
        </div>
      </div>
      
      {/* Profile Picture */}
      <div>
        <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">
          Profile Picture URL
        </label>
        <input
          id="profilePic"
          type="text"
          className={`input ${errors.profilePic ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
          {...register('profilePic')}
        />
        {errors.profilePic && (
          <p className="mt-1 text-sm text-red-600">{errors.profilePic.message}</p>
        )}
        {previewImage && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <img
              src={previewImage}
              alt="Profile Preview"
              className="h-20 w-20 rounded-full object-cover border border-gray-200"
              onError={() => {
                setPreviewImage(null);
                setValue('profilePic', '');
              }}
            />
          </div>
        )}
      </div>
      
      {/* Password fields - shown in create mode or optionally in edit mode */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          {isEdit ? 'Change Password (Optional)' : 'Set Password'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {isEdit ? 'New Password' : 'Password'}*
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
                {...register('password', { required: !isEdit })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password*
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className={`input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
                {...register('confirmPassword', { required: !isEdit })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;