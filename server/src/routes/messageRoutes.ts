import express from 'express';
import { getMessagesByChannel, createMessage, updateMessage, deleteMessage } from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.get('/channel/:channelId', getMessagesByChannel);
router.post('/', createMessage);
router.patch('/:messageId', updateMessage);
router.delete('/:messageId', deleteMessage);

export default router;
