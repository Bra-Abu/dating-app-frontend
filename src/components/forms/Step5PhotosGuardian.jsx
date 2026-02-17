import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import PhotoUpload from './PhotoUpload';
import { validatePhone } from '../../utils/validators';

const Step5PhotosGuardian = ({ data, onNext, onBack, isLastStep }) => {
  const [formData, setFormData] = useState({
    photos: data.photos || [],
    requiresGuardian: data.requiresGuardian || false,
    guardianName: data.guardianName || '',
    guardianPhone: data.guardianPhone || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Check if guardian info is shown (Muslim women) - checking all form data
  const showGuardianFields =
    (data.gender === 'female' || formData.gender === 'female') &&
    (data.religion === 'Islam' || formData.religion === 'Islam');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePhotosChange = (photos) => {
    setFormData({ ...formData, photos });
    if (errors.photos) {
      setErrors({ ...errors, photos: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.photos.length < 2) {
      newErrors.photos = 'Upload at least 2 photos (Profile + Full Body)';
    }

    // Guardian fields are optional but validate if provided
    if (showGuardianFields) {
      if (formData.guardianName.trim() && !formData.guardianPhone.trim()) {
        newErrors.guardianPhone = 'Guardian phone is required if name is provided';
      }
      if (formData.guardianPhone.trim() && !validatePhone(formData.guardianPhone)) {
        newErrors.guardianPhone = 'Invalid phone number';
      }
      if (formData.guardianPhone.trim() && !formData.guardianName.trim()) {
        newErrors.guardianName = 'Guardian name is required if phone is provided';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Add guardian flag
      const finalData = {
        ...formData,
        requiresGuardian: showGuardianFields,
      };

      await onNext(finalData);
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Photo Requirements:</strong> Upload at least 2 photos
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>Profile Photo (visible to everyone)</li>
          <li>Full Body Photo (visible only after matching)</li>
        </ul>
      </div>

      <PhotoUpload
        photos={formData.photos}
        onChange={handlePhotosChange}
        maxPhotos={6}
        minPhotos={2}
      />
      {errors.photos && (
        <p className="text-sm text-red-600 -mt-4">{errors.photos}</p>
      )}

      {showGuardianFields && (
        <div className="border-t pt-6 mt-6">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Guardian Information (Optional):</strong> As per Islamic tradition,
              guardian/wali information can be provided for Muslim women. This helps
              ensure proper Islamic etiquette in the matchmaking process.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Guardian Full Name (Optional)"
              name="guardianName"
              type="text"
              value={formData.guardianName}
              onChange={handleChange}
              error={errors.guardianName}
              placeholder="Full name of your wali/guardian"
            />

            <Input
              label="Guardian Phone Number (Optional)"
              name="guardianPhone"
              type="tel"
              value={formData.guardianPhone}
              onChange={handleChange}
              error={errors.guardianPhone}
              placeholder="08012345678"
            />
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium mb-2">Before submitting:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Review all your information for accuracy</li>
          <li>Ensure photos are clear and appropriate</li>
          <li>Your profile will be reviewed by our admin team</li>
          <li>You'll receive a notification once approved</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" loading={loading}>
          {isLastStep ? 'Submit Profile' : 'Next Step'}
        </Button>
      </div>
    </form>
  );
};

export default Step5PhotosGuardian;
