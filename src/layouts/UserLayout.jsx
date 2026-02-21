import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  HomeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { unreadCount } = useNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { path: '/browse', label: 'Browse', icon: HomeIcon },
    { path: '/matches', label: 'Matches', icon: HeartIcon },
    { path: '/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
    { path: '/notifications', label: 'Notifications', icon: BellIcon, badge: unreadCount },
    { path: '/profile/me', label: 'Profile', icon: UserCircleIcon },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/browse" className="text-xl font-bold text-primary-600">
              Marriage Connect
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors relative ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{link.label}</span>
                  {link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}

              <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                <Link
                  to="/settings"
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                  title="Sign Out"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-6 gap-1 px-2 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center py-2 rounded-lg transition-colors relative ${
                isActive(link.path)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600'
              }`}
            >
              <link.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{link.label}</span>
              {link.badge > 0 && (
                <span className="absolute top-1 right-1/4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {link.badge > 9 ? '9+' : link.badge}
                </span>
              )}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center py-2 rounded-lg transition-colors text-gray-600 hover:text-red-600"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </nav>

      {/* Add padding for mobile bottom nav */}
      <div className="md:hidden h-20"></div>
    </div>
  );
};

export default UserLayout;
