import { Injectable } from '@nestjs/common';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';

@Injectable()
export class ComprobantesPagosService {
  create(createComprobantesPagoDto: CreateComprobantesPagoDto) {
    return 'This action adds a new comprobantesPago';
  }

  findAll() {
    return `This action returns all comprobantesPagos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comprobantesPago`;
  }

  update(id: number, updateComprobantesPagoDto: UpdateComprobantesPagoDto) {
    return `This action updates a #${id} comprobantesPago`;
  }

  remove(id: number) {
    return `This action removes a #${id} comprobantesPago`;
  }
}
