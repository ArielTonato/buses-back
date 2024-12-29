import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Frecuencia } from '../frecuencias/entities/frecuencia.entity';
import { Asiento } from '../asientos/entities/asiento.entity';
import { Ruta } from '../rutas/entities/ruta.entity';
import { Asientos } from '../common/enums/asientos.enum';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Frecuencia)
    private readonly frecuenciaRepository: Repository<Frecuencia>,
    @InjectRepository(Asiento)
    private readonly asientoRepository: Repository<Asiento>,
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,
  ) {}

  private async calcularPrecio(destino_reserva: string, frecuencia_id: number, asiento_id: number): Promise<number> {
    // Buscar la frecuencia con sus rutas y paradas
    const frecuencia = await this.frecuenciaRepository.findOne({
      where: { frecuencia_id },
      relations: {
        rutas: {
          parada: true
        }
      }
    });

    if (!frecuencia) {
      throw new NotFoundException(`Frecuencia con ID ${frecuencia_id} no encontrada`);
    }

    // Buscar el asiento para verificar si es VIP
    const asiento = await this.asientoRepository.findOne({
      where: { asiento_id }
    });

    if (!asiento) {
      throw new NotFoundException(`Asiento con ID ${asiento_id} no encontrado`);
    }

    let precio_base = 0;

    // Si el destino de la reserva es igual al destino final de la frecuencia
    if (destino_reserva === frecuencia.destino) {
      precio_base = frecuencia.total;
    } else {
      // Buscar en las rutas si el destino está en alguna parada
      const ruta = frecuencia.rutas.find(r => r.parada.ciudad === destino_reserva);
      
      if (!ruta) {
        throw new NotFoundException(`Destino ${destino_reserva} no encontrado en la ruta`);
      }

      precio_base = ruta.precio_parada;
    }

    // Aplicar recargo del 40% si el asiento es VIP
    if (asiento.tipo_asiento === Asientos.VIP) {
      precio_base *= 1.4; // Aumentar 40%
    }

    return precio_base;
  }

  async create(createReservaDto: CreateReservaDto) {
    // Buscar el usuario
    const usuario = await this.userRepository.findOne({
      where: { usuario_id: createReservaDto.usuario_id }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createReservaDto.usuario_id} no encontrado`);
    }

    // Buscar la frecuencia
    const frecuencia = await this.frecuenciaRepository.findOne({
      where: { frecuencia_id: createReservaDto.frecuencia_id }
    });

    if (!frecuencia) {
      throw new NotFoundException(`Frecuencia con ID ${createReservaDto.frecuencia_id} no encontrada`);
    }

    // Calcular el precio
    const precio = await this.calcularPrecio(
      createReservaDto.destino_reserva,
      createReservaDto.frecuencia_id,
      createReservaDto.asiento_id
    );

    // Crear la reserva con los datos calculados
    const reserva = this.reservaRepository.create({
      ...createReservaDto,
      nombre_pasajero: `${usuario.primer_nombre} ${usuario.segundo_nombre}`.trim(),
      identificacion_pasajero: usuario.identificacion,
      hora_viaje: frecuencia.hora_salida,
      precio: precio
    });

    return this.reservaRepository.save(reserva);
  }

  findAll() {
    return this.reservaRepository.find();
  }

  async findOne(id: number) {
    const reserva = await this.reservaRepository.findOne({
      where: { reserva_id: id }
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reserva;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    const reserva = await this.findOne(id);

    if (updateReservaDto.usuario_id) {
      const usuario = await this.userRepository.findOne({
        where: { usuario_id: updateReservaDto.usuario_id }
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${updateReservaDto.usuario_id} no encontrado`);
      }

      reserva.nombre_pasajero = `${usuario.primer_nombre} ${usuario.segundo_nombre}`.trim();
      reserva.identificacion_pasajero = usuario.identificacion;
    }

    if (updateReservaDto.frecuencia_id) {
      const frecuencia = await this.frecuenciaRepository.findOne({
        where: { frecuencia_id: updateReservaDto.frecuencia_id }
      });

      if (!frecuencia) {
        throw new NotFoundException(`Frecuencia con ID ${updateReservaDto.frecuencia_id} no encontrada`);
      }

      reserva.hora_viaje = frecuencia.hora_salida;
    }

    Object.assign(reserva, updateReservaDto);
    return this.reservaRepository.save(reserva);
  }

  async remove(id: number) {
    const reserva = await this.findOne(id);
    return this.reservaRepository.remove(reserva);
  }
}
