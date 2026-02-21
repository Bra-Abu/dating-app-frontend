import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MessageBubble from '../../components/messages/MessageBubble';
import MessageInput from '../../components/messages/MessageInput';
import GuardianAlert from '../../components/messages/GuardianAlert';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { getImageUrl } from '../../utils/imageUtils';

const ChatThread = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [showGuardianAlert, setShowGuardianAlert] = useState(false);

  // Fetch match details from mutual matches list
  const { data: matchData } = useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const response = await api.get('/matches/mutual');
      const match = (response.data.data || []).find((m) => m.matchId === matchId);
      return match || null;
    },
  });

  // Fetch messages with polling
  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['messages', matchId],
    queryFn: async () => {
      const response = await api.get(`/messages/conversation/${matchId}`);
      return response.data;
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const messages = messagesData?.data || [];
  const otherUser = matchData?.user;

  // Show guardian alert if first message in conversation has guardian_alert type
  useEffect(() => {
    const hasGuardianAlert = messages.some((m) => m.messageType === 'guardian_alert');
    if (hasGuardianAlert && messages.length <= 2) {
      setShowGuardianAlert(true);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const response = await api.post('/messages/send', {
        receiverId: otherUser?.userId,
        message: content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', matchId]);
      queryClient.invalidateQueries(['conversations']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to send message');
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      await api.delete(`/messages/${messageId}`);
    },
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries(['messages', matchId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete message');
    },
  });

  // Block user mutation
  const blockMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/reports/blocks/block/${otherUser?.userId}`);
    },
    onSuccess: () => {
      toast.success('User blocked successfully');
      navigate('/messages');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to block user');
    },
  });

  // Report user
  const handleReport = () => {
    navigate(`/report/${otherUser?.userId}`, {
      state: { from: `/messages/${matchId}` },
    });
  };

  const handleSendMessage = (content) => {
    sendMessageMutation.mutate(content);
  };

  if (isLoading || !otherUser) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </UserLayout>
    );
  }

  const mainPhoto = otherUser?.photoUrls?.[0];
  const photoUrl = mainPhoto ? getImageUrl(mainPhoto) : null;

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/messages')}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={otherUser?.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-lg font-semibold">
                      {otherUser?.firstName?.[0] || '?'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {otherUser?.firstName}, {otherUser?.age}
                </h2>
                <p className="text-sm text-gray-600">
                  {otherUser?.city}
                </p>
              </div>
            </div>
          </div>

          {/* Options Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 hover:bg-gray-100 rounded-lg">
              <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleReport}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    <FlagIcon className="h-4 w-4" />
                    Report User
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => blockMutation.mutate()}
                    className={`w-full px-4 py-2 text-left text-sm text-red-600 flex items-center gap-2 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    <NoSymbolIcon className="h-4 w-4" />
                    Block User
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>

        {/* Guardian Alert */}
        {showGuardianAlert && (
          <div className="p-4">
            <GuardianAlert />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length > 0 ? (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.isMine}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No messages yet</p>
                <p className="text-sm text-gray-400">
                  Send a message to start the conversation!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <MessageInput
          onSend={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        />
      </div>
    </UserLayout>
  );
};

export default ChatThread;
