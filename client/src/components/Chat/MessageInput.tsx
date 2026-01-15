import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import socketService from '../../services/socket';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentChannel } = useChatStore();
  const { user } = useAuthStore();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    if (!currentChannel || !user) return;

    if (!isTypingRef.current) {
      socketService.startTyping(currentChannel._id, user.username);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(currentChannel._id);
      isTypingRef.current = false;
    }, 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentChannel) return;

    socketService.sendMessage(message, currentChannel._id);
    setMessage('');
    setShowEmojiPicker(false);

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTypingRef.current) {
      socketService.stopTyping(currentChannel._id);
      isTypingRef.current = false;
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  if (!currentChannel) {
    return null;
  }

  return (
    <div className="p-4 bg-bg-light border-t border-gray-700">
      <form onSubmit={handleSend} className="flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder={`Message #${currentChannel.name}`}
            className="w-full px-4 py-3 pr-12 bg-bg-dark border border-gray-600 rounded-xl focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
          >
            <Smile size={20} />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
