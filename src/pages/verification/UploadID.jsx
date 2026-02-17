import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/common/Button';
import { compressImage, validateImageFile } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import {
  IdentificationIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const UploadID = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload ID mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('id', file);
      const response = await api.post('/verification/id', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('ID uploaded successfully! It will be reviewed soon.');
      navigate('/verification/status');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload ID');
    },
  });

  const handleFileSelect = async (file) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      // Compress image
      const compressed = await compressImage(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 2048,
      });

      setSelectedFile(compressed);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(compressed);
    } catch (error) {
      toast.error('Failed to process image');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error('Please select a photo of your ID');
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/verification/status')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Verification Status
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Government ID
          </h1>
          <p className="text-gray-600">
            Upload a clear photo of your government-issued ID for verification
          </p>
        </div>

        {/* Security Notice */}
        <div className="card mb-6 bg-green-50 border-green-200">
          <div className="flex gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Your privacy is protected
              </h3>
              <p className="text-sm text-gray-700">
                Your ID is encrypted and only used for verification. It will never
                be shared publicly or with other users. We comply with all data
                protection regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            ID Photo Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Clear photo showing all four corners</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>All text must be readable</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>ID must not be expired</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                Accepted: National ID, Driver's License, Passport, Voter's Card
              </span>
            </li>
            <li className="flex items-start gap-2">
              <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>No screenshots or photocopies</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>No glare or shadows covering information</span>
            </li>
          </ul>
        </div>

        {/* Upload Area */}
        <div className="card">
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <IdentificationIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload your ID
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Drag and drop or choose a file
              </p>

              <div className="flex justify-center">
                {/* File Upload */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Button variant="primary">
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    Choose File
                  </Button>
                </label>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                JPEG, PNG, or WebP • Max 5MB
              </p>
            </div>
          ) : (
            <div>
              {/* Preview */}
              <div className="mb-6">
                <img
                  src={preview}
                  alt="ID preview"
                  className="w-full max-h-96 object-contain rounded-lg bg-gray-100"
                />
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Please ensure all corners are visible and text is readable
                  before submitting.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleRemove}
                  variant="secondary"
                  className="flex-1"
                >
                  Remove
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  isLoading={uploadMutation.isPending}
                  className="flex-1"
                >
                  Submit for Verification
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="card mt-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-900">
                How long does verification take?
              </p>
              <p className="text-gray-700">
                Most verifications are reviewed within 24-48 hours.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                What if my ID is rejected?
              </p>
              <p className="text-gray-700">
                You'll receive feedback on why it was rejected and can submit a
                new photo that meets the guidelines.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Is my data secure?
              </p>
              <p className="text-gray-700">
                Yes, your ID is encrypted and stored securely. We never share your
                ID with other users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UploadID;
