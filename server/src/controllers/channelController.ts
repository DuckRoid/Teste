import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Channel from '../models/Channel';
import Server from '../models/Server';

// Create channel
export const createChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, serverId, type } = req.body;

    if (!name || !serverId) {
      res.status(400).json({ message: 'Channel name and server ID are required' });
      return;
    }

    // Check if user is a member of the server
    const server = await Server.findById(serverId);
    if (!server) {
      res.status(404).json({ message: 'Server not found' });
      return;
    }

    if (!server.members.includes(req.userId as any)) {
      res.status(403).json({ message: 'You are not a member of this server' });
      return;
    }

    const channel = new Channel({
      name,
      serverId,
      type: type || 'text'
    });

    await channel.save();

    server.channels.push(channel._id);
    await server.save();

    res.status(201).json({ channel });
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get channels by server
export const getChannelsByServer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serverId } = req.params;

    // Check if user is a member of the server
    const server = await Server.findById(serverId);
    if (!server) {
      res.status(404).json({ message: 'Server not found' });
      return;
    }

    if (!server.members.includes(req.userId as any)) {
      res.status(403).json({ message: 'You are not a member of this server' });
      return;
    }

    const channels = await Channel.find({ serverId }).sort({ createdAt: 1 });

    res.json({ channels });
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get channel by ID
export const getChannelById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: 'Channel not found' });
      return;
    }

    // Check if user is a member of the server
    const server = await Server.findById(channel.serverId);
    if (!server || !server.members.includes(req.userId as any)) {
      res.status(403).json({ message: 'You do not have access to this channel' });
      return;
    }

    res.json({ channel });
  } catch (error) {
    console.error('Get channel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete channel
export const deleteChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: 'Channel not found' });
      return;
    }

    // Check if user is the server owner
    const server = await Server.findById(channel.serverId);
    if (!server) {
      res.status(404).json({ message: 'Server not found' });
      return;
    }

    if (server.ownerId.toString() !== req.userId) {
      res.status(403).json({ message: 'Only server owner can delete channels' });
      return;
    }

    await Channel.findByIdAndDelete(channelId);

    // Remove channel from server
    server.channels = server.channels.filter(id => id.toString() !== channelId);
    await server.save();

    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Delete channel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
