import { Module } from '@nestjs/common';
import { ComprobantesPagosService } from './comprobantes_pagos.service';
import { ComprobantesPagosController } from './comprobantes_pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobantePago } from './entities/comprobantes_pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComprobantePago]),
  ],
  controllers: [ComprobantesPagosController],
  providers: [ComprobantesPagosService],
})
export class ComprobantesPagosModule {}
