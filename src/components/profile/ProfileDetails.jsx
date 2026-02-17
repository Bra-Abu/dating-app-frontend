import { useState } from 'react';
import Modal from '../common/Modal';
import CompatibilityScore from './CompatibilityScore';
import VerificationBadges from './VerificationBadges';
import Button from '../common/Button';
import { getImageUrl } from '../../utils/imageUtils';
import { formatHeight, formatArray } from '../../utils/formatters';
import {
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const ProfileDetails = ({ isOpen, onClose, profile, onLike, onPass, showActions = true }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!profile) return null;

  const photos = profile.isMatched
    ? profile.photoUrls || []
    : profile.blurredPhotoUrls || [];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Photo Gallery */}
        <div className="relative mb-6">
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            {photos.length > 0 ? (
              <>
                <img
                  src={getImageUrl(photos[currentPhotoIndex])}
                  alt={profile.firstName}
                  className="w-full h-full object-cover"
                />

                {/* Photo Navigation */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>

                    {/* Photo Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentPhotoIndex
                              ? 'bg-white'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Photos
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {profile.firstName}, {profile.age}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPinIcon className="h-5 w-5" />
                <span>{profile.city}, {profile.stateOfOrigin}</span>
              </div>
              <VerificationBadges profile={profile} />
            </div>
          </div>
          {profile.compatibilityScore !== undefined && (
            <CompatibilityScore score={profile.compatibilityScore} size="lg" />
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <InfoItem icon={BriefcaseIcon} label="Occupation" value={profile.occupation} />
          <InfoItem icon={AcademicCapIcon} label="Education" value={profile.education} />
          <InfoItem label="Height" value={formatHeight(profile.height)} />
          <InfoItem label="Body Type" value={profile.bodyType} />
        </div>

        {/* Religious & Cultural */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Religious & Cultural
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Religion" value={profile.religion} />
            {profile.denomination && (
              <InfoItem label="Denomination" value={profile.denomination} />
            )}
            <InfoItem label="Tribe" value={profile.tribe} />
            <InfoItem label="Languages" value={formatArray(profile.languages)} />
          </div>
        </div>

        {/* Lifestyle */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Lifestyle</h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Smoking" value={profile.smoking} />
            <InfoItem label="Drinking" value={profile.drinking} />
            <InfoItem label="Children" value={profile.childrenPreference} />
            <InfoItem
              label="Relocation"
              value={profile.willingToRelocate ? 'Yes' : 'No'}
            />
          </div>
        </div>

        {/* Personality & Interests */}
        {profile.personalityTraits && profile.personalityTraits.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Personality
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.personalityTraits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onPass} variant="secondary" fullWidth>
              <XMarkIcon className="h-5 w-5 inline mr-2" />
              Pass
            </Button>
            <Button onClick={onLike} fullWidth>
              <HeartIcon className="h-5 w-5 inline mr-2" />
              Like
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div>
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </div>
    <p className="text-gray-900 font-medium capitalize">{value || 'Not specified'}</p>
  </div>
);

export default ProfileDetails;
