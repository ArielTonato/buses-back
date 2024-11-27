import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';


@Auth(Roles.USUARIOS_BUSES)
@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  create(@Body() createBusDto: CreateBusDto) {
    ///Cuando se haya creado el recurso buses_fotos este tambien debera traer un array cona las fotos
    return this.busesService.create(createBusDto);
  }

  @Get()
  findAll() {
    return this.busesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.busesService.findOne(id);
  }

  @Get('search/:placa')
  findOneByPlaca(@Param('placa') placa: string) {
    return this.busesService.findOneByPlaca(placa);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateBusDto: UpdateBusDto) {
    return this.busesService.update(id, updateBusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.busesService.remove(id);
  }
}
