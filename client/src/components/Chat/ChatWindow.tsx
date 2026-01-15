import React from 'react';
import { Hash } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow: React.FC = () => {
  const { currentChannel } = useChatStore();

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-dark">
        <div className="text-center">
          <Hash size={64} className="mx-auto text-text-secondary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Welcome to ChatApp</h2>
          <p className="text-text-secondary">
            Select a channel from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-dark">
      {/* Channel Header */}
      <div className="h-16 border-b border-gray-700 flex items-center px-6">
        <Hash size={24} className="text-text-secondary mr-2" />
        <h2 className="text-xl font-semibold">{currentChannel.name}</h2>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
