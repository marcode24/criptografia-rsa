import Router from 'express';
import {
  emptyFileErrorHandler,
  extensionErrorHandler,
  fileSizeLimitErrorHandler,
  uploadConfig,
} from '../middlewares/multer.js';
import { encrypt } from '../controllers/rsa.js';

const router = Router();

router.post('/encrypt', [
  uploadConfig,
  extensionErrorHandler,
  fileSizeLimitErrorHandler,
  emptyFileErrorHandler,
], encrypt);

export default router;
