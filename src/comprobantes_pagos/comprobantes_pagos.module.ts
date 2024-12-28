import { Module } from '@nestjs/common';
import { ComprobantesPagosService } from './comprobantes_pagos.service';
import { ComprobantesPagosController } from './comprobantes_pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobantePago } from './entities/comprobantes_pago.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { User } from '../user/entities/user.entity';
import { Boleto } from '../boletos/entities/boleto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComprobantePago, User, Boleto]),
    CloudinaryModule,
  ],
  controllers: [ComprobantesPagosController],
  providers: [ComprobantesPagosService],
})
export class ComprobantesPagosModule {}
