import { Request } from 'express';
import { getEnv } from '../../config';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

export type UploadType = 'image' | 'csv';

export const FileManager = {
  getStorage: (type: UploadType) => {
    if (getEnv().NODE_ENV === 'development') {
      return FileManager.createS3Storage(type);
    } else {
      return FileManager.createLocalStorage();
    }
  },

  createLocalStorage: () => {
    const localStorage = multer.diskStorage({
      destination: (req: Request, file, cb) => {
        cb(null, 'uploads/csv/');
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${path.basename(file.originalname, ext)}.${Date.now()}${ext}`;
        cb(null, filename);
      },
    });
    return localStorage;
  },

  createS3Storage: (type: UploadType) => {
    const s3Client = new S3Client({
      region: getEnv().AWS_REGION,
      credentials: {
        accessKeyId: getEnv().AWS_ACCESS_KEY_ID,
        secretAccessKey: getEnv().AWS_SECRET_ACCESS_KEY,
      },
    });
    return multerS3({
      s3: s3Client,
      bucket: getEnv().AWS_S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: type === 'image' ? 'public-read' : 'private',
      key: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        const filename = `${path.basename(file.originalname, ext)}.${Date.now()}${ext}`;
        const dir = type === 'image' ? 'profile-image' : 'CSV-from';
        callback(null, `${dir}/${filename}`);
      },
    });
  },
};

export const createFileManager = () => {};

export interface IFileManager {}
