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
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const PendingProfiles = () => {
  const queryClient = useQueryClient();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch pending profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['admin-pending-profiles'],
    queryFn: async () => {
      const response = await api.get('/admin/profiles/pending');
      return response.data.data.map(p => ({
        id: p.id,
        userId: p.user_id,
        firstName: p.first_name,
        lastName: p.last_name,
        gender: p.gender,
        dateOfBirth: p.date_of_birth,
        age: p.date_of_birth ? Math.floor((new Date() - new Date(p.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        bio: p.bio,
        religion: p.religion,
        denomination: p.denomination,
        tribe: p.tribe,
        city: p.city,
        country: p.country,
        height: p.height,
        occupation: p.occupation,
        education: p.education,
        maritalStatus: p.marital_status,
        photoUrls: p.photo_urls || [],
        phoneNumber: p.phone_number,
        createdAt: p.created_at,
      }));
    },
  });

  // Approve profile mutation
  const approveMutation = useMutation({
    mutationFn: async (profileId) => {
      await api.post(`/admin/profiles/${profileId}/approve`);
    },
    onSuccess: () => {
      toast.success('Profile approved successfully');
      setShowProfileModal(false);
      queryClient.invalidateQueries(['admin-pending-profiles']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve profile');
    },
  });

  // Reject profile mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ profileId, reason }) => {
      await api.post(`/admin/profiles/${profileId}/reject`, { reason });
    },
    onSuccess: () => {
      toast.success('Profile rejected');
      setShowRejectModal(false);
      setShowProfileModal(false);
      setSelectedProfile(null);
      setRejectionReason('');
      queryClient.invalidateQueries(['admin-pending-profiles']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject profile');
    },
  });

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const handleApprove = (profileId) => {
    if (window.confirm('Approve this profile?')) {
      approveMutation.mutate(profileId);
    }
  };

  const handleReject = () => {
    setShowProfileModal(false);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate({
      profileId: selectedProfile.id,
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
          <h1 className="text-2xl font-bold text-gray-900">Pending Profiles</h1>
          <p className="text-gray-600 mt-1">
            Review and approve user profiles
          </p>
        </div>

        {/* Stats */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>{profiles?.length || 0}</strong> profile{profiles?.length !== 1 ? 's' : ''} awaiting approval
          </p>
        </div>

        {/* Profiles Grid */}
        {profiles && profiles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="card">
                <div className="flex gap-4">
                  {/* Profile Photo */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {profile.photoUrls && profile.photoUrls[0] ? (
                      <img
                        src={getImageUrl(profile.photoUrls[0])}
                        alt={profile.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <UserIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {profile.firstName}, {profile.age}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="truncate">{profile.city}, {profile.stateOfOrigin}</span>
                      </div>
                      {profile.religion && (
                        <div className="flex items-center gap-1">
                          <HeartIcon className="h-4 w-4" />
                          <span>{profile.religion}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Submitted: {formatDate(profile.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewProfile(profile)}
                        variant="secondary"
                        size="sm"
                      >
                        View Full Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Pending Profiles
            </h3>
            <p className="text-gray-600">
              All profiles have been reviewed
            </p>
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedProfile(null);
        }}
        title="Review Profile"
        size="lg"
      >
        {selectedProfile && (
          <div className="space-y-6">
            {/* Photos */}
            {selectedProfile.photoUrls && selectedProfile.photoUrls.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Photos</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProfile.photoUrls.map((url, index) => (
                    <img
                      key={index}
                      src={getImageUrl(url)}
                      alt={`Photo ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{selectedProfile.firstName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Age:</span>
                  <p className="font-medium">{selectedProfile.age}</p>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <p className="font-medium">{selectedProfile.gender}</p>
                </div>
                <div>
                  <span className="text-gray-600">Height:</span>
                  <p className="font-medium">{selectedProfile.height} cm</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            {selectedProfile.bio && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-sm text-gray-700">{selectedProfile.bio}</p>
              </div>
            )}

            {/* Religious Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Religious Background</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Religion:</span>
                  <p className="font-medium">{selectedProfile.religion}</p>
                </div>
                {selectedProfile.denomination && (
                  <div>
                    <span className="text-gray-600">Denomination:</span>
                    <p className="font-medium">{selectedProfile.denomination}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handleApprove(selectedProfile.id)}
                variant="primary"
                isLoading={approveMutation.isPending}
                className="flex-1"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Approve Profile
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
        title="Reject Profile"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Rejecting: <strong>{selectedProfile?.firstName}'s profile</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rejection *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., Inappropriate photos, incomplete information, etc."
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
              Reject Profile
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default PendingProfiles;
