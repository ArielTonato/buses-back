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
import { Boleto } from '../boletos/entities/boleto.entity';
import { EstadoReserva } from '../common/enums/reserva.enum';
import { EstadoBoleto } from '../common/enums/boletos.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as QRCode from 'qrcode';

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
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    private readonly cloudinaryService: CloudinaryService,
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

  private async buscarBoletoExistente(
    usuario_id: number,
    frecuencia_id: number,
    fecha_viaje: Date,
    destino_reserva: string
  ): Promise<Boleto | null> {
    // Buscar reservas del mismo usuario en la misma frecuencia, fecha y destino
    const reservaExistente = await this.reservaRepository.findOne({
      where: {
        usuario_id,
        frecuencia_id,
        fecha_viaje,
        destino_reserva,
        estado: EstadoReserva.CONFIRMADA
      },
      relations: ['boleto']
    });

    return reservaExistente?.boleto || null;
  }

  private async actualizarBoleto(boleto_id: number) {
    const boleto = await this.boletoRepository.findOne({
      where: { boleto_id },
      relations: ['reservas']
    });

    if (!boleto) return;

    // Obtener los números de asiento
    const numerosAsientos = await Promise.all(
      boleto.reservas.map(async (reserva) => {
        const asiento = await this.asientoRepository.findOne({
          where: { asiento_id: reserva.asiento_id }
        });
        return asiento.numero_asiento;
      })
    );

    // Actualizar el boleto
    boleto.asientos = numerosAsientos.sort((a, b) => a - b).join(',');
    boleto.cantidad_asientos = boleto.reservas.length;
    boleto.total = boleto.reservas.reduce((sum, reserva) => sum + reserva.precio, 0);

    await this.boletoRepository.save(boleto);
  }

  private async crearNuevoBoleto(reserva: Reserva): Promise<Boleto> {
    const asiento = await this.asientoRepository.findOne({
      where: { asiento_id: reserva.asiento_id }
    });

    // Crear datos para el QR
    const qrData = {
      total: reserva.precio,
      cantidad_asientos: 1,
      estado: EstadoBoleto.PAGADO,
      asientos: asiento.numero_asiento.toString()
    };

    // Generar QR como Buffer
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));

    // Subir el QR a Cloudinary
    const uploadResult = await this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');

    const boleto = this.boletoRepository.create({
      total: reserva.precio,
      cantidad_asientos: 1,
      estado: EstadoBoleto.PAGADO,
      asientos: asiento.numero_asiento.toString(),
      url_imagen_qr: uploadResult.secure_url
    });

    return this.boletoRepository.save(boleto);
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

    // Si el estado es CONFIRMADA, buscar o crear el boleto
    if (reserva.estado === EstadoReserva.CONFIRMADA) {
      const boletoExistente = await this.buscarBoletoExistente(
        reserva.usuario_id,
        reserva.frecuencia_id,
        reserva.fecha_viaje,
        reserva.destino_reserva
      );

      if (boletoExistente) {
        // Asignar el boleto existente a la reserva
        reserva.boleto_id = boletoExistente.boleto_id;
      } else {
        // Crear un nuevo boleto
        const nuevoBoleto = await this.crearNuevoBoleto(reserva);
        reserva.boleto_id = nuevoBoleto.boleto_id;
      }
    }

    // Guardar la reserva
    const reservaGuardada = await this.reservaRepository.save(reserva);

    // Si hay un boleto, actualizarlo
    if (reservaGuardada.boleto_id) {
      await this.actualizarBoleto(reservaGuardada.boleto_id);
    }

    return reservaGuardada;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    const reserva = await this.findOne(id);
    const estadoAnterior = reserva.estado;

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

    // Actualizar la reserva
    Object.assign(reserva, updateReservaDto);

    // Si el estado cambió a CONFIRMADA, gestionar el boleto
    if (estadoAnterior !== EstadoReserva.CONFIRMADA && reserva.estado === EstadoReserva.CONFIRMADA) {
      const boletoExistente = await this.buscarBoletoExistente(
        reserva.usuario_id,
        reserva.frecuencia_id,
        reserva.fecha_viaje,
        reserva.destino_reserva
      );

      if (boletoExistente) {
        reserva.boleto_id = boletoExistente.boleto_id;
      } else {
        const nuevoBoleto = await this.crearNuevoBoleto(reserva);
        reserva.boleto_id = nuevoBoleto.boleto_id;
      }
    }

    // Guardar la reserva actualizada
    const reservaActualizada = await this.reservaRepository.save(reserva);

    // Si hay un boleto, actualizarlo
    if (reservaActualizada.boleto_id) {
      await this.actualizarBoleto(reservaActualizada.boleto_id);
    }

    return reservaActualizada;
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

  async findAll() {
    return this.reservaRepository.find({
      relations: {
        boleto: true
      }
    });
  }

  async remove(id: number) {
    const reserva = await this.findOne(id);
    return this.reservaRepository.remove(reserva);
  }
}
