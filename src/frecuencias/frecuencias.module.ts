import { Module } from '@nestjs/common';
import { FrecuenciasService } from './frecuencias.service';
import { FrecuenciasController } from './frecuencias.controller';
import { Frecuencia } from './entities/frecuencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Bus } from '../buses/entities/bus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Frecuencia, User, Bus]),
  ],
  controllers: [FrecuenciasController],
  providers: [FrecuenciasService],
  exports: [FrecuenciasService], // Exportando el servicio
})
export class FrecuenciasModule {}
