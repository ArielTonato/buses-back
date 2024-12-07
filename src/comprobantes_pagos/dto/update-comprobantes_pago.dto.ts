import { PartialType } from '@nestjs/mapped-types';
import { CreateComprobantesPagoDto } from './create-comprobantes_pago.dto';

export class UpdateComprobantesPagoDto extends PartialType(CreateComprobantesPagoDto) {}
