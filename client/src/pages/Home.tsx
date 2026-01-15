import React, { useEffect } from 'react';
import ServerList from '../components/Sidebar/ServerList';
import ChannelList from '../components/Sidebar/ChannelList';
import ChatWindow from '../components/Chat/ChatWindow';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import socketService from '../services/socket';
import api from '../services/api';

const Home: React.FC = () => {
  const { currentChannel, setMessages, addMessage, addTypingUser, removeTypingUser } =
    useChatStore();
  const { token, user } = useAuthStore();

  useEffect(() => {
    // Connect to socket
    if (token) {
      socketService.connect(token);
    }

    // Listen for messages
    socketService.onMessageReceive((message) => {
      addMessage(message);
    });

    // Listen for typing events
    socketService.onTypingStart((data) => {
      if (data.userId !== user?.id) {
        addTypingUser(data.channelId, data.username);
      }
    });

    socketService.onTypingStop((data) => {
      removeTypingUser(data.channelId, data.userId);
    });

    return () => {
      socketService.offMessageReceive();
    };
  }, [token]);

  useEffect(() => {
    if (currentChannel) {
      // Join channel
      socketService.joinChannel(currentChannel._id);

      // Fetch messages
      fetchMessages();

      return () => {
        // Leave channel when switching
        socketService.leaveChannel(currentChannel._id);
      };
    }
  }, [currentChannel]);

  const fetchMessages = async () => {
    if (!currentChannel) return;

    try {
      const response = await api.get(`/messages/channel/${currentChannel._id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <ServerList />
      <ChannelList />
      <ChatWindow />
    </div>
  );
};

export default Home;
