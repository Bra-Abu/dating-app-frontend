import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../config/firebase';
import api from '../../config/api';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
        }
      );
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format phone number
      let formattedPhone = phoneNumber.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+234' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+234' + formattedPhone;
      }

      console.log('🔵 Sending OTP to:', formattedPhone);

      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

      console.log('✅ OTP sent successfully!');

      setConfirmationResult(confirmation);
      setStep('otp');
      toast.success('OTP sent to your phone');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔵 Verifying OTP:', otp);
      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      console.log('✅ OTP verified successfully!');
      const idToken = await result.user.getIdToken();

      // Verify with backend
      const response = await api.post('/auth/verify', { idToken });
      const data = response.data.data;

      // Navigate based on account status
      if (data.status === 'pending_approval') {
        navigate('/pending-approval');
      } else if (data.status === 'active') {
        if (data.accountType === 'admin' || data.accountType === 'super_admin') {
          navigate('/admin/dashboard');
        } else if (!data.hasProfile) {
          navigate('/create-profile');
        } else {
          navigate('/browse');
        }
      } else {
        toast.error('Your account has been suspended or banned');
        await auth.signOut();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error.response?.status === 404 && error.response?.data?.requiresRegistration) {
        toast.error('Phone not registered. Please register with an invite code first.');
        navigate('/register');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div id="recaptcha-container"></div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="08012345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Send OTP
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Register
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
            <p className="text-gray-600">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
          </div>

          <Input
            label="OTP Code"
            name="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Verify & Login
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep('phone');
              setOtp('');
            }}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            Change phone number
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default Login;
