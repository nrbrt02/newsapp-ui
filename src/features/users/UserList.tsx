import { useState, useEffect  } from 'react';
import { FiPlus, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useUser } from '../../hooks/useUser';
import UserItem from './UserItem';
import Modal from '../../components/ui/Modal';
import UserForm from './UserForm';
import UserDetailsModal from './UserDetailsModal';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import { useAuth } from '../../hooks/useAuth';
import type { User, UserCreateRequest, UserUpdateRequest } from '../../types/user.types';
import type { UserFormData } from './UserForm';
import { useToast } from '../../context/ToastContext';

const ITEMS_PER_PAGE = 10;

const UserList = () => {
  const { 
    users = [],
    isLoading, 
    error, 
    totalPages: serverTotalPages = 0,
    currentPage = 0,
    getUsers, 
    deleteUser,
    createUser,
    updateUser
  } = useUser();
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const handlePageChange = (page: number) => {
    getUsers(page);
  };

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      showToast('User deleted successfully', 'success');
      await deleteUser(userToDelete);
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

const handleCreateUser = async (data: UserFormData) => {
  try {
    setIsCreating(true);
    const createData: UserCreateRequest = {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      profilePic: data.profilePic,
      role: data.role,
      isActive: data.isActive,
      password: data.password || '',
    };
    await createUser(createData);
    showToast('User created successfully', 'success');
    await getUsers();
    setShowCreateModal(false);
  } catch (error) {
    showToast('Failed to create user', 'error');
  } finally {
    setIsCreating(false);
  }
};

const handleUpdateUser = async (data: UserFormData) => {
  if (!editingUser) return;
  
  try {
    setIsUpdating(true);
    const updateData: UserUpdateRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      profilePic: data.profilePic,
      role: data.role,
      isActive: data.isActive,
      ...(data.password ? { password: data.password } : {}),
    };
    await updateUser(editingUser.id, updateData);
    showToast('User updated successfully', 'success');
    setEditingUser(null);
  } catch (error) {
    showToast('Failed to update user', 'error');
  } finally {
    setIsUpdating(false);
  }
};

  // Client-side search filtering
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate client-side pagination
  const clientTotalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
        <span className="ml-2 text-gray-700">Loading users...</span>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <FiAlertCircle className="text-3xl mr-2" />
        <span>Error loading users: {error}</span>
      </div>
    );
  }

  const canCreateUser = currentUser?.role === 'ADMIN';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        {canCreateUser && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="mr-1" />
            Add User
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar 
          onSearch={setSearchTerm} 
          placeholder="Search users..." 
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map(user => (
                  <UserItem 
                    key={user.id} 
                    user={user} 
                    onDelete={handleDeleteClick}
                    onEdit={() => setEditingUser(user)}
                    onViewDetails={() => setViewingUser(user)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Always show pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination 
            currentPage={currentPage}
            totalPages={clientTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Create User Modal */}
<Modal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  title="Create New User"
>
  <div className="p-6">
    <UserForm 
      onSubmit={(data) => handleCreateUser(data)}
      isSubmitting={isCreating}
    />
  </div>
</Modal>

{/* Edit User Modal */}
<Modal
  isOpen={!!editingUser}
  onClose={() => setEditingUser(null)}
  title={editingUser ? `Edit User: ${editingUser.username}` : ''}
>
  <div className="p-6">
    {editingUser && (
      <UserForm
        initialData={editingUser}
        isEdit={true}
        onSubmit={(data) => handleUpdateUser(data)}
        isSubmitting={isUpdating}
      />
    )}
  </div>
</Modal>

      {/* User Details Modal */}
      <Modal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        title="User Details"
      >
        {viewingUser && <UserDetailsModal user={viewingUser} />}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={userToDelete !== null}
        onClose={cancelDelete}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="mb-6">
            Are you sure you want to delete this user? This action cannot be undone.
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

export default UserList;