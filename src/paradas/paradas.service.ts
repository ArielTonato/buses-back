import { Inject, Injectable } from '@nestjs/common';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { Parada } from './entities/parada.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ParadasService {
  constructor(
    @InjectRepository(Parada)
    private readonly paradaRepository: Repository<Parada>
  ) {}

  create(createParadaDto: CreateParadaDto) {
    return 'This action adds a new parada';
  }

  findAll() {
    return `This action returns all paradas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parada`;
  }

  update(id: number, updateParadaDto: UpdateParadaDto) {
    return `This action updates a #${id} parada`;
  }

  remove(id: number) {
    return `This action removes a #${id} parada`;
  }
}
