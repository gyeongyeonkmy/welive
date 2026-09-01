import multer from 'multer';
import { BusinessException } from '../shared/exception/business-exception/business-exception';
import { BusinessExceptionType } from '../shared/exception/business-exception/exception-info';
import { UploadType } from '../shared/utils/file-manager';
import { NextFunction, Request, Response } from 'express';
import { IFileManager } from '../shared/interface/i-file-manager';
import { isVercelRuntime } from '../shared/utils/runtime';

export const createMulterMiddleware = (fileManager: IFileManager) => {
  const ensureAvailable = (req: Request, res: Response, next: NextFunction) => {
    if (isVercelRuntime()) {
      res.status(501).json({
        message:
          'File upload features are disabled in the Vercel demo deployment. Run the app locally for the full file workflow.',
      });
      return;
    }

    next();
  };

  const createUploader = (type: UploadType) =>
    multer({
      storage: fileManager.getStorage(type),
      limits: {
        fileSize: 10 * 1024 * 1024, // 최대 10메가까지
      },
      fileFilter: (req, file, cb) => {
        if (type === 'image') {
          if (!file.mimetype.startsWith('image/')) {
            return cb(
              BusinessException({
                type: BusinessExceptionType.NOT_IMAGE_FILE,
              }),
            );
          }
        }
        if (type === 'csv') {
          const allowed = ['text/csv', 'application/csv', 'application/vnd.ms-excel'];

          if (!allowed.includes(file.mimetype)) {
            return cb(
              BusinessException({
                type: BusinessExceptionType.NOT_CSV_FILE,
              }),
            );
          }
        }
        cb(null, true);
      },
    });

  const mapS3Path = (req: Request, res: Response, next: NextFunction) => {
    if (req.file && req.file.key) {
      req.file.path = req.file.key; // or req.file.location if you want the URL
    }
    next();
  };

  return {
    ensureAvailable,
    image: createUploader('image').single('avatarImage'),
    csv: createUploader('csv').single('file'),
    mapS3Path,
  };
};

export type MulterMiddleware = ReturnType<typeof createMulterMiddleware>;
