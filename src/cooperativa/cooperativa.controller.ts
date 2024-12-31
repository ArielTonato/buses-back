import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CooperativaService } from './cooperativa.service';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';

@Controller('cooperativa')
export class CooperativaController {
  constructor(private readonly cooperativaService: CooperativaService) {}

  @Post()
  create(@Body() createCooperativaDto: CreateCooperativaDto) {
    return this.cooperativaService.create(createCooperativaDto);
  }

  @Get()
  findAll() {
    return this.cooperativaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperativaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperativaDto: UpdateCooperativaDto) {
    return this.cooperativaService.update(+id, updateCooperativaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperativaService.remove(+id);
  }
}
