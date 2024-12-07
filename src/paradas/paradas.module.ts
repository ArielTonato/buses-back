import { Module } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { ParadasController } from './paradas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parada } from './entities/parada.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parada]),
  ],
  controllers: [ParadasController],
  providers: [ParadasService],
  exports: [ParadasService], // Exportando el servicio
})
export class ParadasModule {}
