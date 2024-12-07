import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ComprobantesPagosService } from './comprobantes_pagos.service';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';

@Controller('comprobantes-pagos')
export class ComprobantesPagosController {
  constructor(private readonly comprobantesPagosService: ComprobantesPagosService) {}

  @Post()
  create(@Body() createComprobantesPagoDto: CreateComprobantesPagoDto) {
    return this.comprobantesPagosService.create(createComprobantesPagoDto);
  }

  @Get()
  findAll() {
    return this.comprobantesPagosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprobantesPagosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateComprobantesPagoDto: UpdateComprobantesPagoDto) {
    return this.comprobantesPagosService.update(+id, updateComprobantesPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comprobantesPagosService.remove(+id);
  }
}
