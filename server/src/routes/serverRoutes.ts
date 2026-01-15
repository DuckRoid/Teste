import express from 'express';
import { createServer, getUserServers, getServerById, joinServer, leaveServer } from '../controllers/serverController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.post('/', createServer);
router.get('/', getUserServers);
router.get('/:serverId', getServerById);
router.post('/:serverId/join', joinServer);
router.post('/:serverId/leave', leaveServer);

export default router;
