import { Injectable } from '@nestjs/common';
import {v2 as cloudinary} from 'cloudinary';

import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
    upload(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            streamifier.createReadStream(file.buffer).pipe(upload);
        });
    }

    uploadBuffer(buffer: Buffer, folder: string): Promise<CloudinaryResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                { folder: folder },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            streamifier.createReadStream(buffer).pipe(upload);
        });
    }
}
