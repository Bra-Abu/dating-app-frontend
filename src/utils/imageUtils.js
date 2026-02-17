import imageCompression from 'browser-image-compression';

// Validate image file type and size
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

// Compress image before upload
export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

// Convert image file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Create image preview URL
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

// Revoke image preview URL
export const revokeImagePreview = (url) => {
  URL.revokeObjectURL(url);
};

// Validate image dimensions
export const validateImageDimensions = (file, minWidth, minHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width < minWidth || img.height < minHeight) {
        reject(new Error(`Image must be at least ${minWidth}x${minHeight}px`));
      } else {
        resolve({ width: img.width, height: img.height });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Invalid image file'));
    };
  });
};

// Get image URL from uploads
export const getImageUrl = (filename) => {
  if (!filename) return null;
  const baseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000/uploads';
  return `${baseUrl}/${filename}`;
};

// Get multiple image URLs
export const getImageUrls = (filenames) => {
  if (!filenames || !Array.isArray(filenames)) return [];
  return filenames.map(getImageUrl);
};

// Check if image should be blurred
export const shouldBlurImage = (isMatched) => {
  return !isMatched;
};

// Compress multiple images
export const compressMultipleImages = async (files, options = {}) => {
  const compressionPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressionPromises);
};
