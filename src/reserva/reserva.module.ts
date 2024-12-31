import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { User } from '../user/entities/user.entity';
import { Frecuencia } from '../frecuencias/entities/frecuencia.entity';
import { Asiento } from '../asientos/entities/asiento.entity';
import { Ruta } from '../rutas/entities/ruta.entity';
import { Boleto } from '../boletos/entities/boleto.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MailModule } from '../mail/mail.module';
import { PdfGeneratorService } from '../utils/pdf-generator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, User, Frecuencia, Asiento, Ruta, Boleto]),
    CloudinaryModule,
    MailModule
  ],
  controllers: [ReservaController],
  providers: [
    ReservaService,
    PdfGeneratorService
  ]
})
export class ReservaModule {}
