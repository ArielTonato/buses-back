import { Module } from '@nestjs/common';
import { FrecuenciasService } from './frecuencias.service';
import { FrecuenciasController } from './frecuencias.controller';

@Module({
  controllers: [FrecuenciasController],
  providers: [FrecuenciasService],
})
export class FrecuenciasModule {}
