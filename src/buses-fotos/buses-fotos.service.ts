import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BusesFotosService {

  constructor(
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async uploadImages(files: Array<Express.Multer.File>) {
    const uploadPromises = files.map(file => this.cloudinaryService.upload(file));
    const results = await Promise.all(uploadPromises);
    return results;
  }

}
