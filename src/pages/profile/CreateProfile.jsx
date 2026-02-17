import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import toast from 'react-hot-toast';
import MultiStepForm from '../../components/forms/MultiStepForm';
import Step1BasicInfo from '../../components/forms/Step1BasicInfo';
import Step2ReligiousCultural from '../../components/forms/Step2ReligiousCultural';
import Step3PhysicalProfessional from '../../components/forms/Step3PhysicalProfessional';
import Step4LifestyleFamily from '../../components/forms/Step4LifestyleFamily';
import Step5PhotosGuardian from '../../components/forms/Step5PhotosGuardian';

const CreateProfile = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  // Load draft from localStorage
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem('profile_draft');
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  };

  const steps = [
    {
      title: 'Basic Info',
      description: 'Tell us about yourself',
      component: Step1BasicInfo,
    },
    {
      title: 'Religious & Cultural',
      description: 'Your background and heritage',
      component: Step2ReligiousCultural,
    },
    {
      title: 'Physical & Professional',
      description: 'Your appearance and career',
      component: Step3PhysicalProfessional,
    },
    {
      title: 'Lifestyle & Family',
      description: 'Your lifestyle and preferences',
      component: Step4LifestyleFamily,
    },
    {
      title: 'Photos & Guardian',
      description: 'Upload photos and guardian info',
      component: Step5PhotosGuardian,
    },
  ];

  const handleComplete = async (formData) => {
    try {
      // Prepare form data for multipart upload
      const submitData = new FormData();

      // Add photos
      formData.photos.forEach((photo, index) => {
        submitData.append('photos', photo.file);
      });

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
      const response = await api.post('/profiles', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear draft
      localStorage.removeItem('profile_draft');

      // Refresh user data
      await refreshUserData();

      toast.success('Profile created successfully! Waiting for approval.');
      navigate('/pending-approval');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error(
        error.response?.data?.message || 'Failed to create profile'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Profile
          </h1>
          <p className="text-gray-600">
            Complete all steps to start finding your perfect match
          </p>
        </div>

        <MultiStepForm
          steps={steps}
          onComplete={handleComplete}
          initialData={loadDraft()}
        />
      </div>
    </div>
  );
};

export default CreateProfile;
