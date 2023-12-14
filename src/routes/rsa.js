import Router from 'express';
import {
  emptyFileErrorHandler,
  extensionEncryptErrorHandler,
  extensionDecryptErrorHandler,
  fileSizeLimitErrorHandler,
  uploadConfig,
} from '../middlewares/multer.js';
import { decrypt, encrypt } from '../controllers/rsa.js';
import validateJWT from '../middlewares/jwt.js';

const router = Router();

router.post('/encrypt', [
  validateJWT,
  uploadConfig,
  extensionEncryptErrorHandler,
  fileSizeLimitErrorHandler,
  emptyFileErrorHandler,
], encrypt);

router.post('/decrypt', [
  validateJWT,
  uploadConfig,
  extensionDecryptErrorHandler,
  fileSizeLimitErrorHandler,
  emptyFileErrorHandler,
], decrypt);

export default router;
