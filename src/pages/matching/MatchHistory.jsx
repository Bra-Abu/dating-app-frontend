import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CompatibilityScore from '../../components/profile/CompatibilityScore';
import { getImageUrl } from '../../utils/imageUtils';
import { formatRelativeTime } from '../../utils/formatters';

const MatchHistory = () => {
  const [activeTab, setActiveTab] = useState('liked'); // 'liked' or 'passed'

  // Fetch match history
  const { data, isLoading } = useQuery({
    queryKey: ['matchHistory', activeTab],
    queryFn: async () => {
      const response = await api.get('/matching/history', {
        params: { type: activeTab },
      });
      return response.data.history;
    },
  });

  const history = data || [];

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Match History</h1>
          <p className="text-gray-600 mt-1">
            See who you've liked and passed
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('liked')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'liked'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Liked
          </button>
          <button
            onClick={() => setActiveTab('passed')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'passed'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Passed
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <HistoryCard key={item.id} item={item} type={activeTab} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">
              {activeTab === 'liked'
                ? "You haven't liked anyone yet"
                : "You haven't passed anyone yet"}
            </p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

const HistoryCard = ({ item, type }) => {
  const profile = item.profile;
  const mainPhoto = profile.blurredPhotoUrls?.[0];
  const photoUrl = mainPhoto ? getImageUrl(mainPhoto) : null;

  return (
    <div className="card p-0 overflow-hidden hover:shadow-md transition-shadow">
      {/* Photo */}
      <div className="relative h-48 bg-gray-200">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={profile.firstName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

        {/* Badge */}
        <div className="absolute top-3 right-3">
          {type === 'liked' ? (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Liked
            </span>
          ) : (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Passed
            </span>
          )}
        </div>

        {/* Name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg">
            {profile.firstName}, {profile.age}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {profile.city}, {profile.stateOfOrigin}
          </span>
          {item.compatibilityScore !== undefined && (
            <CompatibilityScore score={item.compatibilityScore} size="sm" showLabel={false} />
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {profile.occupation}
        </p>

        <p className="text-xs text-gray-500">
          {formatRelativeTime(item.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MatchHistory;
