import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { Factura } from './entities/factura.entity';

@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Get()
  findAll(): Promise<Factura[]> {
    return this.facturaService.findAll();
  }

  @Get('usuario/:id')
  findByUser(@Param('id', ParseIntPipe) usuarioId: number): Promise<Factura[]> {
    return this.facturaService.findByUser(usuarioId);
  }
}
