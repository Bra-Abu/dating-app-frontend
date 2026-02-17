import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { EDUCATION_OPTIONS, MARITAL_STATUS_OPTIONS } from '../../utils/constants';
import { validateRequired, validateHeight } from '../../utils/validators';

const Step3PhysicalProfessional = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    height: data.height || '',
    bodyType: data.bodyType || '',
    complexion: data.complexion || '',
    occupation: data.occupation || '',
    education: data.education || '',
    employmentStatus: data.employmentStatus || '',
    maritalStatus: data.maritalStatus || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.height)) {
      newErrors.height = 'Height is required';
    } else if (!validateHeight(formData.height)) {
      newErrors.height = 'Height must be between 140-220 cm';
    }
    if (!validateRequired(formData.bodyType)) {
      newErrors.bodyType = 'Body type is required';
    }
    if (!validateRequired(formData.complexion)) {
      newErrors.complexion = 'Complexion is required';
    }
    if (!validateRequired(formData.occupation)) {
      newErrors.occupation = 'Occupation is required';
    }
    if (!validateRequired(formData.education)) {
      newErrors.education = 'Education level is required';
    }
    if (!validateRequired(formData.employmentStatus)) {
      newErrors.employmentStatus = 'Employment status is required';
    }
    if (!validateRequired(formData.maritalStatus)) {
      newErrors.maritalStatus = 'Marital status is required';
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

  const bodyTypeOptions = [
    { value: 'Slim', label: 'Slim' },
    { value: 'Athletic', label: 'Athletic' },
    { value: 'Average', label: 'Average' },
    { value: 'Muscular', label: 'Muscular' },
    { value: 'Curvy', label: 'Curvy' },
    { value: 'Heavy', label: 'Heavy' },
  ];

  const complexionOptions = [
    { value: 'Very Fair', label: 'Very Fair' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Olive', label: 'Olive' },
    { value: 'Brown', label: 'Brown' },
    { value: 'Dark Brown', label: 'Dark Brown' },
    { value: 'Very Dark', label: 'Very Dark' },
  ];

  const employmentOptions = [
    { value: 'Employed Full-time', label: 'Employed Full-time' },
    { value: 'Employed Part-time', label: 'Employed Part-time' },
    { value: 'Self-employed', label: 'Self-employed' },
    { value: 'Student', label: 'Student' },
    { value: 'Unemployed', label: 'Unemployed' },
    { value: 'Retired', label: 'Retired' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Height (cm)"
          name="height"
          type="number"
          min="140"
          max="220"
          value={formData.height}
          onChange={handleChange}
          error={errors.height}
          required
        />
        <Select
          label="Body Type"
          name="bodyType"
          value={formData.bodyType}
          onChange={handleChange}
          options={bodyTypeOptions}
          error={errors.bodyType}
          required
        />
        <Select
          label="Complexion"
          name="complexion"
          value={formData.complexion}
          onChange={handleChange}
          options={complexionOptions}
          error={errors.complexion}
          required
        />
      </div>

      <Input
        label="Occupation / Job Title"
        name="occupation"
        type="text"
        value={formData.occupation}
        onChange={handleChange}
        error={errors.occupation}
        placeholder="e.g. Software Engineer, Teacher, Business Owner"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Education Level"
          name="education"
          value={formData.education}
          onChange={handleChange}
          options={EDUCATION_OPTIONS}
          error={errors.education}
          required
        />
        <Select
          label="Employment Status"
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
          options={employmentOptions}
          error={errors.employmentStatus}
          required
        />
      </div>

      <Select
        label="Marital Status"
        name="maritalStatus"
        value={formData.maritalStatus}
        onChange={handleChange}
        options={MARITAL_STATUS_OPTIONS}
        error={errors.maritalStatus}
        required
      />

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
};

export default Step3PhysicalProfessional;
