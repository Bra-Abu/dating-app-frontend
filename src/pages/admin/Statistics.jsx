import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  FlagIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const Statistics = () => {
  // Fetch statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-detailed-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/statistics/detailed');
      return response.data;
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
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      change: stats?.userGrowth || 0,
      icon: UserGroupIcon,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Active Users (30d)',
      value: stats?.activeUsers || 0,
      change: stats?.activeUserGrowth || 0,
      icon: UserGroupIcon,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Total Matches',
      value: stats?.totalMatches || 0,
      change: stats?.matchGrowth || 0,
      icon: HeartIcon,
      color: 'text-pink-600 bg-pink-100',
    },
    {
      label: 'Messages Sent',
      value: stats?.totalMessages || 0,
      change: stats?.messageGrowth || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'Verified Users',
      value: stats?.verifiedUsers || 0,
      change: null,
      icon: ShieldCheckIcon,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      label: 'Reports Handled',
      value: stats?.reportsHandled || 0,
      change: null,
      icon: FlagIcon,
      color: 'text-red-600 bg-red-100',
    },
  ];

  const getTrendIcon = (change) => {
    if (!change || change === 0) return null;
    return change > 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (change) => {
    if (!change || change === 0) return 'text-gray-600';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600 mt-1">
            Platform metrics and analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                {stat.change !== null && stat.change !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(stat.change)}`}>
                    {getTrendIcon(stat.change)}
                    <span className="font-medium">{Math.abs(stat.change)}%</span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Breakdown Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Demographics */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Male</span>
                  <span className="font-medium text-gray-900">
                    {stats?.genderBreakdown?.male || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats?.genderBreakdown?.male || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Female</span>
                  <span className="font-medium text-gray-900">
                    {stats?.genderBreakdown?.female || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-600 h-2 rounded-full"
                    style={{ width: `${stats?.genderBreakdown?.female || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Religious Distribution */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Religious Distribution</h2>
            <div className="space-y-3">
              {stats?.religionBreakdown && Object.entries(stats.religionBreakdown).map(([religion, percentage]) => (
                <div key={religion}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 capitalize">{religion}</span>
                    <span className="font-medium text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Age Distribution */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h2>
            <div className="space-y-3">
              {stats?.ageBreakdown && Object.entries(stats.ageBreakdown).map(([range, count]) => (
                <div key={range} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{range} years</span>
                  <span className="text-sm font-medium text-gray-900">{count} users</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Messages per Match</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.avgMessagesPerMatch || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Matches per User</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.avgMatchesPerUser || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Daily Active Users (Avg)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.avgDailyActiveUsers || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Phone Verified</span>
                  <span className="font-medium text-gray-900">
                    {stats?.phoneVerificationRate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${stats?.phoneVerificationRate || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Photo Verified</span>
                  <span className="font-medium text-gray-900">
                    {stats?.photoVerificationRate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats?.photoVerificationRate || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">ID Verified</span>
                  <span className="font-medium text-gray-900">
                    {stats?.idVerificationRate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${stats?.idVerificationRate || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Locations */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h2>
            <div className="space-y-3">
              {stats?.topLocations && stats.topLocations.map((location, index) => (
                <div key={location.state} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{location.state}</span>
                  </div>
                  <span className="text-sm text-gray-600">{location.count} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Match Success Rate</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.matchSuccessRate || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Of likes result in matches
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Message Response Rate</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.messageResponseRate || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Of messages get replies
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">User Retention (30d)</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats?.retentionRate || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Users active after 30 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Statistics;
