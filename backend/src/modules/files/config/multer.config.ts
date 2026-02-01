import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// File filter for images and PDFs
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Check file extension
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
    return callback(
      new BadRequestException(
        'Only image files (JPG, JPEG, PNG, GIF) and PDF are allowed!',
      ),
      false,
    );
  }

  // Check MIME type
  const validMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ];

  if (!validMimeTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        'Invalid file type! Only images and PDF files are allowed.',
      ),
      false,
    );
  }

  callback(null, true);
};

// Storage configuration for uploaded files
export const fileStorage = diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback) => {
    // Get related_type from body to organize files by model
    // En multipart/form-data, body ya está parseado por multer
    const body = req.body as { related_type?: string };
    const relatedType: string = body?.related_type || 'general';
    const uploadPath = join(process.cwd(), 'public', 'uploads', relatedType);

    // Create directory if it doesn't exist
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    callback(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => {
    const extension = extname(file.originalname);
    const filename = `${uuidv4()}${extension}`;
    callback(null, filename);
  },
});

// File size limits
export const fileSizeLimit = {
  file: 5 * 1024 * 1024, // 5MB for images and PDFs
};
