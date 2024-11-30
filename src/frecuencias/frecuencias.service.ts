import { Injectable } from '@nestjs/common';
import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';

@Injectable()
export class FrecuenciasService {
  create(createFrecuenciaDto: CreateFrecuenciaDto) {
    return 'This action adds a new frecuencia';
  }

  findAll() {
    return `This action returns all frecuencias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} frecuencia`;
  }

  update(id: number, updateFrecuenciaDto: UpdateFrecuenciaDto) {
    return `This action updates a #${id} frecuencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} frecuencia`;
  }
}
