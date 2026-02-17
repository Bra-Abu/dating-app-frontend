import { useState } from 'react';
import Select from '../common/Select';
import Button from '../common/Button';
import {
  LIFESTYLE_OPTIONS,
  CHILDREN_OPTIONS,
  PERSONALITY_TRAITS,
  INTERESTS,
} from '../../utils/constants';
import { validateRequired } from '../../utils/validators';

const Step4LifestyleFamily = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    smoking: data.smoking || '',
    drinking: data.drinking || '',
    childrenPreference: data.childrenPreference || '',
    numberOfChildren: data.numberOfChildren || '',
    willingToRelocate: data.willingToRelocate || '',
    personalityTraits: data.personalityTraits || [],
    interests: data.interests || [],
    otherInterest: data.otherInterest || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleArrayToggle = (field, value) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    setFormData({ ...formData, [field]: updated });

    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.smoking)) {
      newErrors.smoking = 'Smoking preference is required';
    }
    if (!validateRequired(formData.drinking)) {
      newErrors.drinking = 'Drinking preference is required';
    }
    if (!validateRequired(formData.childrenPreference)) {
      newErrors.childrenPreference = 'Children preference is required';
    }
    if (!validateRequired(formData.willingToRelocate)) {
      newErrors.willingToRelocate = 'Relocation preference is required';
    }
    if (formData.personalityTraits.length === 0) {
      newErrors.personalityTraits = 'Select at least 3 personality traits';
    } else if (formData.personalityTraits.length < 3) {
      newErrors.personalityTraits = 'Select at least 3 personality traits';
    }
    if (formData.interests.length === 0) {
      newErrors.interests = 'Select at least 3 interests';
    } else if (formData.interests.length < 3) {
      newErrors.interests = 'Select at least 3 interests';
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

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Smoking"
          name="smoking"
          value={formData.smoking}
          onChange={handleChange}
          options={LIFESTYLE_OPTIONS}
          error={errors.smoking}
          required
        />
        <Select
          label="Drinking"
          name="drinking"
          value={formData.drinking}
          onChange={handleChange}
          options={LIFESTYLE_OPTIONS}
          error={errors.drinking}
          required
        />
      </div>

      <Select
        label="Children Preference"
        name="childrenPreference"
        value={formData.childrenPreference}
        onChange={handleChange}
        options={CHILDREN_OPTIONS}
        error={errors.childrenPreference}
        required
      />

      {formData.childrenPreference === 'have_children' && (
        <div>
          <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Children
          </label>
          <input
            id="numberOfChildren"
            name="numberOfChildren"
            type="number"
            min="0"
            max="20"
            value={formData.numberOfChildren}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      )}

      <Select
        label="Willing to Relocate?"
        name="willingToRelocate"
        value={formData.willingToRelocate}
        onChange={handleChange}
        options={yesNoOptions}
        error={errors.willingToRelocate}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Personality Traits
          <span className="text-red-500 ml-1">*</span>
          <span className="text-gray-500 font-normal ml-2">
            (Select at least 3)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TRAITS.map((trait) => (
            <button
              key={trait}
              type="button"
              onClick={() => handleArrayToggle('personalityTraits', trait)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                formData.personalityTraits.includes(trait)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
              }`}
            >
              {trait}
            </button>
          ))}
        </div>
        {errors.personalityTraits && (
          <p className="mt-1 text-sm text-red-600">{errors.personalityTraits}</p>
        )}
        {formData.personalityTraits.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {formData.personalityTraits.length} selected
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests & Hobbies
          <span className="text-red-500 ml-1">*</span>
          <span className="text-gray-500 font-normal ml-2">
            (Select at least 3)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => handleArrayToggle('interests', interest)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                formData.interests.includes(interest)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        {formData.interests.includes('Other') && (
          <div className="mt-3">
            <input
              type="text"
              name="otherInterest"
              value={formData.otherInterest}
              onChange={handleChange}
              placeholder="Specify your other interest..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        )}
        {errors.interests && (
          <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
        )}
        {formData.interests.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {formData.interests.length} selected
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
};

export default Step4LifestyleFamily;
