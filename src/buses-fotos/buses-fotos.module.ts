import { Module } from '@nestjs/common';
import { BusesFotosService } from './buses-fotos.service';
import { BusesFotosController } from './buses-fotos.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [BusesFotosController],
  providers: [BusesFotosService],
})
export class BusesFotosModule {}
