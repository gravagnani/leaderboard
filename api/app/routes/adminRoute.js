import express from 'express';

import { createAdmin, updateUserToAdmin } from '../controllers/adminController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

router.post('/admin/signup', verifyAuth, createAdmin);
router.post('/user/:id/admin', verifyAuth, updateUserToAdmin);

export default router;