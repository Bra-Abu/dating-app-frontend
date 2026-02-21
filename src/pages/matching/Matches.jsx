import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CompatibilityScore from '../../components/profile/CompatibilityScore';
import VerificationBadges from '../../components/profile/VerificationBadges';
import { getImageUrl } from '../../utils/imageUtils';
import { formatRelativeTime } from '../../utils/formatters';
import { ChatBubbleLeftRightIcon, HeartIcon } from '@heroicons/react/24/outline';

const Matches = () => {
  const navigate = useNavigate();

  // Fetch mutual matches
  const { data, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const response = await api.get('/matches/mutual');
      return response.data.data;
    },
  });

  const matches = data || [];

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
          <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
          <p className="text-gray-600 mt-1">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </p>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <MatchCard key={match.matchId} match={match} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <HeartIcon className="mx-auto h-24 w-24 text-gray-300 stroke-1" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Matches Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Keep swiping to find your perfect match!
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Start Browsing →
            </button>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

const MatchCard = ({ match, navigate }) => {
  const profile = match.user;
  const mainPhoto = profile?.photoUrls?.[0];
  const photoUrl = mainPhoto ? getImageUrl(mainPhoto) : null;

  return (
    <div className="card p-4 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex gap-4">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
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
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profile.firstName}, {profile.age}
              </h3>
              <p className="text-sm text-gray-600">
                {profile.city}, {profile.stateOfOrigin}
              </p>
            </div>
            <CompatibilityScore score={match.compatibilityScore} size="sm" />
          </div>

          <div className="mb-2">
            <VerificationBadges profile={profile} size="sm" />
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {profile.bio}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Matched {formatRelativeTime(match.matchedAt)}
            </span>
            <button
              onClick={() => navigate(`/messages/${match.matchId}`)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 group-hover:underline"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
