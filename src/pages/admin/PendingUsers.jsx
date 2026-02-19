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
  PhoneIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const PendingUsers = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch pending users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-pending-users'],
    queryFn: async () => {
      const response = await api.get('/admin/users/pending');
      return response.data.data.map(u => ({
        id: u.id,
        firstName: u.first_name || '',
        lastName: u.last_name || '',
        phoneNumber: u.phone_number,
        phoneVerified: true,
        gender: u.gender,
        createdAt: u.created_at,
        invitedBy: u.inviter_phone,
        religion: u.religion,
      }));
    },
  });

  // Approve user mutation
  const approveMutation = useMutation({
    mutationFn: async (userId) => {
      await api.post(`/admin/users/${userId}/approve`);
    },
    onSuccess: () => {
      toast.success('User approved successfully');
      queryClient.invalidateQueries(['admin-pending-users']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve user');
    },
  });

  // Reject user mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }) => {
      await api.post(`/admin/users/${userId}/reject`, { reason });
    },
    onSuccess: () => {
      toast.success('User rejected');
      setShowRejectModal(false);
      setSelectedUser(null);
      setRejectionReason('');
      queryClient.invalidateQueries(['admin-pending-users']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject user');
    },
  });

  const handleApprove = (user) => {
    if (window.confirm(`Approve ${user.firstName} ${user.lastName}?`)) {
      approveMutation.mutate(user.id);
    }
  };

  const handleReject = (user) => {
    setSelectedUser(user);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate({
      userId: selectedUser.id,
      reason: rejectionReason.trim(),
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Pending Users</h1>
          <p className="text-gray-600 mt-1">
            Review and approve user registrations
          </p>
        </div>

        {/* Stats */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>{users?.length || 0}</strong> user{users?.length !== 1 ? 's' : ''} awaiting approval
          </p>
        </div>

        {/* Users List */}
        {users && users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      {user.gender && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {user.gender}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{user.phoneNumber || 'N/A'}</span>
                        {user.phoneVerified && (
                          <span className="text-green-600 text-xs">✓ Verified</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Registered: {formatDate(user.createdAt)}</span>
                      </div>
                      {user.invitedBy && (
                        <div className="text-xs text-gray-500">
                          Invited by: {user.invitedBy}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(user)}
                      variant="primary"
                      isLoading={approveMutation.isPending && approveMutation.variables === user.id}
                      className="flex-1 lg:flex-none"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(user)}
                      variant="secondary"
                      className="flex-1 lg:flex-none text-red-600 hover:bg-red-50"
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Pending Users
            </h3>
            <p className="text-gray-600">
              All user registrations have been reviewed
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedUser(null);
          setRejectionReason('');
        }}
        title="Reject User"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Rejecting: <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rejection *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide a clear reason for rejection..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowRejectModal(false);
                setSelectedUser(null);
                setRejectionReason('');
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              variant="primary"
              isLoading={rejectMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Reject User
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default PendingUsers;
