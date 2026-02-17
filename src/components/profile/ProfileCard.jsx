import { MapPinIcon, BriefcaseIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import CompatibilityScore from './CompatibilityScore';
import VerificationBadges from './VerificationBadges';
import { getImageUrl } from '../../utils/imageUtils';
import { formatHeight } from '../../utils/formatters';

const ProfileCard = ({ profile, onClick, showCompatibility = true }) => {
  const mainPhoto = profile.isMatched
    ? profile.photoUrls?.[0]
    : profile.blurredPhotoUrls?.[0];

  const photoUrl = mainPhoto ? getImageUrl(mainPhoto) : null;

  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Photo */}
      <div className="relative h-full">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={profile.firstName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No Photo</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

        {/* Top Right - Compatibility Score */}
        {showCompatibility && profile.compatibilityScore !== undefined && (
          <div className="absolute top-4 right-4">
            <CompatibilityScore score={profile.compatibilityScore} size="sm" showLabel={false} />
          </div>
        )}

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {/* Name and Age */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">
              {profile.firstName}, {profile.age}
            </h3>
            <VerificationBadges profile={profile} size="sm" />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm mb-3 opacity-90">
            <MapPinIcon className="h-4 w-4" />
            <span>{profile.city}, {profile.stateOfOrigin}</span>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <BriefcaseIcon className="h-4 w-4" />
              <span>{profile.occupation}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <AcademicCapIcon className="h-4 w-4" />
              <span>{profile.education}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {formatHeight(profile.height)}
            </div>
          </div>

          {/* Bio Preview */}
          {profile.bio && (
            <p className="mt-3 text-sm opacity-90 line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default ProfileCard;
