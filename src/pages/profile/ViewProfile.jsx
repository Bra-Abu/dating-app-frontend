import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PencilIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { getImageUrls, getImageUrl } from '../../utils/imageUtils';
import {
  formatHeight,
  formatArray,
  formatVerificationStatus,
} from '../../utils/formatters';

const ViewProfile = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </UserLayout>
    );
  }

  if (!userProfile) {
    return (
      <UserLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Profile Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't created a profile yet.
          </p>
          <Link to="/create-profile">
            <Button>Create Profile</Button>
          </Link>
        </div>
      </UserLayout>
    );
  }

  const profile = userProfile;
  const photoUrls = profile.photoUrls || [];

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <Link to="/profile/edit">
            <Button variant="secondary">
              <PencilIcon className="h-5 w-5 inline mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Profile Status */}
        {profile.profileStatus === 'pending_approval' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Pending Approval:</strong> Your profile is currently under
              review by our admin team.
            </p>
          </div>
        )}

        {/* Photos */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photoUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={getImageUrl(url)}
                  alt={`Profile ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    Main Photo
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Name" value={`${profile.firstName} ${profile.lastName}`} />
            <InfoItem label="Age" value={`${profile.age} years`} />
            <InfoItem label="Gender" value={profile.gender} />
            <InfoItem label="Date of Birth" value={profile.dateOfBirth} />
          </div>
          <div className="mt-4">
            <InfoItem label="Bio" value={profile.bio} fullWidth />
          </div>
        </div>

        {/* Religious & Cultural */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Religious & Cultural Background
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Religion" value={profile.religion} />
            {profile.denomination && (
              <InfoItem label="Denomination" value={profile.denomination} />
            )}
            <InfoItem label="Tribe" value={profile.tribe} />
            <InfoItem
              label="Languages"
              value={formatArray(profile.languages)}
            />
            <InfoItem label="State of Origin" value={profile.stateOfOrigin} />
            <InfoItem label="City" value={profile.city} />
          </div>
        </div>

        {/* Physical & Professional */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Physical & Professional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Height" value={formatHeight(profile.height)} />
            <InfoItem label="Body Type" value={profile.bodyType} />
            <InfoItem label="Complexion" value={profile.complexion} />
            <InfoItem label="Occupation" value={profile.occupation} />
            <InfoItem label="Education" value={profile.education} />
            <InfoItem
              label="Employment Status"
              value={profile.employmentStatus}
            />
            <InfoItem label="Marital Status" value={profile.maritalStatus} />
          </div>
        </div>

        {/* Lifestyle & Family */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Lifestyle & Family
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Smoking" value={profile.smoking} />
            <InfoItem label="Drinking" value={profile.drinking} />
            <InfoItem
              label="Children Preference"
              value={profile.childrenPreference}
            />
            {profile.numberOfChildren && (
              <InfoItem
                label="Number of Children"
                value={profile.numberOfChildren}
              />
            )}
            <InfoItem
              label="Willing to Relocate"
              value={profile.willingToRelocate ? 'Yes' : 'No'}
            />
          </div>
          <div className="mt-4">
            <InfoItem
              label="Personality Traits"
              value={formatArray(profile.personalityTraits)}
              fullWidth
            />
          </div>
          <div className="mt-4">
            <InfoItem
              label="Interests & Hobbies"
              value={formatArray(profile.interests)}
              fullWidth
            />
          </div>
        </div>

        {/* Guardian Info (if applicable) */}
        {profile.requiresGuardian && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Guardian Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Guardian Name" value={profile.guardianName} />
              <InfoItem label="Guardian Phone" value={profile.guardianPhone} />
              <InfoItem
                label="Relationship"
                value={profile.guardianRelationship}
              />
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Verification Status
          </h2>
          <div className="space-y-2">
            <VerificationItem
              label="Phone Verified"
              status={profile.phoneVerified ? 'approved' : 'pending'}
            />
            <VerificationItem
              label="Photo Verification"
              status={profile.photoVerificationStatus || 'pending'}
            />
            <VerificationItem
              label="ID Verification"
              status={profile.idVerificationStatus || 'pending'}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

const InfoItem = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-full' : ''}>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-gray-900 font-medium capitalize">
      {value || 'Not provided'}
    </p>
  </div>
);

const VerificationItem = ({ label, status }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <span className="text-gray-900 font-medium">{label}</span>
    <span
      className={`flex items-center text-sm font-medium ${
        status === 'approved'
          ? 'text-green-600'
          : status === 'rejected'
          ? 'text-red-600'
          : 'text-yellow-600'
      }`}
    >
      {status === 'approved' && <CheckBadgeIcon className="h-5 w-5 mr-1" />}
      {formatVerificationStatus(status)}
    </span>
  </div>
);

export default ViewProfile;
