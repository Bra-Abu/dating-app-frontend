import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/common/Button';
import { compressImage, validateImageFile } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import {
  CameraIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const UploadSelfie = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload selfie mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await api.post('/verification/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Selfie uploaded successfully! It will be reviewed soon.');
      navigate('/verification/status');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload selfie');
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
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
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

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error('Please select a photo');
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
            Upload Selfie
          </h1>
          <p className="text-gray-600">
            Take a clear photo of yourself to verify your identity
          </p>
        </div>

        {/* Instructions Card */}
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            Photo Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Clear, well-lit photo of your face</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Look directly at the camera</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>No sunglasses or face coverings</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>No filters or heavy editing</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>No group photos</span>
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
              <CameraIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload a selfie
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Drag and drop or choose a file
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* Camera Capture (Mobile) */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleCameraCapture}
                    className="hidden"
                  />
                  <Button variant="primary" className="w-full sm:w-auto">
                    <CameraIcon className="h-5 w-5 mr-2" />
                    Take Photo
                  </Button>
                </label>

                {/* File Upload */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Button variant="secondary" className="w-full sm:w-auto">
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
                  alt="Selfie preview"
                  className="w-full max-h-96 object-contain rounded-lg bg-gray-100"
                />
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

        {/* Why Verify Card */}
        <div className="card mt-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-2">
            Why verify your photo?
          </h3>
          <p className="text-sm text-gray-700">
            Photo verification helps ensure that you're a real person and that your
            profile photos are authentic. Verified profiles get more matches and
            increased visibility on the platform.
          </p>
        </div>
      </div>
    </UserLayout>
  );
};

export default UploadSelfie;
