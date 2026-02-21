import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  UserGroupIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatters';

const Invites = () => {
  const [copied, setCopied] = useState(false);

  // Fetch my invite code
  const { data: codeData, isLoading: codeLoading } = useQuery({
    queryKey: ['myInviteCode'],
    queryFn: async () => {
      const response = await api.get('/invites/my-code');
      return response.data.data;
    },
  });

  // Fetch people I've invited
  const { data: invitedData, isLoading: invitedLoading } = useQuery({
    queryKey: ['invitedUsers'],
    queryFn: async () => {
      const response = await api.get('/invites/invited-users');
      return response.data.data || [];
    },
  });

  const handleCopy = () => {
    if (!codeData?.code) return;
    navigator.clipboard.writeText(codeData.code);
    setCopied(true);
    toast.success('Invite code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!codeData?.code) return;
    const message = `You've been invited to join Marriage Connect — a trusted platform for finding a life partner. Use my invite code *${codeData.code}* to register: ${window.location.origin}/register`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (codeLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </UserLayout>
    );
  }

  const invitedUsers = invitedData || [];

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Invite Codes</h1>
          <p className="text-gray-600">Share your code to invite people to the platform</p>
        </div>

        {/* My Invite Code */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Invite Code</h2>

          {codeData ? (
            <>
              <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 text-center mb-4">
                <code className="text-4xl font-bold text-primary-700 tracking-widest">
                  {codeData.code}
                </code>
                <div className="mt-3 flex justify-center gap-4 text-sm text-gray-600">
                  <span>{codeData.remainingUses} uses remaining</span>
                  <span>·</span>
                  <span>{codeData.timesUsed} used</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-5 w-5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-5 w-5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                >
                  <ShareIcon className="h-5 w-5" />
                  Share on WhatsApp
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-6">No invite code found.</p>
          )}
        </div>

        {/* People I've Invited */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <UserGroupIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              People You've Invited ({invitedUsers.length})
            </h2>
          </div>

          {invitedLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="md" />
            </div>
          ) : invitedUsers.length > 0 ? (
            <div className="space-y-3">
              {invitedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.phoneNumber}
                    </p>
                    <p className="text-xs text-gray-500">Joined {formatDate(user.createdAt)}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {user.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="text-gray-500 mt-3">You haven't invited anyone yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Share your code above to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Invites;
