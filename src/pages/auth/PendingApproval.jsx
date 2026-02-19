import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/common/Button';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../../config/api';
import toast from 'react-hot-toast';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { signOut, refreshUserData } = useAuth();
  const [checking, setChecking] = useState(false);
  const [approved, setApproved] = useState(false);

  // Auto-check status every 15 seconds
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await api.get('/auth/me');
        const user = response.data.data.user;
        if (user.status === 'active') {
          setApproved(true);
          toast.success('Your account has been approved!');
          await refreshUserData();
          setTimeout(() => navigate('/create-profile'), 2000);
        }
      } catch (error) {
        // Silently ignore polling errors
      }
    };

    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, [navigate, refreshUserData]);

  const handleCheckNow = async () => {
    setChecking(true);
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      if (user.status === 'active') {
        setApproved(true);
        toast.success('Your account has been approved!');
        await refreshUserData();
        setTimeout(() => navigate('/create-profile'), 1500);
      } else {
        toast('Still pending approval. Please wait.', { icon: '⏳' });
      }
    } catch (error) {
      toast.error('Could not check status. Try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (approved) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Account Approved!</h2>
          <p className="text-gray-600">Redirecting you now...</p>
        </div>
      </AuthLayout>
    );
  }

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
            Your registration is under review. We'll update this page automatically when approved.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
          <p className="mb-2"><strong>What happens next?</strong></p>
          <ul className="text-left space-y-2 list-disc list-inside">
            <li>Admin reviews your registration</li>
            <li>This page auto-refreshes every 15 seconds</li>
            <li>You'll be redirected automatically when approved</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={handleCheckNow} fullWidth loading={checking}>
            Check Approval Status
          </Button>
          <Button onClick={handleSignOut} variant="secondary" fullWidth>
            Sign Out
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PendingApproval;
