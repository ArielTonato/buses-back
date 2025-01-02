import { Module } from '@nestjs/common';
import { BusesFotosService } from './buses-fotos.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusesFoto } from './entities/buses-foto.entity';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([BusesFoto])
  ],
  controllers: [],
  providers: [BusesFotosService],
  exports: [ TypeOrmModule, CloudinaryModule]
})
export class BusesFotosModule {}

