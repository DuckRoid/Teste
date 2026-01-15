import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import Channel from '../models/Channel';
import Server from '../models/Server';

// Get messages by channel (with pagination)
export const getMessagesByChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Check if channel exists and user has access
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: 'Channel not found' });
      return;
    }

    const server = await Server.findById(channel.serverId);
    if (!server || !server.members.includes(req.userId as any)) {
      res.status(403).json({ message: 'You do not have access to this channel' });
      return;
    }

    const messages = await Message.find({ channelId })
      .populate('authorId', 'username avatar status')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ channelId });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create message (also handled via Socket.io)
export const createMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, channelId } = req.body;

    if (!content || !channelId) {
      res.status(400).json({ message: 'Content and channel ID are required' });
      return;
    }

    // Check if channel exists and user has access
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: 'Channel not found' });
      return;
    }

    const server = await Server.findById(channel.serverId);
    if (!server || !server.members.includes(req.userId as any)) {
      res.status(403).json({ message: 'You do not have access to this channel' });
      return;
    }

    const message = new Message({
      content,
      channelId,
      authorId: req.userId
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('authorId', 'username avatar status');

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update message
export const updateMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (message.authorId.toString() !== req.userId) {
      res.status(403).json({ message: 'You can only edit your own messages' });
      return;
    }

    message.content = content;
    message.edited = true;
    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('authorId', 'username avatar status');

    res.json({ message: populatedMessage });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete message
export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (message.authorId.toString() !== req.userId) {
      res.status(403).json({ message: 'You can only delete your own messages' });
      return;
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
