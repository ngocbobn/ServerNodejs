import express from 'express';
import { authenticate, authError } from '../middleware';
const router = express.Router(); // eslint-disable-line new-cap

// router.get('/getUserByUsername', [authenticate, authError], userCtrl.getUserByUsername);

export default router;