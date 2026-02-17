import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { GENDER_OPTIONS } from '../../utils/constants';
import { validateRequired, validateAge, validateBioLength } from '../../utils/validators';

const Step1BasicInfo = ({ data, onNext }) => {
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    dateOfBirth: data.dateOfBirth || '',
    gender: data.gender || '',
    bio: data.bio || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.firstName)) {
      newErrors.firstName = 'First name is required';
    }
    if (!validateRequired(formData.lastName)) {
      newErrors.lastName = 'Last name is required';
    }
    if (!validateRequired(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Validate age from DOB (must be 18+)
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

      if (actualAge < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      } else if (actualAge > 100) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    if (!validateRequired(formData.gender)) {
      newErrors.gender = 'Gender is required';
    }
    if (!validateRequired(formData.bio)) {
      newErrors.bio = 'Bio is required';
    } else if (!validateBioLength(formData.bio)) {
      newErrors.bio = 'Bio must be between 50 and 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const bioLength = formData.bio.length;
  const bioMin = 50;
  const bioMax = 500;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        error={errors.dateOfBirth}
        required
      />

      <Select
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        options={GENDER_OPTIONS}
        error={errors.gender}
        required
      />

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio / About Me
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          value={formData.bio}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg outline-none transition-shadow resize-none ${
            errors.bio
              ? 'border-red-500 focus:ring-2 focus:ring-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          }`}
          placeholder="Tell us about yourself, your interests, what you're looking for..."
          required
        />
        <div className="flex justify-between mt-1">
          {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
          <p
            className={`text-sm ml-auto ${
              bioLength < bioMin
                ? 'text-red-600'
                : bioLength > bioMax
                ? 'text-red-600'
                : 'text-gray-500'
            }`}
          >
            {bioLength}/{bioMax} characters
            {bioLength < bioMin && ` (minimum ${bioMin})`}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;
