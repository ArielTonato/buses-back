import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Reservas')
@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiResponse({ 
    status: 201, 
    description: 'Reserva creada exitosamente',
    type: CreateReservaDto
  })
  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.create(createReservaDto);
  }

  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de todas las reservas',
    type: [CreateReservaDto]
  })
  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la reserva',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Reserva encontrada',
    type: CreateReservaDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Reserva no encontrada'
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Obtener reservas por usuario' })
  @ApiParam({ 
    name: 'userId', 
    description: 'ID del usuario',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de reservas del usuario',
    type: [CreateReservaDto]
  })
  @Get('usuario/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.reservaService.findAllByUserId(+userId);
  }

  @ApiOperation({ summary: 'Actualizar una reserva' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la reserva a actualizar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Reserva actualizada exitosamente',
    type: UpdateReservaDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Reserva no encontrada'
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservaService.update(+id, updateReservaDto);
  }

  @ApiOperation({ summary: 'Eliminar una reserva' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la reserva a eliminar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Reserva eliminada exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Reserva no encontrada'
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservaService.remove(+id);
  }
}
