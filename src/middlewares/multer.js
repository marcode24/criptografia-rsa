import multer from 'multer';

const LIMIT_FILE_SIZE = 1024 * 1024 * 5; // 5MB

const uploadConfig = multer({
  limits: {
    fileSize: LIMIT_FILE_SIZE,
  },
}).single('file');

const ALLOWED_EXTENSIONS = ['txt'];

const fileSizeLimitErrorHandler = (err, _, res, next) => {
  err.code === 'LIMIT_FILE_SIZE'
    ? res.status(400).json({ message: 'File size limit exceeded' })
    : next();
};

const emptyFileErrorHandler = (req, res, next) => {
  req.file
    ? next()
    : res.status(400).json({ message: 'No file uploaded' });
};

const extensionErrorHandler = (req, res, next) => {
  const { originalname } = req.file;
  const extension = originalname.split('.').pop();
  return ALLOWED_EXTENSIONS.includes(extension)
    ? next()
    : res.status(400).json({ message: 'Invalid file extension' });
};

export {
  extensionErrorHandler,
  uploadConfig,
  fileSizeLimitErrorHandler,
  emptyFileErrorHandler,
};
