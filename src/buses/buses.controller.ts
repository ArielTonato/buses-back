import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { error } from 'console';


// @Auth(Roles.USUARIOS_BUSES)
@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  create(
    @Body() createBusDto: CreateBusDto,
    @UploadedFiles(
      new ParseFilePipe(
        {
          validators:[
            new MaxFileSizeValidator({maxSize: 1024 * 1024 * 8}),
            new FileTypeValidator({fileType: '.(jpg|jpeg|png)'})
          ],
          exceptionFactory: (errors) => {
            if (errors === "File is required") {
              throw new BadRequestException('Se necesita al menos una imagen del bus');
            }
            throw new BadRequestException('El archivo debe ser una imagen en formato jpg, jpeg o png');
          }
        }
      )
    ) files?: Express.Multer.File[]
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
    return this.busesService.findOneByPlacaNoValidation(placa);
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
