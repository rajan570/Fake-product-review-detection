import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                ReviewGuard
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                    <Shield className="h-5 w-5 mr-1" />
                    Admin
                  </Link>
                ) : null}
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                  <LayoutDashboard className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 border-l pl-4 border-gray-300 dark:border-gray-600">
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
