import { Module } from '@nestjs/common';
import { ComprobantesPagosService } from './comprobantes_pagos.service';
import { ComprobantesPagosController } from './comprobantes_pagos.controller';

@Module({
  controllers: [ComprobantesPagosController],
  providers: [ComprobantesPagosService],
})
export class ComprobantesPagosModule {}
