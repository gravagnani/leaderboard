import express from 'express';

import { createLeaderboard } from '../controllers/leaderboardController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

router.post('/leaderboard/create', verifyAuth, createLeaderboard);

export default router;