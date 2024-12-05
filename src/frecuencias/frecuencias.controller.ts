import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
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
  findOne(@Param('id') id: number) {
    return this.frecuenciasService.findOne(id);
  }

  @Get('conductor/:id')
  findByConductor(@Param('id') id: number) {
    return this.frecuenciasService.findByConductor(id);
  }

  @Get('bus/:id')
  findByBus(@Param('id') id: number) {
    return this.frecuenciasService.findByBus(id);
  }

  @Get('destino/:destino')
  findByDestino(@Param('destino') destino: string) {
    return this.frecuenciasService.findByDestino(destino);
  }

  @Get('provincia/:provincia')
  findByProvincia(@Param('provincia') provincia: string) {
    return this.frecuenciasService.findByProvincia(provincia);
  }

  @Get('origen/:origen')
  findByOrigen(@Param('origen') origen: string) {
    return this.frecuenciasService.findByOrigen(origen);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateFrecuenciaDto: UpdateFrecuenciaDto) {
    return this.frecuenciasService.update(id, updateFrecuenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frecuenciasService.remove(+id);
  }
}
