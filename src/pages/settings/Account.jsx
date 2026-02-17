import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../config/api';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Account = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, signOut } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await api.post('/auth/deactivate');
      toast.success('Account deactivated successfully');
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate account');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete('/auth/delete-account');
      toast.success('Account deleted successfully');
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

        {/* Account Information */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-900">
                    {currentUser?.phoneNumber}
                  </p>
                </div>
              </div>
              {currentUser?.phoneVerified && (
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Verified
                </span>
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="font-medium text-gray-900 capitalize">
                  {currentUser?.accountStatus?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {userProfile
                ? 'Your profile is active and visible to others'
                : 'Complete your profile to start matching'}
            </p>
            <Button
              onClick={() => navigate(userProfile ? '/profile/edit' : '/create-profile')}
              variant="secondary"
            >
              {userProfile ? 'Edit Profile' : 'Create Profile'}
            </Button>
          </div>
        </div>

        {/* Privacy & Settings */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Privacy & Settings
          </h2>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/settings/blocked')}
              variant="secondary"
              fullWidth
              className="justify-start"
            >
              Blocked Users
            </Button>
            <Button
              onClick={() => navigate('/settings/reports')}
              variant="secondary"
              fullWidth
              className="justify-start"
            >
              My Reports
            </Button>
            <Button
              onClick={() => navigate('/settings/invites')}
              variant="secondary"
              fullWidth
              className="justify-start"
            >
              Invite Codes
            </Button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="card mb-6">
          <Button
            onClick={handleSignOut}
            variant="secondary"
            fullWidth
            className="justify-center"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 inline mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            Danger Zone
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Deactivate Account</p>
                <p className="text-sm text-gray-600 mt-1">
                  Temporarily hide your profile. You can reactivate anytime.
                </p>
              </div>
              <Button
                onClick={() => setShowDeactivateModal(true)}
                variant="secondary"
                className="ml-4"
              >
                Deactivate
              </Button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-600 mt-1">
                  Permanently delete your account and all data. This cannot be undone.
                </p>
              </div>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="danger"
                className="ml-4"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      <Modal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title="Deactivate Account"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to deactivate your account? Your profile will be
            hidden and you won't receive any matches or messages.
          </p>
          <p className="text-gray-600">
            You can reactivate your account anytime by signing back in.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setShowDeactivateModal(false)}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleDeactivate} variant="danger" fullWidth loading={loading}>
              Deactivate
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              ⚠️ This action cannot be undone!
            </p>
          </div>
          <p className="text-gray-600">
            Deleting your account will permanently remove:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Your profile and all photos</li>
            <li>All your matches and messages</li>
            <li>Your like and pass history</li>
            <li>All verification data</li>
          </ul>
          <p className="text-gray-600 font-medium">
            Are you absolutely sure you want to delete your account?
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="danger" fullWidth loading={loading}>
              Yes, Delete Forever
            </Button>
          </div>
        </div>
      </Modal>
    </UserLayout>
  );
};

export default Account;
