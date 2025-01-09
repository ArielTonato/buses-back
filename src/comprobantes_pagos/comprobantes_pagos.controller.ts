import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ComprobantesPagosService } from './comprobantes_pagos.service';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Comprobantes de Pago')
@Controller('comprobantes-pagos')
export class ComprobantesPagosController {
  constructor(
    private readonly comprobantesPagosService: ComprobantesPagosService,
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo comprobante de pago' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del comprobante de pago (jpg, jpeg, png)',
        },
        boleto_id: {
          type: 'number',
          description: 'ID del boleto asociado al comprobante',
        },
        usuario_id: {
          type: 'number',
          description: 'ID del usuario que realiza el pago',
        },
        estado: {
          type: 'string',
          enum: ['pendiente', 'aprobado', 'rechazado'],
          description: 'Estado del comprobante',
        },
        comentarios: {
          type: 'string',
          description: 'Comentarios adicionales',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Comprobante de pago creado exitosamente',
    type: CreateComprobantesPagoDto,
  })
  @ApiResponse({
    status: 400,
    description: 'El archivo debe ser una imagen en formato jpg, jpeg o png',
  })
  @ApiResponse({
    status: 404,
    description: 'Se necesita al menos una imagen del comprobante de pago',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createComprobantesPagoDto: CreateComprobantesPagoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 8 }),
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
        ],
        exceptionFactory: (errors) => {
          if (errors === 'File is required') {
            throw new NotFoundException(
              'Se necesita al menos una imagen del comprobante de pago',
            );
          }
          throw new BadRequestException(
            'El archivo debe ser una imagen en formato jpg, jpeg o png',
          );
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.comprobantesPagosService.create(
      createComprobantesPagoDto,
      file,
    );
  }

  @ApiOperation({ summary: 'Obtener todos los comprobantes de pago' })
  @ApiResponse({
    status: 200,
    description: 'Lista de comprobantes de pago',
    type: [CreateComprobantesPagoDto],
  })
  @Get()
  findAll() {
    return this.comprobantesPagosService.findAll();
  }

  @ApiOperation({ summary: 'Obtener comprobantes de pago por usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Comprobantes de pago del usuario',
    type: [CreateComprobantesPagoDto],
  })
  @Get('user/:id')
  findAllByUser(@Param('id') id: number) {
    return this.comprobantesPagosService.findAllByUser(id);
  }

  @ApiOperation({ summary: 'Obtener el total de comprobantes de pago' })
  @ApiResponse({
    status: 200,
    description: 'Total de comprobantes de pago',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          example: 10,
        },
      },
    },
  })
  @Get('total')
  getTotal() {
    return this.comprobantesPagosService.count();
  }

  @ApiOperation({ summary: 'Obtener un comprobante de pago por ID' })
  @ApiParam({ name: 'id', description: 'ID del comprobante de pago' })
  @ApiResponse({
    status: 200,
    description: 'Comprobante de pago encontrado',
    type: CreateComprobantesPagoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Comprobante de pago no encontrado',
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.comprobantesPagosService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un comprobante de pago' })
  @ApiParam({
    name: 'id',
    description: 'ID del comprobante de pago a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Comprobante de pago actualizado exitosamente',
    type: UpdateComprobantesPagoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Comprobante de pago no encontrado',
  })
  @Put(':id')
  @UseInterceptors(FileInterceptor('file')) // Agregar esto
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File, // Agregar esto
    @Body() updateComprobantesPagoDto: UpdateComprobantesPagoDto,
  ) {
    // El servicio maneja la actualización
    return this.comprobantesPagosService.update(id, updateComprobantesPagoDto);
  }

  @ApiOperation({ summary: 'Eliminar un comprobante de pago' })
  @ApiParam({
    name: 'id',
    description: 'ID del comprobante de pago a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Comprobante de pago eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Comprobante de pago no encontrado',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.comprobantesPagosService.remove(id);
  }
}
