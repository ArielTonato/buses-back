import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AsientosService } from './asientos.service';
import { CreateAsientoDto } from './dto/create-asiento.dto';

@Controller('asientos')
export class AsientosController {
  constructor(private readonly asientosService: AsientosService) {}

  @Post()
  create(@Body() createAsientoDto: CreateAsientoDto) {
    return this.asientosService.create(createAsientoDto);
  }

  @Get()
  findAll() {
    return this.asientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asientosService.findOne(+id);
  }
}
