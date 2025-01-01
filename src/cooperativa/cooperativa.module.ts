import { Module } from '@nestjs/common';
import { CooperativaService } from './cooperativa.service';
import { CooperativaController } from './cooperativa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cooperativa } from './entities/cooperativa.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cooperativa]),
    CloudinaryModule
  ],
  controllers: [CooperativaController],
  providers: [CooperativaService],
})
export class CooperativaModule {}
