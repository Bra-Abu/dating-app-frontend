import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { getImageUrl } from '../../utils/imageUtils';
import { SparklesIcon } from '@heroicons/react/24/solid';

const MatchModal = ({ isOpen, onClose, match }) => {
  const navigate = useNavigate();

  if (!match) return null;

  const userPhoto = match.userPhoto ? getImageUrl(match.userPhoto) : null;
  const matchPhoto = match.matchPhoto ? getImageUrl(match.matchPhoto) : null;

  const handleSendMessage = () => {
    onClose();
    navigate(`/messages/${match.matchId}`);
  };

  const handleKeepSwiping = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg" showCloseButton={false}>
      <div className="text-center py-6">
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full">
            <SparklesIcon className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          It's a Match!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8"
        >
          You and {match.matchName} liked each other
        </motion.p>

        {/* Photos */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center gap-6 mb-8"
        >
          {/* User Photo */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500 shadow-lg">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="You"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          </div>

          {/* Heart Icon */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </motion.div>

          {/* Match Photo */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500 shadow-lg">
              {matchPhoto ? (
                <img
                  src={matchPhoto}
                  alt={match.matchName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button onClick={handleSendMessage} fullWidth>
            Send Message
          </Button>
          <Button onClick={handleKeepSwiping} variant="secondary" fullWidth>
            Keep Swiping
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default MatchModal;
