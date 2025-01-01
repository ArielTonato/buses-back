import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, NotFoundException, BadRequestException } from '@nestjs/common';
import { ComprobantesPagosService } from './comprobantes_pagos.service';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('comprobantes-pagos')
export class ComprobantesPagosController {
  constructor(private readonly comprobantesPagosService: ComprobantesPagosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createComprobantesPagoDto: CreateComprobantesPagoDto,
    @UploadedFile(
      new ParseFilePipe(
        {
          validators:[
            new MaxFileSizeValidator({maxSize: 1024 * 1024 * 8}),
            new FileTypeValidator({fileType: '.(jpg|jpeg|png)'})
          ],
          exceptionFactory: (errors) => {
            if (errors === "File is required") {
              throw new NotFoundException('Se necesita al menos una imagen del comprobante de pago');
            }
            throw new BadRequestException('El archivo debe ser una imagen en formato jpg, jpeg o png');
          }
        }
      )
    ) file: Express.Multer.File,
  ) {
    return this.comprobantesPagosService.create(createComprobantesPagoDto, file);
  }

  @Get()
  findAll() {
    return this.comprobantesPagosService.findAll();
  }

  @Get('user/:id')
  findAllByUser(@Param('id') id: number) {
    return this.comprobantesPagosService.findAllByUser(id);
  }

  @Get('total')
  getTotal() {
    return this.comprobantesPagosService.count();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.comprobantesPagosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateComprobantesPagoDto: UpdateComprobantesPagoDto) {
    return this.comprobantesPagosService.update(id, updateComprobantesPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.comprobantesPagosService.remove(id);
  }
}
