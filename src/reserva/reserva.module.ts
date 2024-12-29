import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { User } from '../user/entities/user.entity';
import { Frecuencia } from '../frecuencias/entities/frecuencia.entity';
import { Asiento } from '../asientos/entities/asiento.entity';
import { Ruta } from '../rutas/entities/ruta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, User, Frecuencia, Asiento, Ruta])
  ],
  controllers: [ReservaController],
  providers: [ReservaService]
})
export class ReservaModule {}
