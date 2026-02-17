import { XMarkIcon, HeartIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';

const ActionButtons = ({ onPass, onLike, onInfo, disabled = false }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Pass Button */}
      <button
        onClick={onPass}
        disabled={disabled}
        className="group relative w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
        title="Pass"
      >
        <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity" />
        <XMarkIcon className="h-8 w-8 text-red-500 mx-auto" />
      </button>

      {/* Info Button */}
      <button
        onClick={onInfo}
        disabled={disabled}
        className="group relative w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
        title="View Full Profile"
      >
        <div className="absolute inset-0 bg-primary-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity" />
        <InformationCircleIcon className="h-7 w-7 text-primary-600 mx-auto" />
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={disabled}
        className="group relative w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
        title="Like"
      >
        <div className="absolute inset-0 bg-green-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity" />
        <HeartIcon className="h-8 w-8 text-green-500 mx-auto" />
      </button>
    </div>
  );
};

export default ActionButtons;
