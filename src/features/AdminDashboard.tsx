import { Link } from 'react-router-dom';
import { FiFileText, FiUsers, FiTag, FiBarChart2, FiSettings } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/news"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <FiFileText className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">News Management</h2>
              <p className="text-gray-500">Manage articles and content</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <FiUsers className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
              <p className="text-gray-500">Manage user accounts</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <FiTag className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Category Management</h2>
              <p className="text-gray-500">Manage content categories</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <FiBarChart2 className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Analytics</h2>
              <p className="text-gray-500">View site statistics</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <FiSettings className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
              <p className="text-gray-500">Configure site settings</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard; 