import { Module } from '@nestjs/common';
import { ComprobantesPagosService } from './comprobantes_pagos.service';
import { ComprobantesPagosController } from './comprobantes_pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobantePago } from './entities/comprobantes_pago.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { User } from '../user/entities/user.entity';
import { Boleto } from '../boletos/entities/boleto.entity';
import { MailModule } from '../mail/mail.module';
import { Reserva } from '../reserva/entities/reserva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComprobantePago, User, Boleto, Reserva]),
    CloudinaryModule,
    MailModule
  ],
  controllers: [ComprobantesPagosController],
  providers: [ComprobantesPagosService]
})
export class ComprobantesPagosModule {}
