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
      throw new ConflictException('ya existe un bus con esa placa');
    }
    return this.busRepository.save(createBusDto);
  }

  findAll() {
    return this.busRepository.find();
  }

  findOneByPlaca(placa: string) {
    return this.busRepository.findOneBy({placa});
  }

  findOne(id: number) {
    return this.busRepository.findOneBy({bus_id: id});
  }

  async update(id: number, updateBusDto: UpdateBusDto) {
    const bus = await this.findOne(id);
    if (!bus) {
      throw new ConflictException('El bus no existe');
    }
    const busExists = await this.findOneByPlaca(updateBusDto.placa);
    if (busExists && busExists.bus_id !== id) {
      throw new ConflictException('Ya existe un bus con esa placa');
    }
    await this.busRepository.update(id, updateBusDto);
    return {message: "Bus Actualizado"};
  }
  //Si un bus no esta activo no se puede asignar a una frecuencia

  async remove(id: number) {
    const bus = await this.busRepository.findOneBy({bus_id: id});
    if (!bus) {
      throw new ConflictException('El bus no existe');
    }

   await this.busRepository.delete({
      bus_id: id
    });
    return {message: "Bus Eliminado"};
  }
}
