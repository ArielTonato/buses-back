import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';

@Controller('paradas')
export class ParadasController {
  constructor(private readonly paradasService: ParadasService) {}

  @Post()
  create(@Body() createParadaDto: CreateParadaDto) {
    return this.paradasService.create(createParadaDto);
  }

  @Get()
  findAll() {
    return this.paradasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.paradasService.findOne(id);
  }

  @Get('ciudad/:ciudad')
  findByCiudad(@Param('ciudad') ciudad: string) {
    return this.paradasService.findByCiudad(ciudad);
  }

  @Get('buscar/:ciudad')
  findByLikeCiudad(@Param('ciudad') ciudad: string) {
    return this.paradasService.findByLikeCiudad(ciudad);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateParadaDto: UpdateParadaDto) {
    return this.paradasService.update(id, updateParadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.paradasService.remove(id);
  }
}
