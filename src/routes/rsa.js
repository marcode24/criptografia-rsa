import Router from 'express';
import {
  emptyFileErrorHandler,
  extensionEncryptErrorHandler,
  extensionDecryptErrorHandler,
  fileSizeLimitErrorHandler,
  uploadConfig,
} from '../middlewares/multer.js';
import { decrypt, encrypt } from '../controllers/rsa.js';

const router = Router();

router.post('/encrypt', [
  uploadConfig,
  extensionEncryptErrorHandler,
  fileSizeLimitErrorHandler,
  emptyFileErrorHandler,
], encrypt);

router.post('/decrypt', [
  uploadConfig,
  extensionDecryptErrorHandler,
  fileSizeLimitErrorHandler,
  emptyFileErrorHandler,
], decrypt);

export default router;
