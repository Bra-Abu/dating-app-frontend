// Phone number validation (Nigerian format)
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone);
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Required field validation
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Name validation (letters, spaces, hyphens only)
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s-]+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

// Age validation
export const validateAge = (age) => {
  const numAge = parseInt(age);
  return numAge >= 18 && numAge <= 100;
};

// Bio length validation
export const validateBioLength = (bio) => {
  return bio.length >= 50 && bio.length <= 500;
};

// Password strength validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Height validation (in cm)
export const validateHeight = (height) => {
  const numHeight = parseInt(height);
  return numHeight >= 140 && numHeight <= 220;
};

// Invite code validation
export const validateInviteCode = (code) => {
  // 8-character alphanumeric code
  const codeRegex = /^[A-Z0-9]{8}$/;
  return codeRegex.test(code);
};

// Image file validation
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'File must be JPEG, PNG, or WebP' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true };
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }

    if (value && rule.validate) {
      const result = rule.validate(value);
      if (!result) {
        errors[field] = rule.message || `Invalid ${rule.label || field}`;
      }
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must be at most ${rule.maxLength} characters`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
