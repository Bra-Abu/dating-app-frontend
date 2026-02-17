import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../config/api';
import toast from 'react-hot-toast';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SwipeCard from '../../components/matching/SwipeCard';
import ActionButtons from '../../components/matching/ActionButtons';
import MatchModal from '../../components/matching/MatchModal';
import ProfileDetails from '../../components/profile/ProfileDetails';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const Browse = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Fetch match suggestions
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['matchSuggestions'],
    queryFn: async () => {
      const response = await api.get('/matching/suggestions', {
        params: { limit: 20 },
      });
      return response.data.suggestions;
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (profileId) => {
      const response = await api.post(`/matching/like/${profileId}`);
      // Check rate limit headers
      const remaining = response.headers['x-ratelimit-remaining'];
      const limit = response.headers['x-ratelimit-limit'];
      if (remaining !== undefined) {
        setRateLimitInfo({ remaining: parseInt(remaining), limit: parseInt(limit) });
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data.matched) {
        // It's a match!
        setMatchData(data.match);
        setShowMatchModal(true);
      } else {
        toast.success('Profile liked!');
      }
      moveToNext();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to like profile');
    },
  });

  // Pass mutation
  const passMutation = useMutation({
    mutationFn: async (profileId) => {
      const response = await api.post(`/matching/pass/${profileId}`);
      return response.data;
    },
    onSuccess: () => {
      moveToNext();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to pass profile');
    },
  });

  const profiles = data || [];
  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length - 1;

  const moveToNext = () => {
    if (hasMoreProfiles) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // No more profiles, refetch
      refetch();
      setCurrentIndex(0);
    }
  };

  const handleSwipe = (direction) => {
    if (!currentProfile) return;

    if (direction === 'right') {
      likeMutation.mutate(currentProfile.id);
    } else {
      passMutation.mutate(currentProfile.id);
    }
  };

  const handleLike = () => {
    if (currentProfile) {
      likeMutation.mutate(currentProfile.id);
    }
  };

  const handlePass = () => {
    if (currentProfile) {
      passMutation.mutate(currentProfile.id);
    }
  };

  const handleRefresh = () => {
    setCurrentIndex(0);
    refetch();
  };

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
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Your Match</h1>
            {rateLimitInfo && (
              <p className="text-sm text-gray-600 mt-1">
                {rateLimitInfo.remaining} likes remaining today
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh suggestions"
          >
            <ArrowPathIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Swipe Area */}
        {profiles.length > 0 ? (
          <>
            <div className="relative h-[600px] mb-6">
              {/* Stack of cards - show current and next */}
              {profiles.slice(currentIndex, currentIndex + 3).map((profile, index) => (
                <div
                  key={profile.id}
                  className="absolute inset-0"
                  style={{
                    zIndex: 3 - index,
                    transform: `scale(${1 - index * 0.05}) translateY(${
                      index * -10
                    }px)`,
                    opacity: index === 0 ? 1 : 0.5,
                  }}
                >
                  {index === 0 ? (
                    <SwipeCard
                      profile={profile}
                      onSwipe={handleSwipe}
                      onProfileClick={() => setShowProfileDetails(true)}
                    />
                  ) : (
                    <div className="h-full pointer-events-none">
                      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                        <img
                          src={`${import.meta.env.VITE_UPLOADS_BASE_URL}/${
                            profile.isMatched
                              ? profile.photoUrls?.[0]
                              : profile.blurredPhotoUrls?.[0]
                          }`}
                          alt={profile.firstName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <ActionButtons
              onPass={handlePass}
              onLike={handleLike}
              onInfo={() => setShowProfileDetails(true)}
              disabled={likeMutation.isPending || passMutation.isPending}
            />

            {/* Help Text */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Swipe right to like, left to pass, or use the buttons below
            </p>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No More Profiles
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for new suggestions, or adjust your preferences
            </p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        match={matchData}
      />

      {/* Profile Details Modal */}
      {currentProfile && (
        <ProfileDetails
          isOpen={showProfileDetails}
          onClose={() => setShowProfileDetails(false)}
          profile={currentProfile}
          onLike={handleLike}
          onPass={handlePass}
        />
      )}
    </UserLayout>
  );
};

export default Browse;
