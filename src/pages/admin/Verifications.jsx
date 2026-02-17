import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';
import { getImageUrl } from '../../utils/imageUtils';
import {
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  IdentificationIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const Verifications = () => {
  const queryClient = useQueryClient();
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('all'); // all, photo, id

  // Fetch pending verifications
  const { data: verifications, isLoading } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: async () => {
      const response = await api.get('/admin/pending-verifications');
      return response.data.verifications;
    },
  });

  // Approve verification mutation
  const approveMutation = useMutation({
    mutationFn: async ({ verificationId, type }) => {
      await api.post(`/admin/approve-verification/${verificationId}`, { type });
    },
    onSuccess: () => {
      toast.success('Verification approved');
      setShowImageModal(false);
      queryClient.invalidateQueries(['admin-verifications']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve verification');
    },
  });

  // Reject verification mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ verificationId, type, reason }) => {
      await api.post(`/admin/reject-verification/${verificationId}`, { type, reason });
    },
    onSuccess: () => {
      toast.success('Verification rejected');
      setShowRejectModal(false);
      setShowImageModal(false);
      setSelectedVerification(null);
      setRejectionReason('');
      queryClient.invalidateQueries(['admin-verifications']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject verification');
    },
  });

  const handleViewImage = (verification) => {
    setSelectedVerification(verification);
    setShowImageModal(true);
  };

  const handleApprove = () => {
    if (window.confirm('Approve this verification?')) {
      approveMutation.mutate({
        verificationId: selectedVerification.id,
        type: selectedVerification.type,
      });
    }
  };

  const handleReject = () => {
    setShowImageModal(false);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate({
      verificationId: selectedVerification.id,
      type: selectedVerification.type,
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

  // Filter verifications
  const filteredVerifications = verifications?.filter((v) => {
    if (filter === 'all') return true;
    return v.type === filter;
  }) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verifications</h1>
          <p className="text-gray-600 mt-1">
            Review photo and ID verifications
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'all'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({verifications?.length || 0})
          </button>
          <button
            onClick={() => setFilter('photo')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'photo'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Photo ({verifications?.filter((v) => v.type === 'photo').length || 0})
          </button>
          <button
            onClick={() => setFilter('id')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'id'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ID ({verifications?.filter((v) => v.type === 'id').length || 0})
          </button>
        </div>

        {/* Verifications Grid */}
        {filteredVerifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVerifications.map((verification) => (
              <div key={verification.id} className="card">
                <div className="flex items-center gap-2 mb-3">
                  {verification.type === 'photo' ? (
                    <PhotoIcon className="h-5 w-5 text-purple-600" />
                  ) : (
                    <IdentificationIcon className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="font-medium text-gray-900">
                    {verification.type === 'photo' ? 'Selfie' : 'ID'} Verification
                  </span>
                </div>

                {/* User Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {verification.user?.firstName} {verification.user?.lastName}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Submitted: {formatDate(verification.submittedAt)}
                  </p>
                </div>

                {/* Thumbnail */}
                <div
                  onClick={() => handleViewImage(verification)}
                  className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200 mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {verification.imageUrl ? (
                    <img
                      src={getImageUrl(verification.imageUrl)}
                      alt="Verification"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <PhotoIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewImage(verification)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Pending Verifications
            </h3>
            <p className="text-gray-600">
              All verifications have been reviewed
            </p>
          </div>
        )}
      </div>

      {/* Image Review Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setSelectedVerification(null);
        }}
        title={`Review ${selectedVerification?.type === 'photo' ? 'Selfie' : 'ID'} Verification`}
        size="lg"
      >
        {selectedVerification && (
          <div className="space-y-4">
            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Name:</span>{' '}
                  <strong>
                    {selectedVerification.user?.firstName} {selectedVerification.user?.lastName}
                  </strong>
                </p>
                <p>
                  <span className="text-gray-600">Submitted:</span>{' '}
                  {formatDate(selectedVerification.submittedAt)}
                </p>
              </div>
            </div>

            {/* Image */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Submitted Image</h4>
              <div className="w-full rounded-lg overflow-hidden bg-gray-200">
                {selectedVerification.imageUrl ? (
                  <img
                    src={getImageUrl(selectedVerification.imageUrl)}
                    alt="Verification"
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center text-gray-400">
                    <PhotoIcon className="h-16 w-16" />
                  </div>
                )}
              </div>
            </div>

            {/* Guidelines Checklist */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Verification Checklist</h4>
              <div className="space-y-1 text-sm text-gray-700">
                {selectedVerification.type === 'photo' ? (
                  <>
                    <p>✓ Clear, well-lit photo of face</p>
                    <p>✓ Looking directly at camera</p>
                    <p>✓ No sunglasses or face coverings</p>
                    <p>✓ No filters or heavy editing</p>
                  </>
                ) : (
                  <>
                    <p>✓ All four corners visible</p>
                    <p>✓ All text is readable</p>
                    <p>✓ ID is not expired</p>
                    <p>✓ Valid government-issued ID</p>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleApprove}
                variant="primary"
                isLoading={approveMutation.isPending}
                className="flex-1"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                variant="secondary"
                className="flex-1 text-red-600 hover:bg-red-50"
              >
                <XCircleIcon className="h-5 w-5 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
        }}
        title="Reject Verification"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Rejecting {selectedVerification?.type === 'photo' ? 'selfie' : 'ID'} verification for{' '}
            <strong>
              {selectedVerification?.user?.firstName} {selectedVerification?.user?.lastName}
            </strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rejection *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., Photo is blurry, ID is expired, etc."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowRejectModal(false);
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
              Reject Verification
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Verifications;
