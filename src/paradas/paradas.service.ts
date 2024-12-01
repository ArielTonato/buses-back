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
    const parada = await this.findByCiudad(createParadaDto.ciudad);
    if (parada) {
      throw new BadRequestException('La parada ya existe');
    }

    const newParada = this.paradaRepository.create(createParadaDto);
    return this.paradaRepository.save(newParada);
  }

  findAll() {
    return this.paradaRepository.find();
  }

  findByCiudad(ciudad: string) {
    return this.paradaRepository.findOneBy({ciudad: ciudad});
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

  update(id: number, updateParadaDto: UpdateParadaDto) {
    return `This action updates a #${id} parada`;
  }

  remove(id: number) {
    return `This action removes a #${id} parada`;
  }
}
