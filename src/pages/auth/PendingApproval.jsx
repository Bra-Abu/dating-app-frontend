import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/common/Button';
import { ClockIcon } from '@heroicons/react/24/outline';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-yellow-100 p-4 rounded-full">
            <ClockIcon className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Pending Approval
          </h2>
          <p className="text-gray-600">
            Thank you for registering! Your account is currently under review by our admin team.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
          <p className="mb-2">
            <strong>What happens next?</strong>
          </p>
          <ul className="text-left space-y-2 list-disc list-inside">
            <li>Our team will review your registration</li>
            <li>You'll receive a notification once approved</li>
            <li>This usually takes 24-48 hours</li>
          </ul>
        </div>

        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-4">
            We'll send you a notification as soon as your account is approved. You can check back anytime.
          </p>
          <Button onClick={handleSignOut} variant="secondary" fullWidth>
            Sign Out
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PendingApproval;
