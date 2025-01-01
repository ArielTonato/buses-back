import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';

// @Auth(Roles.USUARIOS_BUSES)
@ApiTags('Buses')
@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @ApiOperation({ summary: 'Crear un nuevo bus' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ 
    status: 201, 
    description: 'Bus creado exitosamente',
    type: CreateBusDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o formato de imagen incorrecto' })
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

  @ApiOperation({ summary: 'Obtener todos los buses' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de buses',
    type: [CreateBusDto]
  })
  @Get()
  findAll() {
    return this.busesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un bus por ID' })
  @ApiParam({ name: 'id', description: 'ID del bus' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bus encontrado',
    type: CreateBusDto
  })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.busesService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar bus por placa' })
  @ApiParam({ name: 'placa', description: 'Número de placa del bus' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bus encontrado',
    type: CreateBusDto
  })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  @Get('search/:placa')
  findOneByPlaca(@Param('placa') placa: string) {
    return this.busesService.findOneByPlacaNoValidation(placa);
  }

  @ApiOperation({ summary: 'Actualizar un bus' })
  @ApiParam({ name: 'id', description: 'ID del bus a actualizar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bus actualizado exitosamente',
    type: UpdateBusDto
  })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  @Put(':id')
  update(@Param('id') id: number, @Body() updateBusDto: UpdateBusDto) {
    return this.busesService.update(id, updateBusDto);
  }

  @ApiOperation({ summary: 'Eliminar un bus' })
  @ApiParam({ name: 'id', description: 'ID del bus a eliminar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bus eliminado exitosamente'
  })
  
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.busesService.remove(id);
  }
}
