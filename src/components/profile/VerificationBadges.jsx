import { CheckBadgeIcon, ShieldCheckIcon, PhoneIcon } from '@heroicons/react/24/solid';

const VerificationBadges = ({ profile, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-2">
      {profile.phoneVerified && (
        <div className="flex items-center gap-1 text-green-600" title="Phone Verified">
          <PhoneIcon className={iconSize} />
          {size !== 'sm' && <span className="text-xs font-medium">Phone</span>}
        </div>
      )}
      {profile.photoVerificationStatus === 'approved' && (
        <div className="flex items-center gap-1 text-blue-600" title="Photo Verified">
          <CheckBadgeIcon className={iconSize} />
          {size !== 'sm' && <span className="text-xs font-medium">Photo</span>}
        </div>
      )}
      {profile.idVerificationStatus === 'approved' && (
        <div className="flex items-center gap-1 text-purple-600" title="ID Verified">
          <ShieldCheckIcon className={iconSize} />
          {size !== 'sm' && <span className="text-xs font-medium">ID</span>}
        </div>
      )}
    </div>
  );
};

export default VerificationBadges;
