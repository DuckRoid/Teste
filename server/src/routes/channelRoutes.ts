import express from 'express';
import { createChannel, getChannelsByServer, getChannelById, deleteChannel } from '../controllers/channelController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.post('/', createChannel);
router.get('/server/:serverId', getChannelsByServer);
router.get('/:channelId', getChannelById);
router.delete('/:channelId', deleteChannel);

export default router;
