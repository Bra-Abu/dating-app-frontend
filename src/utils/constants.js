// Account Status
export const ACCOUNT_STATUS = {
  PENDING_APPROVAL: 'pending_approval',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

// Religion Options
export const RELIGION_OPTIONS = [
  { value: 'Islam', label: 'Islam' },
  { value: 'Christianity', label: 'Christianity' },
  { value: 'Other', label: 'Other' },
];

// Denomination Options (only for Christianity, removed for Islam)
export const DENOMINATION_OPTIONS = {
  Christianity: [
    { value: 'Catholic', label: 'Catholic' },
    { value: 'Protestant', label: 'Protestant' },
    { value: 'Orthodox', label: 'Orthodox' },
    { value: 'Pentecostal', label: 'Pentecostal' },
    { value: 'Other', label: 'Other' },
  ],
};

// Ghanaian Tribes
export const TRIBE_OPTIONS = [
  { value: 'Akan', label: 'Akan' },
  { value: 'Ewe', label: 'Ewe' },
  { value: 'Ga-Dangme', label: 'Ga-Dangme' },
  { value: 'Dagomba', label: 'Dagomba' },
  { value: 'Gonja', label: 'Gonja' },
  { value: 'Mamprusi', label: 'Mamprusi' },
  { value: 'Konkomba', label: 'Konkomba' },
  { value: 'Frafra', label: 'Frafra' },
  { value: 'Kusasi', label: 'Kusasi' },
  { value: 'Wala', label: 'Wala' },
  { value: 'Builsa', label: 'Builsa' },
  { value: 'Nanumba', label: 'Nanumba' },
  { value: 'Other', label: 'Other' },
];

// Education Levels (must match database exactly)
export const EDUCATION_OPTIONS = [
  { value: 'High School', label: 'High School' },
  { value: 'Associate Degree', label: 'Associate Degree' },
  { value: 'Bachelor Degree', label: 'Bachelor Degree' },
  { value: 'Master Degree', label: 'Master Degree' },
  { value: 'Doctorate', label: 'Doctorate' },
  { value: 'Professional Degree', label: 'Professional Degree' },
  { value: 'Trade School', label: 'Trade School' },
  { value: 'Other', label: 'Other' },
];

// Marital Status (must match database exactly)
export const MARITAL_STATUS_OPTIONS = [
  { value: 'Never Married', label: 'Never Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
  { value: 'Separated', label: 'Separated' },
];

// Yes/No Options
export const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

// Smoking/Drinking Options (must match database - capitalized)
export const LIFESTYLE_OPTIONS = [
  { value: 'Never', label: 'Never' },
  { value: 'Occasionally', label: 'Occasionally' },
  { value: 'Regularly', label: 'Regularly' },
];

// Children Preferences (for want_children field - must match database)
export const CHILDREN_OPTIONS = [
  { value: 'Definitely Yes', label: 'Definitely Yes' },
  { value: 'Probably Yes', label: 'Probably Yes' },
  { value: 'Undecided', label: 'Undecided' },
  { value: 'Probably No', label: 'Probably No' },
  { value: 'Definitely No', label: 'Definitely No' },
];

// Personality Traits
export const PERSONALITY_TRAITS = [
  'Adventurous', 'Ambitious', 'Caring', 'Creative', 'Easy-going',
  'Energetic', 'Funny', 'Generous', 'Honest', 'Humble',
  'Intelligent', 'Kind', 'Loyal', 'Optimistic', 'Organized',
  'Patient', 'Religious', 'Respectful', 'Romantic', 'Spiritual', 'Supportive'
];

// Interests/Hobbies
export const INTERESTS = [
  'Art', 'Books', 'Cooking', 'Dancing', 'Fashion', 'Fitness',
  'Gaming', 'Movies', 'Music', 'Photography', 'Reading', 'Sports',
  'Technology', 'Travel', 'Volunteering', 'Writing', 'Other'
];

// Languages
export const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Hausa', label: 'Hausa' },
  { value: 'Igbo', label: 'Igbo' },
  { value: 'Yoruba', label: 'Yoruba' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'French', label: 'French' },
  { value: 'Other', label: 'Other' },
];

// Height Range (in cm)
export const HEIGHT_RANGE = {
  min: 140,
  max: 220,
};

// Age Range
export const AGE_RANGE = {
  min: 18,
  max: 100,
};

// Profile Photo Limits
export const PHOTO_LIMITS = {
  min: 1,
  max: 6,
  maxSizeInMB: 5,
};

// Verification Types
export const VERIFICATION_TYPES = {
  PHONE: 'phone',
  PHOTO: 'photo',
  ID: 'id',
};

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_MATCH: 'new_match',
  NEW_MESSAGE: 'new_message',
  PROFILE_APPROVED: 'profile_approved',
  PROFILE_REJECTED: 'profile_rejected',
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  GUARDIAN_ALERT: 'guardian_alert',
};

// Report Reasons
export const REPORT_REASONS = [
  { value: 'inappropriate_content', label: 'Inappropriate Content' },
  { value: 'fake_profile', label: 'Fake Profile' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'scam_or_fraud', label: 'Scam or Fraud' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Other' },
];

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  GUARDIAN_ALERT: 'guardian_alert',
};

// Profile Status
export const PROFILE_STATUS = {
  PENDING_APPROVAL: 'pending_approval',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
};

// Match Status
export const MATCH_STATUS = {
  LIKED: 'liked',
  PASSED: 'passed',
  MUTUAL: 'mutual',
};

// Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// Upload Base URL
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000/uploads';
