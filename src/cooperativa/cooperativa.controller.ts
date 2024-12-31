import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { CooperativaService } from './cooperativa.service';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cooperativa')
export class CooperativaController {
  constructor(private readonly cooperativaService: CooperativaService) {}

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

  @Get()
  findAll() {
    return this.cooperativaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperativaService.findOne(+id);
  }

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
        fileIsRequired: false
      })
    ) file?: Express.Multer.File
  ) {
    return this.cooperativaService.update(+id, updateCooperativaDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperativaService.remove(+id);
  }
}
