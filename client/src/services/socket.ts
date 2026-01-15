import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChannel(channelId: string): void {
    this.socket?.emit('channel:join', channelId);
  }

  leaveChannel(channelId: string): void {
    this.socket?.emit('channel:leave', channelId);
  }

  sendMessage(content: string, channelId: string): void {
    this.socket?.emit('message:send', { content, channelId });
  }

  onMessageReceive(callback: (message: any) => void): void {
    this.socket?.on('message:receive', callback);
  }

  offMessageReceive(): void {
    this.socket?.off('message:receive');
  }

  startTyping(channelId: string, username: string): void {
    this.socket?.emit('typing:start', { channelId, username });
  }

  stopTyping(channelId: string): void {
    this.socket?.emit('typing:stop', { channelId });
  }

  onTypingStart(callback: (data: any) => void): void {
    this.socket?.on('typing:start', callback);
  }

  onTypingStop(callback: (data: any) => void): void {
    this.socket?.on('typing:stop', callback);
  }

  onUserOnline(callback: (data: any) => void): void {
    this.socket?.on('user:online', callback);
  }

  onUserOffline(callback: (data: any) => void): void {
    this.socket?.on('user:offline', callback);
  }

  // WebRTC signaling
  sendCallOffer(to: string, offer: any, callType: 'voice' | 'video'): void {
    this.socket?.emit('call:offer', { to, offer, callType });
  }

  sendCallAnswer(to: string, answer: any): void {
    this.socket?.emit('call:answer', { to, answer });
  }

  sendIceCandidate(to: string, candidate: any): void {
    this.socket?.emit('call:ice-candidate', { to, candidate });
  }

  endCall(to: string): void {
    this.socket?.emit('call:end', { to });
  }

  onCallOffer(callback: (data: any) => void): void {
    this.socket?.on('call:offer', callback);
  }

  onCallAnswer(callback: (data: any) => void): void {
    this.socket?.on('call:answer', callback);
  }

  onIceCandidate(callback: (data: any) => void): void {
    this.socket?.on('call:ice-candidate', callback);
  }

  onCallEnd(callback: (data: any) => void): void {
    this.socket?.on('call:end', callback);
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export default new SocketService();
