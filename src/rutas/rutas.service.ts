import { Injectable } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ruta } from './entities/ruta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>
  ) {}


  create(createRutaDto: CreateRutaDto) {
    //Antes de agregar la ruta, verificar que la parada y la frecuencia existan
    //Verificar que la parada y la frecuencia esten activas
    //Verificar que no haya dos rutas con la misma parada y la misma frecuencia
    return this.rutaRepository.save(createRutaDto);
  }

  findAll() {
    return this.rutaRepository.find();
  }

  findOne(id: number) {
    return this.rutaRepository.findOneBy({rutas_id: id});
  }

  update(id: number, updateRutaDto: UpdateRutaDto) {
    //Antes de actualizar la ruta, verificar que la parada y la frecuencia existan
    //Verificar que la parada y la frecuencia esten activas
    //Verificar que no haya dos rutas con la misma parada y la misma frecuencia
    return `This action updates a #${id} ruta`;
  }

  async remove(id: number) {
    const ruta = await this.rutaRepository.findOneBy({rutas_id: id});
    if (!ruta) {
      return {message: 'La ruta no existe'};
    }
    await this.rutaRepository.delete(id);
    return {message:"Ruta Eliminada"}
  }
}
