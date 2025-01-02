import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FrecuenciasService } from './frecuencias.service';
import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Frecuencias')
@Controller('frecuencias')
export class FrecuenciasController {
  constructor(private readonly frecuenciasService: FrecuenciasService) {}

  @ApiOperation({ summary: 'Crear una nueva frecuencia' })
  @ApiResponse({ 
    status: 201, 
    description: 'Frecuencia creada exitosamente',
    type: CreateFrecuenciaDto
  })
  @Post()
  create(@Body() createFrecuenciaDto: CreateFrecuenciaDto) {
    return this.frecuenciasService.create(createFrecuenciaDto);
  }

  @ApiOperation({ summary: 'Obtener todas las frecuencias' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de frecuencias',
    type: [CreateFrecuenciaDto]
  })
  @Get()
  findAll() {
    return this.frecuenciasService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una frecuencia por ID' })
  @ApiParam({ name: 'id', description: 'ID de la frecuencia' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frecuencia encontrada',
    type: CreateFrecuenciaDto
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.frecuenciasService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener frecuencias por conductor' })
  @ApiParam({ name: 'id', description: 'ID del conductor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frecuencias encontradas',
    type: [CreateFrecuenciaDto]
  })
  @Get('conductor/:id')
  findByConductor(@Param('id') id: number) {
    return this.frecuenciasService.findByConductor(id);
  }

  @ApiOperation({ summary: 'Obtener frecuencias por bus' })
  @ApiParam({ name: 'id', description: 'ID del bus' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frecuencias encontradas',
    type: [CreateFrecuenciaDto]
  })
  @Get('bus/:id')
  findByBus(@Param('id') id: number) {
    return this.frecuenciasService.findByBus(id);
  }

  @ApiOperation({ summary: 'Obtener frecuencias por destino' })
  @ApiParam({ name: 'destino', description: 'Ciudad de destino' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frecuencias encontradas',
    type: [CreateFrecuenciaDto]
  })
  @Get('destino/:destino')
  findByDestino(@Param('destino') destino: string) {
    return this.frecuenciasService.findByDestino(destino);
  }

  @ApiOperation({ summary: 'Obtener frecuencias por provincia' })
  @ApiParam({ name: 'provincia', description: 'Provincia de destino' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frecuencias encontradas',
    type: [CreateFrecuenciaDto]
  })
  @Get('provincia/:provincia')
  findByProvincia(@Param('provincia') provincia: string) {
    return this.frecuenciasService.findByProvincia(provincia);
  }

  @ApiOperation({ summary: 'Obtener frecuencias por origen' })
  @ApiParam({ name: 'origen', description: 'Ciudad de origen' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frecuencias encontradas',
    type: [CreateFrecuenciaDto]
  })
  @Get('origen/:origen')
  findByOrigen(@Param('origen') origen: string) {
    return this.frecuenciasService.findByOrigen(origen);
  }

  @ApiOperation({ summary: 'Actualizar una frecuencia' })
  @ApiParam({ name: 'id', description: 'ID de la frecuencia a actualizar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frecuencia actualizada exitosamente',
    type: UpdateFrecuenciaDto
  })
  @Put(':id')
  update(@Param('id') id: number, @Body() updateFrecuenciaDto: UpdateFrecuenciaDto) {
    return this.frecuenciasService.update(id, updateFrecuenciaDto);
  }

  @ApiOperation({ summary: 'Eliminar una frecuencia' })
  @ApiParam({ name: 'id', description: 'ID de la frecuencia a eliminar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frecuencia eliminada exitosamente'
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frecuenciasService.remove(+id);
  }
}
