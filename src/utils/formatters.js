import { format, formatDistance, formatRelative } from 'date-fns';

// Format date to readable string
export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), pattern);
};

// Format date/time
export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

// Format time only
export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'HH:mm');
};

// Format phone number (Nigerian format)
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Convert +234XXXXXXXXXX to +234 XXX XXX XXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('234')) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
};

// Format height (cm to feet/inches display)
export const formatHeight = (cm) => {
  if (!cm) return '';
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${cm}cm (${feet}'${inches}")`;
};

// Format age range
export const formatAgeRange = (min, max) => {
  if (!min && !max) return 'Any age';
  if (!min) return `Up to ${max} years`;
  if (!max) return `${min}+ years`;
  return `${min}-${max} years`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format number with commas
export const formatNumber = (num) => {
  if (!num && num !== 0) return '';
  return num.toLocaleString();
};

// Format compatibility score
export const formatCompatibilityScore = (score) => {
  if (!score && score !== 0) return 'N/A';
  return `${Math.round(score)}%`;
};

// Format message preview
export const formatMessagePreview = (message, maxLength = 50) => {
  if (!message) return '';
  return truncateText(message, maxLength);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format array to comma-separated string
export const formatArray = (arr, separator = ', ') => {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.join(separator);
};

// Format match status
export const formatMatchStatus = (status) => {
  const statusMap = {
    liked: 'Liked',
    passed: 'Passed',
    mutual: 'Matched',
  };
  return statusMap[status] || status;
};

// Format verification status
export const formatVerificationStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    approved: 'Verified',
    rejected: 'Rejected',
  };
  return statusMap[status] || status;
};

// Format account status
export const formatAccountStatus = (status) => {
  const statusMap = {
    pending_approval: 'Pending Approval',
    active: 'Active',
    suspended: 'Suspended',
    banned: 'Banned',
  };
  return statusMap[status] || status;
};
