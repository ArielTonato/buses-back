import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { Factura } from './entities/factura.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Facturas')
@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @ApiOperation({ summary: 'Obtener todas las facturas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de todas las facturas',
    type: [Factura]
  })
  @Get()
  findAll(): Promise<Factura[]> {
    return this.facturaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener facturas por usuario' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de facturas del usuario',
    type: [Factura]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado'
  })
  @Get('usuario/:id')
  findByUser(@Param('id', ParseIntPipe) usuarioId: number): Promise<Factura[]> {
    return this.facturaService.findByUser(usuarioId);
  }
}
