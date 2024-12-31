import { Injectable } from '@nestjs/common';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';

@Injectable()
export class CooperativaService {
  create(createCooperativaDto: CreateCooperativaDto) {
    return 'This action adds a new cooperativa';
  }

  findAll() {
    return `This action returns all cooperativa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cooperativa`;
  }

  update(id: number, updateCooperativaDto: UpdateCooperativaDto) {
    return `This action updates a #${id} cooperativa`;
  }

  remove(id: number) {
    return `This action removes a #${id} cooperativa`;
  }
}
