import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FrecuenciasService } from './frecuencias.service';
import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';

@Controller('frecuencias')
export class FrecuenciasController {
  constructor(private readonly frecuenciasService: FrecuenciasService) {}

  @Post()
  create(@Body() createFrecuenciaDto: CreateFrecuenciaDto) {
    return this.frecuenciasService.create(createFrecuenciaDto);
  }

  @Get()
  findAll() {
    return this.frecuenciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frecuenciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFrecuenciaDto: UpdateFrecuenciaDto) {
    return this.frecuenciasService.update(+id, updateFrecuenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frecuenciasService.remove(+id);
  }
}
