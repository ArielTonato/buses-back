import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BusesService {
  
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>
  ) {}

  async create(createBusDto: CreateBusDto) {
    const bus = await this.findOneByPlaca(createBusDto.placa);
    if (bus) {
      throw new ConflictException('Bus already exists');
    }
    return this.busRepository.save(createBusDto);
  }

  findAll() {
    return `This action returns all buses`;
  }

  findOneByPlaca(placa: string) {
    return this.busRepository.findOneBy({placa});
  }

  findOne(id: number) {
    return `This action returns a #${id} bus`;
  }

  update(id: number, updateBusDto: UpdateBusDto) {
    return `This action updates a #${id} bus`;
  }

  remove(id: number) {
    return `This action removes a #${id} bus`;
  }
}
