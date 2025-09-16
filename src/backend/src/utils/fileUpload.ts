import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: any, cb: FileFilterCallback) => {
  // Check file type
  const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedExtensions = ['.pdf', '.txt', '.docx'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const isValidType = allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension);
  
  if (isValidType) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only one file at a time
  },
});

// File validation utility
export const validateUploadedFile = (file: any | undefined): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file uploaded' };
  }

  // Check file size
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }

  // Check if file has content
  if (file.size === 0) {
    return { isValid: false, error: 'File is empty' };
  }

  return { isValid: true };
};

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

// Determine file type from extension and mimetype
export const getFileType = (file: any): 'pdf' | 'text' | 'docx' | 'unknown' => {
  const extension = getFileExtension(file.originalname);
  const mimetype = file.mimetype.toLowerCase();

  if (extension === '.pdf' || mimetype === 'application/pdf') {
    return 'pdf';
  }
  
  if (extension === '.txt' || mimetype === 'text/plain') {
    return 'text';
  }
  
  if (extension === '.docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'docx';
  }

  return 'unknown';
};
