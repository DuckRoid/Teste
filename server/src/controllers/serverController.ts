import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import Server from '../models/Server';
import Channel from '../models/Channel';

// Create server
export const createServer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, icon } = req.body;
    const ownerId = req.userId;

    if (!name) {
      res.status(400).json({ message: 'Server name is required' });
      return;
    }

    const server = new Server({
      name,
      icon: icon || undefined,
      ownerId,
      members: [ownerId]
    });

    await server.save();

    // Create default general channel
    const generalChannel = new Channel({
      name: 'general',
      serverId: server._id,
      type: 'text'
    });
    await generalChannel.save();

    server.channels.push(generalChannel._id);
    await server.save();

    const populatedServer = await Server.findById(server._id)
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar status')
      .populate('channels');

    res.status(201).json({ server: populatedServer });
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's servers
export const getUserServers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const servers = await Server.find({ members: req.userId })
      .populate('ownerId', 'username avatar')
      .populate('channels')
      .sort({ createdAt: -1 });

    res.json({ servers });
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get server by ID
export const getServerById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId)
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar status')
      .populate('channels');

    if (!server) {
      res.status(404).json({ message: 'Server not found' });
      return;
    }

    // Check if user is a member
    if (!server.members.some(member => member._id.toString() === req.userId)) {
      res.status(403).json({ message: 'You are not a member of this server' });
      return;
    }

    res.json({ server });
  } catch (error) {
    console.error('Get server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Join server (simplified - in production, use invite links)
export const joinServer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId);
    if (!server) {
      res.status(404).json({ message: 'Server not found' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    
    if (server.members.some(memberId => memberId.equals(userObjectId))) {
      res.status(400).json({ message: 'Already a member of this server' });
      return;
    }

    server.members.push(userObjectId);
    await server.save();

    const populatedServer = await Server.findById(serverId)
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar status')
      .populate('channels');

    res.json({ server: populatedServer });
  } catch (error) {
    console.error('Join server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Leave server
export const leaveServer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId);
    if (!server) {
      res.status(404).json({ message: 'Server not found' });
      return;
    }

    if (server.ownerId.toString() === req.userId) {
      res.status(400).json({ message: 'Owner cannot leave the server. Transfer ownership or delete the server.' });
      return;
    }

    server.members = server.members.filter(memberId => memberId.toString() !== req.userId);
    await server.save();

    res.json({ message: 'Left server successfully' });
  } catch (error) {
    console.error('Leave server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
