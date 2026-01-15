import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';

const MessageList: React.FC = () => {
  const { messages, typingUsers, currentChannel } = useChatStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const typingUsersInChannel = currentChannel
    ? typingUsers.get(currentChannel._id) || []
    : [];

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-secondary text-lg">Select a channel to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.authorId._id === user?.id;
        const showAvatar =
          index === 0 || messages[index - 1].authorId._id !== message.authorId._id;

        return (
          <div
            key={message._id}
            className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} ${
              showAvatar ? 'mt-4' : 'mt-1'
            } animate-slide-up`}
          >
            {showAvatar && !isOwnMessage && (
              <img
                src={message.authorId.avatar}
                alt={message.authorId.username}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            {!showAvatar && !isOwnMessage && <div className="w-10 mr-3" />}

            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} flex-1`}>
              {showAvatar && (
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm">
                    {message.authorId.username}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-2xl max-w-lg break-words ${
                  isOwnMessage
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-bg-light text-white rounded-tl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.edited && (
                  <span className="text-xs text-text-secondary ml-2">(edited)</span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {typingUsersInChannel.length > 0 && (
        <div className="flex items-center space-x-2 text-text-secondary text-sm animate-fade-in">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-200"></div>
          </div>
          <span>
            {typingUsersInChannel.length === 1
              ? `${typingUsersInChannel[0]} is typing...`
              : `${typingUsersInChannel.length} people are typing...`}
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
