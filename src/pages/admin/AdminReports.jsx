import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';
import {
  CheckCircleIcon,
  XCircleIcon,
  FlagIcon,
  UserIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const AdminReports = () => {
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'resolve', 'dismiss', 'suspend', 'ban'
  const [actionNote, setActionNote] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, resolved, dismissed

  // Fetch reports
  const { data: reports, isLoading } = useQuery({
    queryKey: ['admin-reports', filter],
    queryFn: async () => {
      const response = await api.get(`/admin/reports?status=${filter}`);
      return response.data.reports;
    },
  });

  // Take action mutation
  const actionMutation = useMutation({
    mutationFn: async ({ reportId, action, note }) => {
      await api.post(`/admin/report-action/${reportId}`, { action, note });
    },
    onSuccess: () => {
      toast.success('Action completed successfully');
      setShowActionModal(false);
      setShowReportModal(false);
      setSelectedReport(null);
      setActionNote('');
      queryClient.invalidateQueries(['admin-reports']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to complete action');
    },
  });

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleAction = (action) => {
    setActionType(action);
    setShowReportModal(false);
    setShowActionModal(true);
  };

  const handleActionSubmit = () => {
    actionMutation.mutate({
      reportId: selectedReport.id,
      action: actionType,
      note: actionNote.trim() || undefined,
    });
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      inappropriate_behavior: 'Inappropriate Behavior',
      fake_profile: 'Fake Profile',
      spam: 'Spam or Scam',
      inappropriate_photos: 'Inappropriate Photos',
      underage: 'Underage User',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || badges.pending;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            Review and manage user reports
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'pending'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'resolved'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter('dismissed')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'dismissed'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Dismissed
          </button>
        </div>

        {/* Reports List */}
        {reports && reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="card">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Report Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FlagIcon className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">
                        {getReportTypeLabel(report.reportType)}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <span>
                          <strong>Reported user:</strong> {report.reportedUser?.firstName} {report.reportedUser?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <span>
                          <strong>Reported by:</strong> {report.reporter?.firstName} {report.reporter?.lastName}
                        </span>
                      </div>
                      <p>
                        <strong>Date:</strong> {formatDate(report.createdAt)}
                      </p>
                      <p className="line-clamp-2">
                        <strong>Description:</strong> {report.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button
                      onClick={() => handleViewReport(report)}
                      variant="secondary"
                      size="sm"
                      className="flex-1 lg:flex-none"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FlagIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {filter} Reports
            </h3>
            <p className="text-gray-600">
              All {filter} reports will appear here
            </p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setSelectedReport(null);
        }}
        title="Report Details"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-4">
            {/* Report Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Report Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Type:</span>{' '}
                  <strong>{getReportTypeLabel(selectedReport.reportType)}</strong>
                </p>
                <p>
                  <span className="text-gray-600">Status:</span>{' '}
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Date:</span>{' '}
                  {formatDate(selectedReport.createdAt)}
                </p>
              </div>
            </div>

            {/* Users */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Reported User</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="font-medium text-gray-900">
                    {selectedReport.reportedUser?.firstName} {selectedReport.reportedUser?.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    ID: {selectedReport.reportedUserId}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Reporter</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-medium text-gray-900">
                    {selectedReport.reporter?.firstName} {selectedReport.reporter?.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    ID: {selectedReport.reporterId}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{selectedReport.description}</p>
              </div>
            </div>

            {/* Actions (only for pending reports) */}
            {selectedReport.status === 'pending' && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleAction('resolve')}
                  variant="primary"
                  size="sm"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
                <Button
                  onClick={() => handleAction('dismiss')}
                  variant="secondary"
                  size="sm"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Dismiss
                </Button>
                <Button
                  onClick={() => handleAction('suspend')}
                  variant="secondary"
                  size="sm"
                  className="text-orange-600 hover:bg-orange-50"
                >
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  Suspend User
                </Button>
                <Button
                  onClick={() => handleAction('ban')}
                  variant="secondary"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <NoSymbolIcon className="h-4 w-4 mr-2" />
                  Ban User
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setActionType(null);
          setActionNote('');
        }}
        title={`${actionType === 'resolve' ? 'Resolve' : actionType === 'dismiss' ? 'Dismiss' : actionType === 'suspend' ? 'Suspend User' : 'Ban User'}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {actionType === 'resolve' && 'Mark this report as resolved. The reported user will be notified.'}
            {actionType === 'dismiss' && 'Dismiss this report as invalid or duplicate.'}
            {actionType === 'suspend' && 'Temporarily suspend the reported user\'s account.'}
            {actionType === 'ban' && 'Permanently ban the reported user from the platform.'}
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Note (Optional)
            </label>
            <textarea
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              placeholder="Add any notes about this action..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowActionModal(false);
                setActionType(null);
                setActionNote('');
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleActionSubmit}
              variant="primary"
              isLoading={actionMutation.isPending}
              className={`flex-1 ${
                actionType === 'ban' || actionType === 'suspend'
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
              }`}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminReports;
