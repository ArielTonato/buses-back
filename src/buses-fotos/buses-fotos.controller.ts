import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { BusesFotosService } from './buses-fotos.service';
import { CreateBusesFotoDto } from './dto/create-buses-foto.dto';
import { UpdateBusesFotoDto } from './dto/update-buses-foto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('buses-fotos')
export class BusesFotosController {
  constructor(private readonly busesFotosService: BusesFotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe(
        {
          validators:[
            new MaxFileSizeValidator({maxSize: 1024 * 1024 * 5}),
            new FileTypeValidator({fileType: '.(jpg|jpeg|png)'})
          ]
        }
      )
    ) file: Express.Multer.File
  ){
    console.log(file);
    return this.busesFotosService.uploadImage(file);
  }

  @Get()
  findAll() {
    return this.busesFotosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.busesFotosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusesFotoDto: UpdateBusesFotoDto) {
    return this.busesFotosService.update(+id, updateBusesFotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.busesFotosService.remove(+id);
  }
}
