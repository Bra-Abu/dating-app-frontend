import { formatTime } from '../../utils/formatters';
import { CheckIcon } from '@heroicons/react/24/outline';

const MessageBubble = ({ message, isOwn }) => {
  const isGuardianAlert = message.type === 'guardian_alert';

  if (isGuardianAlert) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 max-w-md">
          <p className="text-sm text-blue-800 text-center">
            ℹ️ {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwn
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-gray-200 text-gray-900 rounded-tl-sm'
        }`}
      >
        <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
        <div
          className={`flex items-center gap-1 mt-1 text-xs ${
            isOwn ? 'text-white/70 justify-end' : 'text-gray-500'
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && (
            <span className="ml-1">
              {message.isRead ? (
                <span className="flex">
                  <CheckIcon className="h-3 w-3 -mr-1" />
                  <CheckIcon className="h-3 w-3" />
                </span>
              ) : (
                <CheckIcon className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
