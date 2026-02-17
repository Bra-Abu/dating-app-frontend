import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatters';

const Invites = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  // Fetch invite codes
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inviteCodes'],
    queryFn: async () => {
      const response = await api.get('/invites/my-codes');
      return response.data;
    },
  });

  // Generate new invite code
  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/invites/generate');
      return response.data;
    },
    onSuccess: () => {
      toast.success('Invite code generated!');
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to generate code');
    },
  });

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const inviteCodes = data?.codes || [];
  const totalInvites = inviteCodes.length;
  const usedInvites = inviteCodes.filter((c) => c.usedBy).length;
  const availableInvites = totalInvites - usedInvites;

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Codes</h1>
          <p className="text-gray-600">
            Share your invite codes with friends to invite them to the platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Invites</p>
                <p className="text-2xl font-bold text-gray-900">{totalInvites}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Used</p>
                <p className="text-2xl font-bold text-gray-900">{usedInvites}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <PlusIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableInvites}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Generate New Invite Code
              </h3>
              <p className="text-sm text-gray-600">
                Create a new code to invite someone to the platform
              </p>
            </div>
            <Button
              onClick={() => generateMutation.mutate()}
              loading={generateMutation.isPending}
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Generate Code
            </Button>
          </div>
        </div>

        {/* Invite Codes List */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Your Invite Codes</h3>

          {inviteCodes.length > 0 ? (
            <div className="space-y-3">
              {inviteCodes.map((invite) => (
                <div
                  key={invite.id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    invite.usedBy
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-primary-50 border-primary-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-2xl font-bold text-gray-900 tracking-wider">
                          {invite.code}
                        </code>
                        {invite.usedBy ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Used
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Available
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Created: {formatDate(invite.createdAt)}</span>
                        {invite.usedBy && (
                          <span>
                            Used by: {invite.invitedUser?.firstName}{' '}
                            {invite.invitedUser?.lastName}
                          </span>
                        )}
                      </div>
                    </div>

                    {!invite.usedBy && (
                      <button
                        onClick={() => handleCopy(invite.code)}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                      >
                        {copiedCode === invite.code ? (
                          <>
                            <CheckIcon className="h-5 w-5 text-green-600" />
                            <span className="text-green-600 font-medium">
                              Copied!
                            </span>
                          </>
                        ) : (
                          <>
                            <ClipboardDocumentIcon className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700 font-medium">Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-16 w-16 text-gray-300" />
              <p className="text-gray-600 mt-4">
                You haven't generated any invite codes yet
              </p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Invites;
