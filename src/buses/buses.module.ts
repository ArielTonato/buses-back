import { Module } from '@nestjs/common';
import { BusesService } from './buses.service';
import { BusesController } from './buses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { BusesFotosModule } from '../buses-fotos/buses-fotos.module';
import { BusesFoto } from '../buses-fotos/entities/buses-foto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bus, BusesFoto]),
    BusesFotosModule
  ],
  controllers: [BusesController],
  providers: [BusesService]
})
export class BusesModule {}
