import { useState } from 'react';
import Select from '../common/Select';
import Button from '../common/Button';
import {
  RELIGION_OPTIONS,
  DENOMINATION_OPTIONS,
  TRIBE_OPTIONS,
  LANGUAGE_OPTIONS,
} from '../../utils/constants';
import { validateRequired } from '../../utils/validators';

const Step2ReligiousCultural = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    religion: data.religion || '',
    denomination: data.denomination || '',
    tribe: data.tribe || '',
    otherTribe: data.otherTribe || '',
    languages: data.languages || [],
    otherLanguage: data.otherLanguage || '',
    stateOfOrigin: data.stateOfOrigin || '',
    city: data.city || '',
  });

  const [errors, setErrors] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState(data.languages || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset denomination if religion changes
    if (name === 'religion') {
      setFormData({ ...formData, religion: value, denomination: '' });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleLanguageToggle = (language) => {
    const updated = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language];

    setSelectedLanguages(updated);
    setFormData({ ...formData, languages: updated });

    if (errors.languages) {
      setErrors({ ...errors, languages: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.religion)) {
      newErrors.religion = 'Religion is required';
    }
    // Denomination only required for Christianity (not for Islam or Other)
    if (formData.religion === 'Christianity' && !validateRequired(formData.denomination)) {
      newErrors.denomination = 'Denomination is required';
    }
    if (!validateRequired(formData.tribe)) {
      newErrors.tribe = 'Tribe is required';
    }
    if (selectedLanguages.length === 0) {
      newErrors.languages = 'Select at least one language';
    }
    if (!validateRequired(formData.stateOfOrigin)) {
      newErrors.stateOfOrigin = 'State of origin is required';
    }
    if (!validateRequired(formData.city)) {
      newErrors.city = 'City is required';
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

  const denominationOptions = formData.religion && DENOMINATION_OPTIONS[formData.religion];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Religion"
        name="religion"
        value={formData.religion}
        onChange={handleChange}
        options={RELIGION_OPTIONS}
        error={errors.religion}
        required
      />

      {denominationOptions && (
        <Select
          label="Denomination"
          name="denomination"
          value={formData.denomination}
          onChange={handleChange}
          options={denominationOptions}
          error={errors.denomination}
          required
        />
      )}

      <Select
        label="Tribe"
        name="tribe"
        value={formData.tribe}
        onChange={handleChange}
        options={TRIBE_OPTIONS}
        error={errors.tribe}
        required
      />

      {formData.tribe === 'Other' && (
        <div>
          <input
            type="text"
            name="otherTribe"
            value={formData.otherTribe}
            onChange={handleChange}
            placeholder="Specify your tribe..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Spoken
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => handleLanguageToggle(lang.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedLanguages.includes(lang.value)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        {selectedLanguages.includes('Other') && (
          <div className="mt-3">
            <input
              type="text"
              name="otherLanguage"
              value={formData.otherLanguage}
              onChange={handleChange}
              placeholder="Specify your language..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        )}
        {errors.languages && (
          <p className="mt-1 text-sm text-red-600">{errors.languages}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="stateOfOrigin" className="block text-sm font-medium text-gray-700 mb-1">
            Country of Origin
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="stateOfOrigin"
            name="stateOfOrigin"
            type="text"
            value={formData.stateOfOrigin}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-shadow ${
              errors.stateOfOrigin
                ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            }`}
            placeholder="e.g., Ghana"
            required
          />
          {errors.stateOfOrigin && (
            <p className="mt-1 text-sm text-red-600">{errors.stateOfOrigin}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Town
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-shadow ${
              errors.city
                ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            }`}
            placeholder="e.g., Accra"
            required
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>
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

export default Step2ReligiousCultural;
