import { SparklesIcon } from '@heroicons/react/24/solid';

const CompatibilityScore = ({ score, size = 'md', showLabel = true }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${getScoreColor(
        score
      )} ${sizeClasses[size]}`}
    >
      <SparklesIcon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      <span>{Math.round(score)}%</span>
      {showLabel && size !== 'sm' && (
        <span className="font-normal">Match</span>
      )}
    </div>
  );
};

export default CompatibilityScore;
