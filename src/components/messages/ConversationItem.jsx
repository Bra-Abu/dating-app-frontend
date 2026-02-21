import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import { formatRelativeTime, truncateText } from '../../utils/formatters';

const ConversationItem = ({ conversation }) => {
  const navigate = useNavigate();
  const otherUser = conversation.user;
  const lastMessage = conversation.lastMessage; // plain string
  const unreadCount = conversation.unreadCount || 0;

  const mainPhoto = otherUser?.photoUrls?.[0];
  const photoUrl = mainPhoto ? getImageUrl(mainPhoto) : null;

  return (
    <div
      onClick={() => navigate(`/messages/${conversation.matchId}`)}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
    >
      {/* Photo */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={otherUser?.firstName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-xl font-semibold">
                {otherUser?.firstName?.[0] || '?'}
              </span>
            </div>
          )}
        </div>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">
            {otherUser?.firstName}, {otherUser?.age}
          </h3>
          {conversation.lastMessageAt && (
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatRelativeTime(conversation.lastMessageAt)}
            </span>
          )}
        </div>

        {lastMessage ? (
          <p
            className={`text-sm truncate ${
              unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
            }`}
          >
            {truncateText(lastMessage, 50)}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">No messages yet</p>
        )}
      </div>

      {/* Unread indicator */}
      {unreadCount > 0 && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-primary-600 rounded-full" />
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
