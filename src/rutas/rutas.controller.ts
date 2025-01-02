import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Rutas')
@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @ApiOperation({ summary: 'Crear una nueva ruta' })
  @ApiResponse({ 
    status: 201, 
    description: 'Ruta creada exitosamente',
    type: CreateRutaDto
  })
  @Post()
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }

  @ApiOperation({ summary: 'Obtener todas las rutas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de rutas',
    type: [CreateRutaDto]
  })
  @Get()
  findAll() {
    return this.rutasService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una ruta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la ruta' })
  @ApiResponse({ 
    status: 200, 
    description: 'Ruta encontrada',
    type: CreateRutaDto
  })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rutasService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener rutas por frecuencia' })
  @ApiParam({ name: 'id', description: 'ID de la frecuencia' })
  @ApiResponse({ 
    status: 200, 
    description: 'Rutas encontradas para la frecuencia especificada',
    type: [CreateRutaDto]
  })
  @Get('frecuencia/:id')
  findByFrecuencia(@Param('id') id: number) {
    return this.rutasService.findByFrecuencia(id);
  }

  @ApiOperation({ summary: 'Obtener rutas por parada' })
  @ApiParam({ name: 'id', description: 'ID de la parada' })
  @ApiResponse({ 
    status: 200, 
    description: 'Rutas que incluyen la parada especificada',
    type: [CreateRutaDto]
  })
  @Get('parada/:id')
  findByParada(@Param('id') id: number) {
    return this.rutasService.findByParada(id);
  }

  @ApiOperation({ summary: 'Actualizar una ruta' })
  @ApiParam({ name: 'id', description: 'ID de la ruta a actualizar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Ruta actualizada exitosamente',
    type: UpdateRutaDto
  })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada' })
  @Put(':id')
  update(@Param('id') id: number, @Body() updateRutaDto: UpdateRutaDto) {
    return this.rutasService.update(id, updateRutaDto);
  }

  @ApiOperation({ summary: 'Eliminar una ruta' })
  @ApiParam({ name: 'id', description: 'ID de la ruta a eliminar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Ruta eliminada exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rutasService.remove(id);
  }
}
