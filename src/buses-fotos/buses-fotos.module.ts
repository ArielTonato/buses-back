import { Module } from '@nestjs/common';
import { BusesFotosService } from './buses-fotos.service';
import { BusesFotosController } from './buses-fotos.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusesFoto } from './entities/buses-foto.entity';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([BusesFoto])
  ],
  controllers: [BusesFotosController],
  providers: [BusesFotosService],
  exports: [BusesFotosService, TypeOrmModule, CloudinaryModule]
})
export class BusesFotosModule {}
