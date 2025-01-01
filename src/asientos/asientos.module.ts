import { Module } from '@nestjs/common';
import { AsientosService } from './asientos.service';
import { AsientosController } from './asientos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './entities/asiento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asiento])
  ],
  controllers: [AsientosController],
  providers: [AsientosService],
})
export class AsientosModule {}
