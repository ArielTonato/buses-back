import { Inject, Injectable } from '@nestjs/common';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';
import { ComprobantePago } from './entities/comprobantes_pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ComprobantesPagosService {

  constructor(
    @InjectRepository(ComprobantePago)
    private comprobantePagoRepository: Repository<ComprobantePago>,
  ) {}

  create(createComprobantesPagoDto: CreateComprobantesPagoDto) {
    return this.comprobantePagoRepository.save(createComprobantesPagoDto);
  }

  findAll() {
    return this.comprobantePagoRepository.find();
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
