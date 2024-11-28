import { Injectable } from '@nestjs/common';
import { CreateBusesFotoDto } from './dto/create-buses-foto.dto';
import { UpdateBusesFotoDto } from './dto/update-buses-foto.dto';
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

  findAll() {
    return `This action returns all busesFotos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} busesFoto`;
  }

  update(id: number, updateBusesFotoDto: UpdateBusesFotoDto) {
    return `This action updates a #${id} busesFoto`;
  }

  remove(id: number) {
    return `This action removes a #${id} busesFoto`;
  }
}
