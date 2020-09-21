import express from 'express';

import { createUser, siginUser } from '../controllers/userController';

const router = express.Router();

router.post('/auth/signup', createUser);
router.post('/auth/signup', siginUser);

export default router;