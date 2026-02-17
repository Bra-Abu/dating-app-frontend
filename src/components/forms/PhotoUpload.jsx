import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { validateImageFile, compressImage } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const PhotoUpload = ({ photos, onChange, maxPhotos = 6, minPhotos = 1 }) => {
  const [previews, setPreviews] = useState(photos || []);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (previews.length + acceptedFiles.length > maxPhotos) {
        toast.error(`You can upload maximum ${maxPhotos} photos`);
        return;
      }

      setUploading(true);

      try {
        const newPreviews = [];

        for (const file of acceptedFiles) {
          // Validate
          const validation = validateImageFile(file);
          if (!validation.valid) {
            toast.error(validation.error);
            continue;
          }

          // Compress
          const compressed = await compressImage(file);

          // Create preview
          const preview = {
            file: compressed,
            url: URL.createObjectURL(compressed),
            id: Date.now() + Math.random(),
          };

          newPreviews.push(preview);
        }

        const updated = [...previews, ...newPreviews];
        setPreviews(updated);
        onChange(updated);
        toast.success(`${newPreviews.length} photo(s) added`);
      } catch (error) {
        console.error('Error processing photos:', error);
        toast.error('Failed to process photos');
      } finally {
        setUploading(false);
      }
    },
    [previews, maxPhotos, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removePhoto = (id) => {
    const updated = previews.filter((p) => p.id !== id);
    setPreviews(updated);
    onChange(updated);
  };

  const movePhoto = (index, direction) => {
    const newPreviews = [...previews];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPreviews.length) return;

    [newPreviews[index], newPreviews[targetIndex]] = [
      newPreviews[targetIndex],
      newPreviews[index],
    ];

    setPreviews(newPreviews);
    onChange(newPreviews);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Photos
        <span className="text-red-500 ml-1">*</span>
        <span className="text-gray-500 font-normal ml-2">
          ({minPhotos}-{maxPhotos} photos)
        </span>
      </label>

      {/* Photo Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {previews.map((preview, index) => (
            <div key={preview.id} className="relative group">
              <img
                src={preview.url}
                alt={`Preview ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />

              {/* Badge for first photo */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                  Main Photo
                </div>
              )}

              {/* Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {index > 0 && (
                  <button
                    onClick={() => movePhoto(index, 'left')}
                    className="bg-white text-gray-900 px-3 py-1 rounded text-sm font-medium"
                  >
                    ←
                  </button>
                )}
                {index < previews.length - 1 && (
                  <button
                    onClick={() => movePhoto(index, 'right')}
                    className="bg-white text-gray-900 px-3 py-1 rounded text-sm font-medium"
                  >
                    →
                  </button>
                )}
                <button
                  onClick={() => removePhoto(preview.id)}
                  className="bg-red-600 text-white p-2 rounded-full"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {previews.length < maxPhotos && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Drop photos here...'
              : 'Drag & drop photos, or click to select'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, WebP up to 5MB
          </p>
          {uploading && (
            <p className="mt-2 text-sm text-primary-600">Processing photos...</p>
          )}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        First photo will be your main profile picture. Drag photos to reorder.
      </p>
    </div>
  );
};

export default PhotoUpload;
