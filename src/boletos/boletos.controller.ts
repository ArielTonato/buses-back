import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Boletos')
@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @ApiOperation({ summary: 'Crear un nuevo boleto' })
  @ApiResponse({ 
    status: 201, 
    description: 'Boleto creado exitosamente',
    type: CreateBoletoDto
  })
  @Post()
  create(@Body() createBoletoDto: CreateBoletoDto) {
    return this.boletosService.create(createBoletoDto);
  }

  @ApiOperation({ summary: 'Obtener todos los boletos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de todos los boletos',
    type: [CreateBoletoDto]
  })
  @Get()
  findAll() {
    return this.boletosService.findAll();
  }

  @ApiOperation({ summary: 'Obtener boletos por usuario' })
  @ApiParam({ 
    name: 'userId', 
    description: 'ID del usuario',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de boletos del usuario',
    type: [CreateBoletoDto]
  })
  @Get('usuario/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.boletosService.findAllByUserId(+userId);
  }

  @ApiOperation({ summary: 'Obtener un boleto por ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del boleto',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Boleto encontrado',
    type: CreateBoletoDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Boleto no encontrado'
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boletosService.findOne(+id);
  }

  @ApiOperation({ summary: 'Obtener boletos por reserva' })
  @ApiParam({ 
    name: 'reservaId', 
    description: 'ID de la reserva',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de boletos de la reserva',
    type: [CreateBoletoDto]
  })
  @Get('reserva/:reservaId')
  findByReservaId(@Param('reservaId') reservaId: string) {
    return this.boletosService.findByReservaId(+reservaId);
  }

  @ApiOperation({ summary: 'Actualizar un boleto' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del boleto a actualizar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Boleto actualizado exitosamente',
    type: UpdateBoletoDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Boleto no encontrado'
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoletoDto: UpdateBoletoDto) {
    return this.boletosService.update(+id, updateBoletoDto);
  }

  @ApiOperation({ summary: 'Eliminar un boleto' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del boleto a eliminar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Boleto eliminado exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Boleto no encontrado'
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletosService.remove(+id);
  }
}
