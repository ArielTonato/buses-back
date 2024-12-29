import { Injectable } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservaService {

  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {}

  create(createReservaDto: CreateReservaDto) {
    //Que el nombre de pasajero sea la concatenación de el primer_nombre y el segundo_nombre de la tabla user
    //Que la identificacion de pasajero sea la identificacion de la tabla user
    //La hora de viaje debe ser la hora de salida de la tabla frecuencia
    return this.reservaRepository.save(createReservaDto);
  }

  findAll() {
    return this.reservaRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} reserva`;
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }
}
