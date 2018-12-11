import express from 'express';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();
router.route('/loginRequest')
  .post(authCtrl.loginRequest);

export default router;