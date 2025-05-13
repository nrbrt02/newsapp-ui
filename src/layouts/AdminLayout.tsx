import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  FiHome, 
  FiFileText, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiPlusCircle,
  FiUser
} from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for larger screens */}
      <aside 
        className={`
          md:block
          ${sidebarOpen ? 'block' : 'hidden'}
          bg-white shadow-md w-64 fixed md:static inset-y-0 left-0 z-20
          transition-transform duration-300 ease-in-out
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="text-2xl font-bold text-primary-700">
            NewsApp
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <FiHome size={18} className="mr-3" />
            Dashboard
          </Link>
          
          <div className="py-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Content
            </h3>
          </div>
          
          <Link 
            to="/admin/articles" 
            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <FiFileText size={18} className="mr-3" />
            Articles
          </Link>
          
          <Link 
            to="/admin/articles/create" 
            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <FiPlusCircle size={18} className="mr-3" />
            Create Article
          </Link>
          
          {user?.role === 'ADMIN' && (
            <>
              <div className="py-2">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </h3>
              </div>
              
              <Link 
      to="/admin/users" 
      className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
      onClick={() => setSidebarOpen(false)}
    >
      <FiUsers size={18} className="mr-3" />
      Users
    </Link>
              
              <Link 
                to="/admin/categories" 
                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                <FiSettings size={18} className="mr-3" />
                Categories
              </Link>
              
              <Link 
                to="/admin/tags" 
                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                <FiSettings size={18} className="mr-3" />
                Tags
              </Link>
            </>
          )}
          
          <div className="py-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </h3>
          </div>
          
          <Link 
            to="/admin/profile" 
            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <FiUser size={18} className="mr-3" />
            Profile
          </Link>
          
          <button 
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }} 
            className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <FiLogOut size={18} className="mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <button 
              className="md:hidden text-gray-500 focus:outline-none" 
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;