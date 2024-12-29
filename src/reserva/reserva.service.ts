import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
  ) { }

  private async calcularPrecio(destinoReserva: string, frecuenciaId: number, asientoId: number): Promise<number> {
    const frecuencia = await this.frecuenciaRepository.findOne({
      where: { frecuencia_id: frecuenciaId },
      relations: { rutas: { parada: true } },
    });

    if (!frecuencia) {
      throw new NotFoundException(`Frecuencia con ID ${frecuenciaId} no encontrada`);
    }

    const asiento = await this.asientoRepository.findOne({ where: { asiento_id: asientoId } });

    if (!asiento) {
      throw new NotFoundException(`Asiento con ID ${asientoId} no encontrado`);
    }

    const precioBase = destinoReserva === frecuencia.destino
      ? frecuencia.total
      : frecuencia.rutas.find(r => r.parada.ciudad === destinoReserva)?.precio_parada;

    if (precioBase === undefined) {
      throw new NotFoundException(`Destino ${destinoReserva} no encontrado en la ruta`);
    }

    return asiento.tipo_asiento === Asientos.VIP ? precioBase * 1.4 : precioBase;
  }

  private async buscarBoletoExistente(
    usuarioId: number,
    frecuenciaId: number,
    fechaViaje: Date,
    destinoReserva: string
  ): Promise<Boleto | null> {
    const reservaExistente = await this.reservaRepository.findOne({
      where: {
        usuario_id: usuarioId,
        frecuencia_id: frecuenciaId,
        fecha_viaje: fechaViaje,
        destino_reserva: destinoReserva,
        estado: EstadoReserva.CONFIRMADA,
      },
      relations: ['boleto'],
    });

    return reservaExistente?.boleto || null;
  }

  private async actualizarBoleto(boletoId: number): Promise<void> {
    const boleto = await this.boletoRepository.findOne({ where: { boleto_id: boletoId }, relations: ['reservas'] });

    if (!boleto) return;

    const numerosAsientos = await Promise.all(
      boleto.reservas.map(async reserva => {
        const asiento = await this.asientoRepository.findOne({ where: { asiento_id: reserva.asiento_id } });
        return asiento.numero_asiento;
      })
    );

    boleto.asientos = numerosAsientos.sort((a, b) => a - b).join(',');
    boleto.cantidad_asientos = boleto.reservas.length;
    boleto.total = boleto.reservas.reduce((sum, reserva) => sum + reserva.precio, 0);

    const qrData = {
      total: boleto.total,
      cantidad_asientos: boleto.cantidad_asientos,
      estado: boleto.estado,
      asientos: boleto.asientos,
    };

    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
    const uploadResult = await this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');

    boleto.url_imagen_qr = uploadResult.secure_url;
    await this.boletoRepository.save(boleto);
  }

  private async crearNuevoBoleto(reserva: Reserva): Promise<Boleto> {
    const asiento = await this.asientoRepository.findOne({ where: { asiento_id: reserva.asiento_id } });

    const qrData = {
      total: reserva.precio,
      cantidad_asientos: 1,
      estado: EstadoBoleto.PAGADO,
      asientos: asiento.numero_asiento.toString(),
    };

    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
    const uploadResult = await this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');

    const boleto = this.boletoRepository.create({
      total: reserva.precio,
      cantidad_asientos: 1,
      estado: EstadoBoleto.PAGADO,
      asientos: asiento.numero_asiento.toString(),
      url_imagen_qr: uploadResult.secure_url,
    });

    return this.boletoRepository.save(boleto);
  }

  private async validarReservaExistente(
    usuarioId: number,
    frecuenciaId: number,
    fechaViaje: Date,
    destinoReserva: string,
    asientoId: number
  ): Promise<void> {
    // Verificar si el asiento ya está confirmado para esta frecuencia y fecha
    const asientoConfirmado = await this.reservaRepository.findOne({
      where: {
        frecuencia_id: frecuenciaId,
        fecha_viaje: fechaViaje,
        asiento_id: asientoId,
        estado: EstadoReserva.CONFIRMADA
      }
    });

    if (asientoConfirmado) {
      throw new ConflictException(
        'Este asiento ya está confirmado para esta frecuencia y fecha'
      );
    }

    // Verificar si el usuario ya tiene una reserva igual
    const reservaExistente = await this.reservaRepository.findOne({
      where: {
        usuario_id: usuarioId,
        frecuencia_id: frecuenciaId,
        fecha_viaje: fechaViaje,
        destino_reserva: destinoReserva,
        asiento_id: asientoId
      }
    });

    if (reservaExistente) {
      throw new ConflictException(
        'Ya existe una reserva para este usuario con el mismo destino, fecha, frecuencia y asiento'
      );
    }
  }

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    await this.validarReservaExistente(
      createReservaDto.usuario_id,
      createReservaDto.frecuencia_id,
      createReservaDto.fecha_viaje,
      createReservaDto.destino_reserva,
      createReservaDto.asiento_id
    );

    const usuario = await this.userRepository.findOne({ where: { usuario_id: createReservaDto.usuario_id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createReservaDto.usuario_id} no encontrado`);
    }

    const frecuencia = await this.frecuenciaRepository.findOne({ where: { frecuencia_id: createReservaDto.frecuencia_id } });

    if (!frecuencia) {
      throw new NotFoundException(`Frecuencia con ID ${createReservaDto.frecuencia_id} no encontrada`);
    }

    const precio = await this.calcularPrecio(
      createReservaDto.destino_reserva,
      createReservaDto.frecuencia_id,
      createReservaDto.asiento_id
    );

    const reserva = this.reservaRepository.create({
      ...createReservaDto,
      nombre_pasajero: `${usuario.primer_nombre} ${usuario.segundo_nombre}`.trim(),
      identificacion_pasajero: usuario.identificacion,
      hora_viaje: frecuencia.hora_salida,
      precio,
    });

    if (reserva.estado === EstadoReserva.CONFIRMADA) {
      const boletoExistente = await this.buscarBoletoExistente(
        reserva.usuario_id,
        reserva.frecuencia_id,
        reserva.fecha_viaje,
        reserva.destino_reserva
      );

      reserva.boleto_id = boletoExistente?.boleto_id || (await this.crearNuevoBoleto(reserva)).boleto_id;
    }

    const reservaGuardada = await this.reservaRepository.save(reserva);

    if (reservaGuardada.boleto_id) {
      await this.actualizarBoleto(reservaGuardada.boleto_id);
    }

    return reservaGuardada;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);
    const estadoAnterior = reserva.estado;

    if (updateReservaDto.usuario_id) {
      const usuario = await this.userRepository.findOne({ where: { usuario_id: updateReservaDto.usuario_id } });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${updateReservaDto.usuario_id} no encontrado`);
      }

      reserva.nombre_pasajero = `${usuario.primer_nombre} ${usuario.segundo_nombre}`.trim();
      reserva.identificacion_pasajero = usuario.identificacion;
    }

    if (updateReservaDto.frecuencia_id) {
      const frecuencia = await this.frecuenciaRepository.findOne({ where: { frecuencia_id: updateReservaDto.frecuencia_id } });

      if (!frecuencia) {
        throw new NotFoundException(`Frecuencia con ID ${updateReservaDto.frecuencia_id} no encontrada`);
      }

      reserva.hora_viaje = frecuencia.hora_salida;
    }

    Object.assign(reserva, updateReservaDto);

    if (estadoAnterior !== EstadoReserva.CONFIRMADA && reserva.estado === EstadoReserva.CONFIRMADA) {
      const boletoExistente = await this.buscarBoletoExistente(
        reserva.usuario_id,
        reserva.frecuencia_id,
        reserva.fecha_viaje,
        reserva.destino_reserva
      );

      reserva.boleto_id = boletoExistente?.boleto_id || (await this.crearNuevoBoleto(reserva)).boleto_id;
    }

    const reservaActualizada = await this.reservaRepository.save(reserva);

    if (reservaActualizada.boleto_id) {
      await this.actualizarBoleto(reservaActualizada.boleto_id);
    }

    return reservaActualizada;
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({ where: { reserva_id: id } });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reserva;
  }

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({ relations: { boleto: true } });
  }

  async remove(id: number): Promise<Reserva> {
    const reserva = await this.findOne(id);
    return this.reservaRepository.remove(reserva);
  }

}
