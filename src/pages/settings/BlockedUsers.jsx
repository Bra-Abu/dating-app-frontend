import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import { formatRelativeTime } from '../../utils/formatters';
import { NoSymbolIcon } from '@heroicons/react/24/outline';

const BlockedUsers = () => {
  // Fetch blocked users
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['blockedUsers'],
    queryFn: async () => {
      const response = await api.get('/blocking/blocked-users');
      return response.data.blockedUsers;
    },
  });

  // Unblock mutation
  const unblockMutation = useMutation({
    mutationFn: async (userId) => {
      await api.post(`/blocking/unblock/${userId}`);
    },
    onSuccess: () => {
      toast.success('User unblocked successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to unblock user');
    },
  });

  const blockedUsers = data || [];

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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blocked Users</h1>
          <p className="text-gray-600">
            Manage users you've blocked. They won't be able to see your profile or
            contact you.
          </p>
        </div>

        {blockedUsers.length > 0 ? (
          <div className="space-y-3">
            {blockedUsers.map((blocked) => (
              <div key={blocked.id} className="card p-4">
                <div className="flex items-center gap-4">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {blocked.blockedUser.profilePhotoUrl ? (
                        <img
                          src={getImageUrl(blocked.blockedUser.profilePhotoUrl)}
                          alt={blocked.blockedUser.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <NoSymbolIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {blocked.blockedUser.firstName}{' '}
                      {blocked.blockedUser.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {blocked.blockedUser.city}, {blocked.blockedUser.stateOfOrigin}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Blocked {formatRelativeTime(blocked.createdAt)}
                    </p>
                  </div>

                  {/* Unblock Button */}
                  <Button
                    onClick={() => unblockMutation.mutate(blocked.blockedUserId)}
                    variant="secondary"
                    loading={unblockMutation.isPending}
                  >
                    Unblock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12">
              <NoSymbolIcon className="mx-auto h-16 w-16 text-gray-300 stroke-1" />
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                No Blocked Users
              </h3>
              <p className="text-gray-600">
                You haven't blocked anyone yet
              </p>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default BlockedUsers;
