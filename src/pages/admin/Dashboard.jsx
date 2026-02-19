import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  UserGroupIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  FlagIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Fetch admin statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats/overview');
      const d = response.data.data;
      return {
        pendingUsers: d?.users?.pending || 0,
        totalUsers: d?.users?.total || 0,
        activeUsers: d?.users?.active || 0,
        pendingProfiles: d?.profiles?.pending || 0,
        pendingVerifications: d?.verification?.pending || 0,
        openReports: d?.reports?.pending || 0,
        totalMatches: d?.matching?.totalMatches || 0,
        verificationRate: d?.verification?.rate || 0,
        recentActivity: [],
      };
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: 'Pending Users',
      value: stats?.pendingUsers || 0,
      icon: UserGroupIcon,
      color: 'text-yellow-600 bg-yellow-100',
      link: '/admin/users/pending',
    },
    {
      label: 'Pending Profiles',
      value: stats?.pendingProfiles || 0,
      icon: DocumentCheckIcon,
      color: 'text-blue-600 bg-blue-100',
      link: '/admin/profiles/pending',
    },
    {
      label: 'Pending Verifications',
      value: stats?.pendingVerifications || 0,
      icon: ShieldCheckIcon,
      color: 'text-purple-600 bg-purple-100',
      link: '/admin/verifications',
    },
    {
      label: 'Open Reports',
      value: stats?.openReports || 0,
      icon: FlagIcon,
      color: 'text-red-600 bg-red-100',
      link: '/admin/reports',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UserGroupIcon,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Total Matches',
      value: stats?.totalMatches || 0,
      icon: HeartIcon,
      color: 'text-pink-600 bg-pink-100',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage users, profiles, verifications, and reports
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link || '#'}
              className={`card hover:shadow-md transition-shadow ${
                !stat.link ? 'pointer-events-none' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/users/pending"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserGroupIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Review Pending Users</p>
                <p className="text-sm text-gray-600">{stats?.pendingUsers || 0} waiting</p>
              </div>
            </Link>
            <Link
              to="/admin/profiles/pending"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Review Profiles</p>
                <p className="text-sm text-gray-600">{stats?.pendingProfiles || 0} waiting</p>
              </div>
            </Link>
            <Link
              to="/admin/verifications"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Review Verifications</p>
                <p className="text-sm text-gray-600">{stats?.pendingVerifications || 0} waiting</p>
              </div>
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FlagIcon className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Handle Reports</p>
                <p className="text-sm text-gray-600">{stats?.openReports || 0} open</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No recent activity
              </p>
            )}
          </div>

          {/* Platform Health */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Verified Users</span>
                  <span className="font-medium text-gray-900">
                    {stats?.verificationRate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${stats?.verificationRate || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Active Matches</span>
                  <span className="font-medium text-gray-900">
                    {stats?.activeMatchRate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats?.activeMatchRate || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium text-gray-900">
                    {stats?.profileCompletionRate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${stats?.profileCompletionRate || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
