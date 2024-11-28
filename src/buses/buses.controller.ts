import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';


// @Auth(Roles.USUARIOS_BUSES)
@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  create(
    @Body() createBusDto: CreateBusDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return this.busesService.create(createBusDto, files);
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
