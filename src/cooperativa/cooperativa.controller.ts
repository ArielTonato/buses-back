import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { CooperativaService } from './cooperativa.service';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Cooperativas')
@Controller('cooperativa')
export class CooperativaController {
  constructor(private readonly cooperativaService: CooperativaService) {}

  @ApiOperation({ summary: 'Crear una nueva cooperativa' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          description: 'Nombre de la cooperativa',
          example: 'Cooperativa Trans Express'
        },
        telefono: {
          type: 'string',
          description: 'Número de teléfono',
          example: '0987654321'
        },
        correo: {
          type: 'string',
          description: 'Correo electrónico',
          example: 'info@transexpress.com'
        },
        ruc: {
          type: 'string',
          description: 'RUC de la cooperativa',
          example: '1234567890001'
        },
        direccion: {
          type: 'string',
          description: 'Dirección física',
          example: 'Av. Principal 123 y Secundaria'
        },
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Logo de la cooperativa (imagen jpg, jpeg o png, máx. 8MB)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Cooperativa creada exitosamente',
    type: CreateCooperativaDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error en la validación del logo o datos de la cooperativa'
  })
  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createCooperativaDto: CreateCooperativaDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 8 }), 
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' })
        ],
        exceptionFactory: (errors) => {
          if (errors === "File is required") {
            throw new BadRequestException('Se necesita una imagen para el logo de la cooperativa');
          }
          throw new BadRequestException('El archivo debe ser una imagen en formato jpg, jpeg o png');
        }
      })
    ) file: Express.Multer.File
  ) {
    return this.cooperativaService.create(createCooperativaDto, file);
  }

  @ApiOperation({ summary: 'Obtener todas las cooperativas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de todas las cooperativas',
    type: [CreateCooperativaDto]
  })
  @Get()
  findAll() {
    return this.cooperativaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una cooperativa por ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la cooperativa',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cooperativa encontrada',
    type: CreateCooperativaDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cooperativa no encontrada'
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperativaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar una cooperativa' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          description: 'Nombre de la cooperativa',
          example: 'Cooperativa Trans Express'
        },
        telefono: {
          type: 'string',
          description: 'Número de teléfono',
          example: '0987654321'
        },
        correo: {
          type: 'string',
          description: 'Correo electrónico',
          example: 'info@transexpress.com'
        },
        ruc: {
          type: 'string',
          description: 'RUC de la cooperativa',
          example: '1234567890001'
        },
        direccion: {
          type: 'string',
          description: 'Dirección física',
          example: 'Av. Principal 123 y Secundaria'
        },
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Logo de la cooperativa (imagen jpg, jpeg o png, máx. 8MB)'
        }
      }
    }
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la cooperativa a actualizar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cooperativa actualizada exitosamente',
    type: UpdateCooperativaDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cooperativa no encontrada'
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @Body() updateCooperativaDto: UpdateCooperativaDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 8 }),
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' })
        ],
        fileIsRequired: false,
        exceptionFactory: (errors) => {
          throw new BadRequestException('El archivo debe ser una imagen en formato jpg, jpeg o png');
        }
      })
    ) file?: Express.Multer.File
  ) {
    return this.cooperativaService.update(+id, updateCooperativaDto, file);
  }

  @ApiOperation({ summary: 'Eliminar una cooperativa' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la cooperativa a eliminar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cooperativa eliminada exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cooperativa no encontrada'
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperativaService.remove(+id);
  }
}
