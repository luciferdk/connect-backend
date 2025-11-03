import express from 'express';
import { updateUser, contactName } from '../controller/update.controller';
import { verifyToken } from '../utils/session';
import { upload } from '../middleware/upload';

const router = express.Router();

router.put(
  '/updateMySelf',
  verifyToken,
  upload.single('profileImage'),
  updateUser,
);
router.put('/updateNickName', verifyToken, contactName);

export default router;
