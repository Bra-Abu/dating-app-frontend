const Skeleton = ({ className = '', variant = 'rect', width, height }) => {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = {
    rect: 'rounded',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton patterns
export const ProfileCardSkeleton = () => (
  <div className="card">
    <Skeleton variant="rect" className="w-full aspect-square mb-4" />
    <Skeleton variant="text" className="w-3/4 mb-2" />
    <Skeleton variant="text" className="w-1/2 mb-2" />
    <Skeleton variant="text" className="w-full mb-2" />
    <div className="flex gap-2 mt-4">
      <Skeleton variant="rect" className="flex-1 h-10" />
      <Skeleton variant="rect" className="flex-1 h-10" />
    </div>
  </div>
);

export const ConversationItemSkeleton = () => (
  <div className="flex items-center gap-3 p-4 border-b border-gray-200">
    <Skeleton variant="circle" width={48} height={48} />
    <div className="flex-1">
      <Skeleton variant="text" className="w-1/3 mb-2" />
      <Skeleton variant="text" className="w-3/4" />
    </div>
    <Skeleton variant="text" className="w-16" />
  </div>
);

export const UserCardSkeleton = () => (
  <div className="card">
    <div className="flex items-center gap-4">
      <Skeleton variant="circle" width={64} height={64} />
      <div className="flex-1">
        <Skeleton variant="text" className="w-1/2 mb-2" />
        <Skeleton variant="text" className="w-3/4 mb-2" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rect" width={80} height={36} />
        <Skeleton variant="rect" width={80} height={36} />
      </div>
    </div>
  </div>
);

export default Skeleton;
