import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const [step, setStep] = useState('invite'); // 'invite', 'phone', 'otp', 'details'
  const [formData, setFormData] = useState({
    inviteCode: '',
    phoneNumber: '',
    otp: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleInviteCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate invite code with backend
      await api.post('/auth/validate-invite', { code: formData.inviteCode.toUpperCase() });
      setStep('phone');
      toast.success('Invite code verified');
    } catch (error) {
      console.error('Error validating invite code:', error);
      toast.error(error.response?.data?.message || 'Invalid invite code');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format phone number
      let formattedPhone = formData.phoneNumber.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+234' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+234' + formattedPhone;
      }

      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

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
      await confirmationResult.confirm(formData.otp);
      setStep('details');
      toast.success('Phone verified successfully');
      setLoading(false);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const idToken = await auth.currentUser.getIdToken();

      // Register with backend
      const response = await api.post('/auth/register', {
        idToken,
        inviteCode: formData.inviteCode.toUpperCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });

      toast.success('Registration successful! Please create your profile.');
      await refreshUserData();
      navigate('/create-profile');
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div id="recaptcha-container"></div>

      {step === 'invite' && (
        <form onSubmit={handleInviteCode} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Us</h2>
            <p className="text-gray-600">Enter your invite code to get started</p>
          </div>

          <Input
            label="Invite Code"
            name="inviteCode"
            type="text"
            placeholder="ABCD1234"
            value={formData.inviteCode}
            onChange={handleChange}
            maxLength={8}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Continue
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign In
            </button>
          </div>
        </form>
      )}

      {step === 'phone' && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Phone Number</h2>
            <p className="text-gray-600">We'll send you a verification code</p>
          </div>

          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="08012345678"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Send OTP
          </Button>

          <button
            type="button"
            onClick={() => setStep('invite')}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
            <p className="text-gray-600">
              Enter the 6-digit code sent to {formData.phoneNumber}
            </p>
          </div>

          <Input
            label="OTP Code"
            name="otp"
            type="text"
            placeholder="123456"
            value={formData.otp}
            onChange={handleChange}
            maxLength={6}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Verify
          </Button>

          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            Change phone number
          </button>
        </form>
      )}

      {step === 'details' && (
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Registration</h2>
            <p className="text-gray-600">Tell us your name</p>
          </div>

          <Input
            label="First Name"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <Input
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Complete Registration
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default Register;
