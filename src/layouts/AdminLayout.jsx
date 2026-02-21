import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  FlagIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/admin/users/pending', label: 'Pending Users', icon: UserGroupIcon },
    { path: '/admin/profiles/pending', label: 'Pending Profiles', icon: DocumentCheckIcon },
    { path: '/admin/verifications', label: 'Verifications', icon: ShieldCheckIcon },
    { path: '/admin/reports', label: 'Reports', icon: FlagIcon },
    { path: '/admin/statistics', label: 'Statistics', icon: ChartBarIcon },
    { path: '/settings/invites', label: 'Invite Codes', icon: TicketIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin/dashboard" className="text-xl font-bold text-primary-600">
              Admin Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-3 gap-1 px-2 py-2">
          {navLinks.slice(0, 6).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600'
              }`}
            >
              <link.icon className="h-6 w-6" />
              <span className="text-xs mt-1 text-center">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Add padding for mobile bottom nav */}
      <div className="md:hidden h-20"></div>
    </div>
  );
};

export default AdminLayout;
