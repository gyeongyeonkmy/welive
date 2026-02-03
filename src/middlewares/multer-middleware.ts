import multer from 'multer';
import { BusinessException } from '../shared/exception/business-exception/business-exception';
import { BusinessExceptionType } from '../shared/exception/business-exception/exception-info';
import { FileManager, UploadType } from '../shared/utils/file-manager';
import { NextFunction, Request, Response } from 'express';

export const createMulterMiddleware = () => {
  const createUploader = (type: UploadType) =>
    multer({
      storage: FileManager.getStorage(type),
      limits: {
        fileSize: 10 * 1024 * 1024, // 최대 10메가까지
      },
      fileFilter: (req, file, cb) => {
        if (type === 'avatarImage') {
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
    image: createUploader('image').single('image'),
    csv: createUploader('csv').single('csv'),
    mapS3Path,
  };
};

export type MulterMiddleware = ReturnType<typeof createMulterMiddleware>;
