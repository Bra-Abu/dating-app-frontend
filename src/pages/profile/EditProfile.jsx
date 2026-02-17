import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import toast from 'react-hot-toast';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MultiStepForm from '../../components/forms/MultiStepForm';
import Step1BasicInfo from '../../components/forms/Step1BasicInfo';
import Step2ReligiousCultural from '../../components/forms/Step2ReligiousCultural';
import Step3PhysicalProfessional from '../../components/forms/Step3PhysicalProfessional';
import Step4LifestyleFamily from '../../components/forms/Step4LifestyleFamily';
import Step5PhotosGuardian from '../../components/forms/Step5PhotosGuardian';
import { getImageUrls } from '../../utils/imageUtils';

const EditProfile = () => {
  const navigate = useNavigate();
  const { userProfile, refreshProfile, loading } = useAuth();

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
    navigate('/create-profile');
    return null;
  }

  const steps = [
    {
      title: 'Basic Info',
      description: 'Update your basic information',
      component: Step1BasicInfo,
    },
    {
      title: 'Religious & Cultural',
      description: 'Update your background',
      component: Step2ReligiousCultural,
    },
    {
      title: 'Physical & Professional',
      description: 'Update your details',
      component: Step3PhysicalProfessional,
    },
    {
      title: 'Lifestyle & Family',
      description: 'Update your preferences',
      component: Step4LifestyleFamily,
    },
    {
      title: 'Photos & Guardian',
      description: 'Update photos and guardian info',
      component: Step5PhotosGuardian,
    },
  ];

  // Convert existing photos to the format expected by PhotoUpload
  const existingPhotos = userProfile.photoUrls
    ? userProfile.photoUrls.map((url, index) => ({
        id: `existing-${index}`,
        url: getImageUrls([url])[0],
        isExisting: true,
      }))
    : [];

  const initialData = {
    ...userProfile,
    photos: existingPhotos,
  };

  const handleComplete = async (formData) => {
    try {
      const submitData = new FormData();

      // Handle photos - separate new uploads from existing
      const newPhotos = formData.photos.filter((p) => !p.isExisting);
      const existingPhotoUrls = formData.photos
        .filter((p) => p.isExisting)
        .map((p) => p.url);

      newPhotos.forEach((photo) => {
        submitData.append('photos', photo.file);
      });

      if (existingPhotoUrls.length > 0) {
        submitData.append('existingPhotos', JSON.stringify(existingPhotoUrls));
      }

      // Add other fields
      Object.keys(formData).forEach((key) => {
        if (key !== 'photos') {
          const value = formData[key];
          if (Array.isArray(value)) {
            submitData.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined && value !== '') {
            submitData.append(key, value);
          }
        }
      });

      // Submit to API
      await api.put('/profile/update', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh profile data
      await refreshProfile();

      toast.success('Profile updated successfully!');
      navigate('/profile/me');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Your Profile
          </h1>
          <p className="text-gray-600">
            Update your information to keep your profile current
          </p>
        </div>

        <MultiStepForm
          steps={steps}
          onComplete={handleComplete}
          initialData={initialData}
        />
      </div>
    </UserLayout>
  );
};

export default EditProfile;
