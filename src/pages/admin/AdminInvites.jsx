import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  PlusIcon,
  ShareIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';

const AdminInvites = () => {
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState(null);

  const { data: codes = [], isLoading } = useQuery({
    queryKey: ['admin-all-codes'],
    queryFn: async () => {
      const response = await api.get('/invites/all-codes');
      return response.data.data || [];
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/invites/generate');
      return response.data;
    },
    onSuccess: () => {
      toast.success('New invite code generated!');
      queryClient.invalidateQueries(['admin-all-codes']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to generate code');
    },
  });

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleWhatsApp = (code) => {
    const message = `You've been invited to join Marriage Connect — a trusted platform for finding a life partner.\n\nUse invite code: *${code}*\n\nRegister here: ${window.location.origin.replace('/admin/invites', '')}/register`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const activeCodes = codes.filter((c) => c.isActive && c.remainingUses > 0);
  const usedCodes = codes.filter((c) => !c.isActive || c.remainingUses === 0);

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invite Codes</h1>
            <p className="text-gray-600 mt-1">
              Generate codes and share them to invite new users
            </p>
          </div>
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
          >
            {generateMutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <PlusIcon className="h-5 w-5" />
            )}
            Generate New Code
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-bold text-primary-600">{codes.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Generated</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-green-600">{activeCodes.length}</p>
            <p className="text-sm text-gray-600 mt-1">Active</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-gray-500">{usedCodes.length}</p>
            <p className="text-sm text-gray-600 mt-1">Fully Used</p>
          </div>
        </div>

        {/* Active Codes */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TicketIcon className="h-5 w-5 text-primary-600" />
            Active Codes ({activeCodes.length})
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : activeCodes.length > 0 ? (
            <div className="space-y-3">
              {activeCodes.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-xl"
                >
                  <div>
                    <code className="text-2xl font-bold text-primary-700 tracking-widest">
                      {invite.code}
                    </code>
                    <p className="text-sm text-gray-500 mt-1">
                      {invite.remainingUses} of {invite.maxUses} uses remaining
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(invite.code)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      {copiedCode === invite.code ? (
                        <>
                          <CheckIcon className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleWhatsApp(invite.code)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <ShareIcon className="h-4 w-4" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <TicketIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="text-gray-500 mt-3">No active codes yet</p>
              <p className="text-sm text-gray-400">Click "Generate New Code" to get started</p>
            </div>
          )}
        </div>

        {/* Used Codes */}
        {usedCodes.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Used Codes ({usedCodes.length})
            </h2>
            <div className="space-y-2">
              {usedCodes.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
                >
                  <code className="text-lg font-bold text-gray-500 tracking-widest">
                    {invite.code}
                  </code>
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full font-medium">
                    Fully Used
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInvites;
