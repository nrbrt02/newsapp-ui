import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMenu, FiX } from 'react-icons/fi';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-primary-700">
              NewsApp
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary-600">
                About
              </Link>
              {isAuthenticated ? (
                <>
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                  )}
                  {(user?.role === 'ADMIN' || user?.role === 'WRITER') && (
                    <Link to="/admin/articles/create" className="text-gray-700 hover:text-primary-600">
                      Write Article
                    </Link>
                  )}
                  <Link to="/admin/profile" className="text-gray-700 hover:text-primary-600">
                    Profile
                  </Link>
                  <button 
                    onClick={() => logout()} 
                    className="text-gray-700 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-700 hover:text-primary-600">
                    Register
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-500 focus:outline-none" 
              onClick={toggleMenu}
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-3">
              <Link 
                to="/" 
                className="block text-gray-700 hover:text-primary-600"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-700 hover:text-primary-600"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              {isAuthenticated ? (
                <>
                  {user?.role === 'ADMIN' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {(user?.role === 'ADMIN' || user?.role === 'WRITER') && (
                    <Link 
                      to="/admin/articles/create" 
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      Write Article
                    </Link>
                  )}
                  <Link 
                    to="/admin/profile" 
                    className="block text-gray-700 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }} 
                    className="block w-full text-left text-gray-700 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block text-gray-700 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block text-gray-700 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="container-custom py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold mb-4">NewsApp</h2>
              <p className="text-gray-400">
                The latest news and articles delivered right to you.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-white">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white">
                      Technology
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white">
                      Health
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white">
                      Science
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Connect</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NewsApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;