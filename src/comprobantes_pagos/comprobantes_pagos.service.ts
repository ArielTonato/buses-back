import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';
import { ComprobantePago } from './entities/comprobantes_pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';

@Injectable()
export class ComprobantesPagosService {

  constructor(
    @InjectRepository(ComprobantePago)
    private comprobantePagoRepository: Repository<ComprobantePago>,
  ) {}

  create(createComprobantesPagoDto: CreateComprobantesPagoDto) {
    return this.comprobantePagoRepository.save(createComprobantesPagoDto);
  }

  async findAll() {
    const comprobantes = await this.comprobantePagoRepository.find();
    if (!comprobantes) {
      throw new NotFoundException('No se encontraron comprobantes de pago');
    }
    return comprobantes;
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
