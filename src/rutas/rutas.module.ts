import { Module } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ruta } from './entities/ruta.entity';
import { ParadasModule } from '../paradas/paradas.module';
import { FrecuenciasModule } from '../frecuencias/frecuencias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ruta]),
    ParadasModule,
    FrecuenciasModule,
  ],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
