import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  FlagIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const REPORT_TYPES = [
  {
    value: 'inappropriate_behavior',
    label: 'Inappropriate Behavior',
    description: 'Harassment, hate speech, or offensive conduct',
  },
  {
    value: 'fake_profile',
    label: 'Fake Profile',
    description: 'Profile appears to be fake or impersonating someone',
  },
  {
    value: 'spam',
    label: 'Spam or Scam',
    description: 'Sending spam messages or attempting to scam',
  },
  {
    value: 'inappropriate_photos',
    label: 'Inappropriate Photos',
    description: 'Photos contain inappropriate or offensive content',
  },
  {
    value: 'underage',
    label: 'Underage User',
    description: 'User appears to be under 18 years old',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Another reason not listed above',
  },
];

const ReportUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');

  const returnPath = location.state?.from || '/browse';

  // Fetch user info
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/profiles/${userId}`);
      return response.data.profile;
    },
  });

  // Submit report mutation
  const reportMutation = useMutation({
    mutationFn: async (reportData) => {
      const response = await api.post(`/reports`, reportData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Report submitted successfully. We will review it shortly.');
      navigate(returnPath);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedType) {
      toast.error('Please select a report type');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    reportMutation.mutate({
      reportedUserId: userId,
      reportType: selectedType,
      description: description.trim(),
    });
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

  const user = userData;

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(returnPath)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report User</h1>
          <p className="text-gray-600">
            Help us keep the community safe by reporting inappropriate behavior
          </p>
        </div>

        {/* Warning Card */}
        <div className="card mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                False Reports
              </h3>
              <p className="text-sm text-gray-700">
                Please only submit genuine reports. False or malicious reports
                may result in action against your account.
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="card mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-gray-600">
                  {user.firstName?.[0] || '?'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Reporting: {user.firstName}, {user.age}
                </h3>
                <p className="text-sm text-gray-600">
                  {user.city}, {user.stateOfOrigin}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="card">
          <h3 className="font-semibold text-gray-900 mb-4">
            What would you like to report?
          </h3>

          {/* Report Type Selection */}
          <div className="space-y-3 mb-6">
            {REPORT_TYPES.map((type) => (
              <label
                key={type.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedType === type.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="reportType"
                  value={type.value}
                  checked={selectedType === type.value}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{type.label}</p>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide specific details about what happened..."
              rows={6}
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/1000 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => navigate(returnPath)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={reportMutation.isPending}
              className="flex-1"
            >
              <FlagIcon className="h-5 w-5 mr-2" />
              Submit Report
            </Button>
          </div>
        </form>

        {/* What Happens Next */}
        <div className="card mt-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">1.</span>
              <span>
                Our moderation team will review your report within 24-48 hours
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">2.</span>
              <span>
                We may reach out if we need additional information
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">3.</span>
              <span>
                Appropriate action will be taken based on our community guidelines
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">4.</span>
              <span>You can track your report in Settings → My Reports</span>
            </li>
          </ul>
        </div>
      </div>
    </UserLayout>
  );
};

export default ReportUser;
