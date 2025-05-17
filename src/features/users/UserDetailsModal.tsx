import { format } from 'date-fns';
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import type { User } from '../../types/user.types';

interface UserDetailsModalProps {
  user: User;
}

const UserDetailsModal = ({ user }: UserDetailsModalProps) => {
  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy, h:mm a');
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="border-b pb-4">
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

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">User Information</h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center">
              <FiUser className="text-gray-500 mr-2" />
              <span className="text-gray-800 font-medium">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-24">Username:</span>
              <span className="text-gray-800 font-medium">@{user.username}</span>
            </div>
            <div className="flex items-center">
              <FiMail className="text-gray-500 mr-2" />
              <span className="text-gray-800 font-medium">{user.email}</span>
            </div>
            <div className="flex items-center">
              <FiPhone className="text-gray-500 mr-2" />
              <span className="text-gray-800 font-medium">
                {user.phone || 'Not provided'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-24">Role:</span>
              <span className="text-gray-800 font-medium capitalize">{user.role.toLowerCase()}</span>
            </div>
            <div className="flex items-center">
              <FiCalendar className="text-gray-500 mr-2" />
              <span className="text-gray-800">
                Joined {formattedDate(user.createdAt)}
              </span>
            </div>
            <div className="flex items-center">
              <FiClock className="text-gray-500 mr-2" />
              <span className="text-gray-800">
                Last updated {formattedDate(user.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;