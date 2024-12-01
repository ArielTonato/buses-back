import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { Parada } from './entities/parada.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ParadasService {
  constructor(
    @InjectRepository(Parada)
    private readonly paradaRepository: Repository<Parada>
  ) {}

  async create(createParadaDto: CreateParadaDto) {
    const parada = await this.findByCiudadNoRestrict(createParadaDto.ciudad);
    if (parada) {
      throw new BadRequestException('La parada ya existe');
    }

    const newParada = this.paradaRepository.create(createParadaDto);
    return this.paradaRepository.save(newParada);
  }

  findAll() {
    return this.paradaRepository.find();
  }

  findByCiudadNoRestrict(ciudad: string) {
    return this.paradaRepository.findOneBy({ ciudad });
  }

  async findByCiudad(ciudad: string) {
    const parada = await this.findByCiudadNoRestrict(ciudad);
    if (!parada) {
      throw new BadRequestException('La parada no existe');
    }
    return parada;
  }

  findByLikeCiudad(ciudad: string) {
    return this.paradaRepository.find({
      where: {
        ciudad: Like(`%${ciudad}%`)
      }
    });
  }

  findOne(id: number) {
    return this.paradaRepository.findOneBy({parada_id: id});
  }

 async update(id: number, updateParadaDto: UpdateParadaDto) {
    const parada = await this.findOne(id);
    if (!parada) {
      throw new BadRequestException('La parada no existe');
    }
    const paradaExists = await this.findByCiudadNoRestrict(updateParadaDto.ciudad);
    if (paradaExists && paradaExists.parada_id !== id) {
      throw new BadRequestException('La parada ya existe');
    }
    await this.paradaRepository.update(id, updateParadaDto);
    return { message: "Parada Actualizada" };
  }

  async remove(id: number) {
    const parada = await this.findOne(id);
    if (!parada) {
      throw new BadRequestException('La parada no existe');
    }
    await this.paradaRepository.delete(id);
    return { message: "Parada Eliminada" };
  }
}
