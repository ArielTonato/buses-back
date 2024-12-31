import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Post()
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }

  @Get()
  findAll() {
    return this.rutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rutasService.findOne(id);
  }

  @Get('frecuencia/:id')
  findByFrecuencia(@Param('id') id: number) {
    return this.rutasService.findByFrecuencia(id);
  }

  @Get('parada/:id')
  findByParada(@Param('id') id: number) {
    return this.rutasService.findByParada(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateRutaDto: UpdateRutaDto) {
    return this.rutasService.update(id, updateRutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rutasService.remove(id);
  }
}
