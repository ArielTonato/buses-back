import { Module } from '@nestjs/common';
import { FrecuenciasService } from './frecuencias.service';
import { FrecuenciasController } from './frecuencias.controller';
import { Frecuencia } from './entities/frecuencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Frecuencia]),
  ],
  controllers: [FrecuenciasController],
  providers: [FrecuenciasService],
})
export class FrecuenciasModule {}
