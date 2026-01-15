import { create } from 'zustand';

interface Server {
  _id: string;
  name: string;
  icon: string;
  ownerId: any;
  members: any[];
  channels: Channel[];
  createdAt: string;
}

interface Channel {
  _id: string;
  name: string;
  serverId: string;
  type: 'text' | 'voice';
  createdAt: string;
}

interface Message {
  _id: string;
  content: string;
  authorId: any;
  channelId: string;
  timestamp: string;
  edited: boolean;
}

interface ChatState {
  servers: Server[];
  currentServer: Server | null;
  currentChannel: Channel | null;
  messages: Message[];
  typingUsers: Map<string, string[]>;
  setServers: (servers: Server[]) => void;
  addServer: (server: Server) => void;
  setCurrentServer: (server: Server | null) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  addTypingUser: (channelId: string, username: string) => void;
  removeTypingUser: (channelId: string, userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  servers: [],
  currentServer: null,
  currentChannel: null,
  messages: [],
  typingUsers: new Map(),
  setServers: (servers) => set({ servers }),
  addServer: (server) => set((state) => ({ servers: [...state.servers, server] })),
  setCurrentServer: (server) => set({ currentServer: server }),
  setCurrentChannel: (channel) => set({ currentChannel: channel, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addTypingUser: (channelId, username) =>
    set((state) => {
      const newTypingUsers = new Map(state.typingUsers);
      const users = newTypingUsers.get(channelId) || [];
      if (!users.includes(username)) {
        newTypingUsers.set(channelId, [...users, username]);
      }
      return { typingUsers: newTypingUsers };
    }),
  removeTypingUser: (channelId, userId) =>
    set((state) => {
      const newTypingUsers = new Map(state.typingUsers);
      const users = newTypingUsers.get(channelId) || [];
      newTypingUsers.set(
        channelId,
        users.filter((u) => u !== userId)
      );
      return { typingUsers: newTypingUsers };
    }),
}));
