import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './file.response';
const streamifier = require('streamifier');

@Injectable()
export class FileService {
  uploadToCloudinary(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultipleToCloudinary(files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.uploadToCloudinary(file)));
  }
}
