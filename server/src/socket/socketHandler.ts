import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message';
import User from '../models/User';

interface AuthenticatedSocket extends SocketIOServer {
  userId?: string;
}

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (io: SocketIOServer): void => {
  // Authentication middleware
  io.use((socket: any, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: any) => {
    console.log(`✅ User connected: ${socket.userId}`);
    
    // Store online user
    onlineUsers.set(socket.userId, socket.id);
    
    // Update user status to online
    await User.findByIdAndUpdate(socket.userId, { status: 'online' });
    
    // Notify others that user is online
    socket.broadcast.emit('user:online', { userId: socket.userId });

    // Join user to their own room
    socket.join(socket.userId);

    // Join channel
    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel:${channelId}`);
      console.log(`User ${socket.userId} joined channel ${channelId}`);
    });

    // Leave channel
    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
      console.log(`User ${socket.userId} left channel ${channelId}`);
    });

    // Send message
    socket.on('message:send', async (data: { content: string; channelId: string }) => {
      try {
        const message = new Message({
          content: data.content,
          channelId: data.channelId,
          authorId: socket.userId
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
          .populate('authorId', 'username avatar status');

        // Emit to all users in the channel
        io.to(`channel:${data.channelId}`).emit('message:receive', populatedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing:start', (data: { channelId: string; username: string }) => {
      socket.to(`channel:${data.channelId}`).emit('typing:start', {
        userId: socket.userId,
        username: data.username,
        channelId: data.channelId
      });
    });

    socket.on('typing:stop', (data: { channelId: string }) => {
      socket.to(`channel:${data.channelId}`).emit('typing:stop', {
        userId: socket.userId,
        channelId: data.channelId
      });
    });

    // WebRTC signaling for voice/video calls
    socket.on('call:offer', (data: { to: string; offer: any; callType: 'voice' | 'video' }) => {
      const targetSocketId = onlineUsers.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('call:offer', {
          from: socket.userId,
          offer: data.offer,
          callType: data.callType
        });
      }
    });

    socket.on('call:answer', (data: { to: string; answer: any }) => {
      const targetSocketId = onlineUsers.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('call:answer', {
          from: socket.userId,
          answer: data.answer
        });
      }
    });

    socket.on('call:ice-candidate', (data: { to: string; candidate: any }) => {
      const targetSocketId = onlineUsers.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('call:ice-candidate', {
          from: socket.userId,
          candidate: data.candidate
        });
      }
    });

    socket.on('call:end', (data: { to: string }) => {
      const targetSocketId = onlineUsers.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('call:end', {
          from: socket.userId
        });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      
      // Remove from online users
      onlineUsers.delete(socket.userId);
      
      // Update user status to offline
      await User.findByIdAndUpdate(socket.userId, { status: 'offline' });
      
      // Notify others that user is offline
      socket.broadcast.emit('user:offline', { userId: socket.userId });
    });
  });
};
