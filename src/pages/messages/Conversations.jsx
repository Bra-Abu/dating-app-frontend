import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConversationItem from '../../components/messages/ConversationItem';
import { ChatBubbleLeftRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Conversations = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations with polling
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/messages/conversations');
      return response.data.data;
    },
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const conversations = data || [];

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const otherUser = conv.user;
    const fullName = `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Sort by last message time (most recent first)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const timeA = a.lastMessageAt || a.matchedAt;
    const timeB = b.lastMessageAt || b.matchedAt;
    return new Date(timeB) - new Date(timeA);
  });

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>

          {/* Search */}
          {conversations.length > 0 && (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          )}
        </div>

        {/* Conversations List */}
        {sortedConversations.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {sortedConversations.map((conversation) => (
              <ConversationItem key={conversation.matchId} conversation={conversation} />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20">
            <ChatBubbleLeftRightIcon className="mx-auto h-24 w-24 text-gray-300 stroke-1" />
            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              No Conversations Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start matching to begin conversations!
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600">No conversations match your search</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Conversations;
