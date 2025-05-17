import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import type { User } from '../../types/user.types';
import { useAuth } from '../../hooks/useAuth';

interface UserItemProps {
  user: User;
  onDelete: (id: number) => void;
  onEdit: () => void;
  onViewDetails: () => void;
}

const UserItem = ({ user, onDelete, onEdit, onViewDetails }: UserItemProps) => {
  const { user: currentUser } = useAuth();

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
        Inactive
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            Admin
          </span>
        );
      case 'WRITER':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Writer
          </span>
        );
      case 'READER':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Reader
          </span>
        );
      default:
        return null;
    }
  };

  const canModify = currentUser?.role === 'ADMIN' || currentUser?.id === user.id;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {user.profilePic ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.profilePic}
                alt={user.username}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                {user.firstName ? user.firstName[0] : user.username[0]}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.username}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getRoleBadge(user.role)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(user.isActive)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={onViewDetails}
            className="text-gray-600 hover:text-primary-600"
            title="View Details"
          >
            <FiInfo size={18} />
          </button>
          {canModify && (
            <>
              <button
                onClick={onEdit}
                className="text-gray-600 hover:text-primary-600"
                title="Edit User"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="text-gray-600 hover:text-red-600"
                title="Delete User"
              >
                <FiTrash2 size={18} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserItem;