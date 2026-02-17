import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import ProfileCard from '../profile/ProfileCard';

const SwipeCard = ({ profile, onSwipe, onProfileClick }) => {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;

    if (Math.abs(info.offset.x) > swipeThreshold) {
      // Swiped
      setExitX(info.offset.x > 0 ? 200 : -200);
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    } else {
      // Snap back
      setExitX(0);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{
        x: { duration: 0.3 },
        rotate: { duration: 0.3 },
      }}
    >
      {/* Swipe Indicators */}
      <motion.div
        className="absolute top-10 left-10 z-10 transform -rotate-12"
        style={{
          opacity: useTransform(x, [0, 100], [0, 1]),
        }}
      >
        <div className="bg-green-500 text-white px-6 py-3 rounded-lg text-2xl font-bold border-4 border-green-500">
          LIKE
        </div>
      </motion.div>

      <motion.div
        className="absolute top-10 right-10 z-10 transform rotate-12"
        style={{
          opacity: useTransform(x, [-100, 0], [1, 0]),
        }}
      >
        <div className="bg-red-500 text-white px-6 py-3 rounded-lg text-2xl font-bold border-4 border-red-500">
          NOPE
        </div>
      </motion.div>

      {/* Profile Card */}
      <ProfileCard profile={profile} onClick={onProfileClick} />
    </motion.div>
  );
};

export default SwipeCard;
