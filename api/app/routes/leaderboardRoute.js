import express from 'express';

import { createLeaderboard } from '../controllers/leaderboardController';

const router = express.Router();

router.post('/leaderboard', createLeaderboard);

export default router;