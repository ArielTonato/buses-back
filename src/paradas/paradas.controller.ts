import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Paradas')
@Controller('paradas')
export class ParadasController {
  constructor(private readonly paradasService: ParadasService) {}

  @ApiOperation({ summary: 'Crear una nueva parada' })
  @ApiResponse({ 
    status: 201, 
    description: 'Parada creada exitosamente',
    type: CreateParadaDto
  })
  @Post()
  create(@Body() createParadaDto: CreateParadaDto) {
    return this.paradasService.create(createParadaDto);
  }

  @ApiOperation({ summary: 'Obtener todas las paradas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de paradas',
    type: [CreateParadaDto]
  })
  @Get()
  findAll() {
    return this.paradasService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una parada por ID' })
  @ApiParam({ name: 'id', description: 'ID de la parada' })
  @ApiResponse({ 
    status: 200, 
    description: 'Parada encontrada',
    type: CreateParadaDto
  })
  @ApiResponse({ status: 404, description: 'Parada no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.paradasService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar paradas por ciudad (coincidencia exacta)' })
  @ApiParam({ name: 'ciudad', description: 'Nombre de la ciudad' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paradas encontradas',
    type: [CreateParadaDto]
  })
  @Get('ciudad/:ciudad')
  findByCiudad(@Param('ciudad') ciudad: string) {
    return this.paradasService.findByCiudad(ciudad);
  }

  @ApiOperation({ summary: 'Buscar paradas por ciudad (coincidencia parcial)' })
  @ApiParam({ name: 'ciudad', description: 'Nombre parcial o completo de la ciudad' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paradas encontradas',
    type: [CreateParadaDto]
  })
  @Get('buscar/:ciudad')
  findByLikeCiudad(@Param('ciudad') ciudad: string) {
    return this.paradasService.findByLikeCiudad(ciudad);
  }

  @ApiOperation({ summary: 'Actualizar una parada' })
  @ApiParam({ name: 'id', description: 'ID de la parada a actualizar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Parada actualizada exitosamente',
    type: UpdateParadaDto
  })
  @ApiResponse({ status: 404, description: 'Parada no encontrada' })
  @Put(':id')
  update(@Param('id') id: number, @Body() updateParadaDto: UpdateParadaDto) {
    return this.paradasService.update(id, updateParadaDto);
  }

  @ApiOperation({ summary: 'Eliminar una parada' })
  @ApiParam({ name: 'id', description: 'ID de la parada a eliminar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Parada eliminada exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Parada no encontrada' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.paradasService.remove(id);
  }
}
