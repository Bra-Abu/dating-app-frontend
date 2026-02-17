import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/common/Button';
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  PhoneIcon,
  PhotoIcon,
  IdentificationIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const VerificationStatus = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const verifications = [
    {
      type: 'phone',
      label: 'Phone Verification',
      icon: PhoneIcon,
      status: currentUser?.phoneVerified ? 'approved' : 'pending',
      description: 'Verify your phone number',
      action: null, // Phone is verified during registration
    },
    {
      type: 'photo',
      label: 'Photo Verification',
      icon: PhotoIcon,
      status: userProfile?.photoVerificationStatus || 'pending',
      description: 'Upload a selfie for verification',
      action: () => navigate('/verification/selfie'),
    },
    {
      type: 'id',
      label: 'ID Verification',
      icon: IdentificationIcon,
      status: userProfile?.idVerificationStatus || 'pending',
      description: 'Upload a government ID',
      action: () => navigate('/verification/id'),
    },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CheckBadgeIcon,
          label: 'Verified',
        };
      case 'rejected':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: XCircleIcon,
          label: 'Rejected',
        };
      default:
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: ClockIcon,
          label: 'Pending',
        };
    }
  };

  const verifiedCount = verifications.filter((v) => v.status === 'approved').length;
  const totalCount = verifications.length;

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Status
          </h1>
          <p className="text-gray-600">
            Verify your account to increase trust and visibility
          </p>
        </div>

        {/* Progress Card */}
        <div className="card mb-6 bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {verifiedCount} of {totalCount} Verified
              </h3>
              <div className="w-full bg-white rounded-full h-2 mb-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${(verifiedCount / totalCount) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {verifiedCount === totalCount
                  ? 'Fully verified! 🎉'
                  : 'Complete all verifications to unlock full benefits'}
              </p>
            </div>
          </div>
        </div>

        {/* Verification List */}
        <div className="space-y-4">
          {verifications.map((verification) => {
            const statusConfig = getStatusConfig(verification.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={verification.type} className="card">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <verification.icon className={`h-6 w-6 ${statusConfig.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {verification.label}
                      </h3>
                      <span
                        className={`flex items-center gap-1 text-xs font-medium ${statusConfig.color}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {verification.description}
                    </p>
                  </div>

                  {/* Action */}
                  {verification.action && verification.status !== 'approved' && (
                    <Button
                      onClick={verification.action}
                      variant={verification.status === 'rejected' ? 'primary' : 'secondary'}
                    >
                      {verification.status === 'rejected' ? 'Retry' : 'Upload'}
                    </Button>
                  )}
                  {verification.status === 'approved' && (
                    <CheckBadgeIcon className="h-8 w-8 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Card */}
        <div className="card mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            Why verify your account?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Increase trust with potential matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Higher visibility in match suggestions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Priority customer support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Verification badge on your profile</span>
            </li>
          </ul>
        </div>
      </div>
    </UserLayout>
  );
};

export default VerificationStatus;
