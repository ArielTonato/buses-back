import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { User } from '../user/entities/user.entity';
import { Frecuencia } from '../frecuencias/entities/frecuencia.entity';
import { Asiento } from '../asientos/entities/asiento.entity';
import { Ruta } from '../rutas/entities/ruta.entity';
import { Boleto } from '../boletos/entities/boleto.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MailService } from '../mail/mail.service';
import { EstadoReserva, MetodoPago } from '../common/enums/reserva.enum';
import { EstadoBoleto } from '../common/enums/boletos.enum';
import * as QRCode from 'qrcode';
import { Asientos } from '../common/enums/asientos.enum';
import { FacturaService } from '../factura/factura.service';

interface QRCodeData {
  total: number;
  cantidad_asientos: number;
  estado: EstadoBoleto;
  asientos: string;
  mensaje?: string;
}

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
    private readonly mailService: MailService,
    private readonly facturaService: FacturaService,
  ) { }

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    await this.validateReservationCreation(createReservaDto);

    // Cancelar reservas pendientes para el mismo asiento y fecha
    await this.cancelarReservasPendientes(
      createReservaDto.asiento_id,
      new Date(createReservaDto.fecha_viaje)
    );

    const [usuario, frecuencia] = await Promise.all([
      this.findUserById(createReservaDto.usuario_id),
      this.findFrecuenciaById(createReservaDto.frecuencia_id)
    ]);

    const precio = await this.calcularPrecio(
      createReservaDto.destino_reserva,
      createReservaDto.frecuencia_id,
      createReservaDto.asiento_id
    );

    const reserva = await this.createReservaEntity(createReservaDto, usuario, frecuencia, precio);
    const reservaGuardada = await this.reservaRepository.save(reserva);

    if (reservaGuardada.boleto_id) {
      await this.actualizarBoleto(reservaGuardada.boleto_id);
    }

    //Cuando el tipo de pago es presencial o paypal, se envia un correo de confirmacion
    if (createReservaDto.metodo_pago === MetodoPago.PRESENCIAL || createReservaDto.metodo_pago === MetodoPago.PAYPAL) {
      await this.mailService.sendReservationConfirmation(
        usuario.correo,
        {
          name: `${usuario.primer_nombre} ${usuario.primer_apellido}`,
          reservationId: reservaGuardada.reserva_id
        }
      );
    }
    if(createReservaDto.metodo_pago === MetodoPago.DEPOSITO) {
      await this.mailService.sendReservation(
        usuario.correo,
        {
          name: `${usuario.primer_nombre} ${usuario.primer_apellido}`,
          reservationId: reservaGuardada.reserva_id
        }
      );
    }

    await this.handleFacturaCreation(reservaGuardada);

    return reservaGuardada;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);
    const estadoAnterior = reserva.estado;

    await this.updateReservaDetails(reserva, updateReservaDto);

    if (this.shouldCreateBoleto(estadoAnterior, reserva.estado)) {
      await this.handleBoletoCreation(reserva);
    }

    const reservaActualizada = await this.reservaRepository.save(reserva);

    if (reservaActualizada.boleto_id) {
      await this.actualizarBoleto(reservaActualizada.boleto_id);
    }

    await this.actualizarFactura(reservaActualizada.boleto_id);

    return reservaActualizada;
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { reserva_id: id },
      relations: ['asiento', 'boleto', 'boleto.reservas', 'boleto.reservas.asiento']
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reserva;
  }

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({
      relations: { boleto: true },
      order: { fecha_viaje: 'DESC' }
    });
  }

  async findAllByUserId(userId: number): Promise<Reserva[]> {
    const user = await this.userRepository.findOne({ where: { usuario_id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return this.reservaRepository.find({
      where: { usuario_id: userId },
      relations: ['usuario', 'frecuencia', 'asiento', 'boleto'],
      order: { fecha_viaje: 'DESC' }
    });
  }

  async remove(id: number): Promise<Reserva> {
    const reserva = await this.findOne(id);
    
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    // Solo se puede cancelar si es depósito y no está confirmada
    if (reserva.metodo_pago === MetodoPago.DEPOSITO && reserva.estado !== EstadoReserva.CONFIRMADA) {
      reserva.estado = EstadoReserva.CANCELADA;
      await this.reservaRepository.save(reserva);
      
      // Si tiene boleto asociado, actualizar el boleto
      if (reserva.boleto_id) {
        const boleto = await this.boletoRepository.findOne({
          where: { boleto_id: reserva.boleto_id },
          relations: ['reservas', 'reservas.asiento']
        });

        if (boleto) {
          // Si hay más de una reserva, solo eliminar los datos de esta reserva
          if (boleto.reservas && boleto.reservas.length > 1) {
            // Actualizar el total y cantidad de asientos
            boleto.total -= reserva.precio;
            boleto.cantidad_asientos--;
            
            // Actualizar la lista de asientos
            const asientosArray = boleto.asientos.split(',');
            const asientoIndex = asientosArray.indexOf(reserva.asiento.numero_asiento.toString());
            if (asientoIndex > -1) {
              asientosArray.splice(asientoIndex, 1);
            }
            boleto.asientos = asientosArray.join(',');

            // Generar nuevo QR con los datos actualizados
            const qrData = {
              total: boleto.total,
              cantidad_asientos: boleto.cantidad_asientos,
              estado: boleto.estado,
              asientos: boleto.asientos
            };

            const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
            const uploadResult = await this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');
            boleto.url_imagen_qr = uploadResult.secure_url;

            await this.boletoRepository.save(boleto);
          } else {
            // Si solo hay una reserva, marcar el boleto como cancelado
            boleto.estado = EstadoBoleto.CANCELADO;
            await this.boletoRepository.save(boleto);
          }
        }
      }

      // Enviar correo de confirmación de cancelación
      const usuario = await this.userRepository.findOne({ where: { usuario_id: reserva.usuario_id } });
      if (usuario) {
        await this.mailService.sendReservationCancellation(usuario.correo, reserva);
      }
      
      return reserva;
    }

    throw new ConflictException('Solo se pueden cancelar reservas con método de pago por depósito y que no estén confirmadas');
  }

  async cancelarReservasPendientes(asientoId: number, fechaViaje: Date): Promise<void> {
    // Buscar reservas pendientes para el mismo asiento y fecha
    const reservasPendientes = await this.reservaRepository.find({
      where: {
        asiento_id: asientoId,
        fecha_viaje: fechaViaje,
        estado: EstadoReserva.PENDIENTE,
        metodo_pago: MetodoPago.DEPOSITO
      }
    });

    // Cancelar cada reserva pendiente usando el método remove
    for (const reserva of reservasPendientes) {
      await this.remove(reserva.reserva_id);
    }
  }

  async calcularPrecio(destinoReserva: string, frecuenciaId: number, asientoId: number): Promise<number> {
    const [frecuencia, asiento] = await Promise.all([
      this.findFrecuenciaWithRutas(frecuenciaId),
      this.findAsientoById(asientoId)
    ]);

    const precioBase = this.calcularPrecioBase(destinoReserva, frecuencia);
    return this.aplicarTarifaAsiento(precioBase, asiento.tipo_asiento);
  }

  async validateReservationCreation(createReservaDto: CreateReservaDto): Promise<void> {
    const [asientoConfirmado, reservaExistente] = await Promise.all([
      this.checkAsientoConfirmado(createReservaDto),
      this.checkReservaExistente(createReservaDto)
    ]);

    if (asientoConfirmado) {
      throw new ConflictException('Este asiento ya está confirmado para esta frecuencia y fecha');
    }

    if (reservaExistente) {
      throw new ConflictException(
        'Ya existe una reserva para este usuario con el mismo destino, fecha, frecuencia y asiento'
      );
    }
  }

  async createReservaEntity(
    dto: CreateReservaDto,
    usuario: User,
    frecuencia: Frecuencia,
    precio: number
  ): Promise<Reserva> {
    const reserva = this.reservaRepository.create({
      ...dto,
      nombre_pasajero: this.formatNombrePasajero(usuario),
      identificacion_pasajero: usuario.identificacion,
      hora_viaje: frecuencia.hora_salida,
      precio,
      estado: this.determinarEstadoInicial(dto.metodo_pago, dto.estado)
    });

    if (this.shouldCreateBoletoForReserva(reserva)) {
      const boletoExistente = await this.buscarBoletoExistente(
        reserva.usuario_id,
        reserva.frecuencia_id,
        reserva.fecha_viaje,
        reserva.destino_reserva
      );

      reserva.boleto_id = boletoExistente?.boleto_id || (await this.crearNuevoBoleto(reserva)).boleto_id;
    }

    return reserva;
  }

  async actualizarBoleto(boletoId: number): Promise<void> {
    const boleto = await this.boletoRepository.findOne({
      where: { boleto_id: boletoId },
      relations: ['reservas']
    });

    if (!boleto) return;

    const numerosAsientos = await this.obtenerNumerosAsientos(boleto.reservas);
    const hayReservaPorDeposito = this.tieneReservaPorDeposito(boleto.reservas);

    const qrData = await this.generarQRData(boleto, numerosAsientos, hayReservaPorDeposito);
    const uploadResult = await this.generarYSubirQR(qrData);

    await this.actualizarDatosBoleto(boleto, numerosAsientos, hayReservaPorDeposito, uploadResult.secure_url);
  }

  private formatNombrePasajero(usuario: User): string {
    return `${usuario.primer_nombre} ${usuario.segundo_nombre}`.trim();
  }

  private determinarEstadoInicial(metodoPago: MetodoPago, estado?: EstadoReserva): EstadoReserva {
    if (metodoPago === MetodoPago.PRESENCIAL || metodoPago === MetodoPago.PAYPAL) {
      return EstadoReserva.CONFIRMADA;
    }
    if (metodoPago === MetodoPago.DEPOSITO) {
      return EstadoReserva.PENDIENTE;
    }
    return estado || EstadoReserva.PENDIENTE;
  }

  private shouldCreateBoletoForReserva(reserva: Reserva): boolean {
    return reserva.metodo_pago === MetodoPago.DEPOSITO || 
           reserva.metodo_pago === MetodoPago.PRESENCIAL || 
           reserva.metodo_pago === MetodoPago.PAYPAL || 
           reserva.estado === EstadoReserva.CONFIRMADA;
  }

  private shouldCreateBoleto(estadoAnterior: EstadoReserva, estadoNuevo: EstadoReserva): boolean {
    return estadoAnterior !== EstadoReserva.CONFIRMADA && estadoNuevo === EstadoReserva.CONFIRMADA;
  }

  private async generarQRData(boleto: Boleto, asientos: string, hayReservaPorDeposito: boolean): Promise<QRCodeData> {
    const esPagoPresencial = boleto.reservas.some(reserva => 
      reserva.metodo_pago === MetodoPago.PRESENCIAL || 
      reserva.metodo_pago === MetodoPago.PAYPAL
    );

    return {
      total: boleto.reservas.reduce((sum, reserva) => sum + reserva.precio, 0),
      cantidad_asientos: boleto.reservas.length,
      estado: hayReservaPorDeposito ? EstadoBoleto.PENDIENTE : EstadoBoleto.PAGADO,
      asientos,
      mensaje: hayReservaPorDeposito ? 'NO VÁLIDO - PENDIENTE DE PAGO' : 
               esPagoPresencial ? 'VÁLIDO - PAGO PRESENCIAL/PAYPAL' : undefined
    };
  }

  private async generarYSubirQR(qrData: QRCodeData) {
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
    return this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');
  }

  private tieneReservaPorDeposito(reservas: Reserva[]): boolean {
    return reservas.some(reserva => reserva.metodo_pago === MetodoPago.DEPOSITO);
  }

  private async actualizarDatosBoleto(
    boleto: Boleto,
    asientos: string,
    hayReservaPorDeposito: boolean,
    urlImagenQR: string
  ): Promise<void> {
    Object.assign(boleto, {
      asientos,
      cantidad_asientos: boleto.reservas.length,
      total: boleto.reservas.reduce((sum, reserva) => sum + reserva.precio, 0),
      estado: hayReservaPorDeposito ? EstadoBoleto.PENDIENTE : EstadoBoleto.PAGADO,
      url_imagen_qr: urlImagenQR
    });

    await this.boletoRepository.save(boleto);
  }

  private async findUserById(userId: number): Promise<User> {
    const usuario = await this.userRepository.findOne({ where: { usuario_id: userId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    return usuario;
  }

  private async findFrecuenciaById(frecuenciaId: number): Promise<Frecuencia> {
    const frecuencia = await this.frecuenciaRepository.findOne({
      where: { frecuencia_id: frecuenciaId }
    });
    if (!frecuencia) {
      throw new NotFoundException(`Frecuencia con ID ${frecuenciaId} no encontrada`);
    }
    return frecuencia;
  }

  private async findFrecuenciaWithRutas(frecuenciaId: number): Promise<Frecuencia> {
    const frecuencia = await this.frecuenciaRepository.findOne({
      where: { frecuencia_id: frecuenciaId },
      relations: { rutas: { parada: true } },
    });
    if (!frecuencia) {
      throw new NotFoundException(`Frecuencia con ID ${frecuenciaId} no encontrada`);
    }
    return frecuencia;
  }

  private async findAsientoById(asientoId: number): Promise<Asiento> {
    const asiento = await this.asientoRepository.findOne({ where: { asiento_id: asientoId } });
    if (!asiento) {
      throw new NotFoundException(`Asiento con ID ${asientoId} no encontrado`);
    }
    return asiento;
  }

  private calcularPrecioBase(destinoReserva: string, frecuencia: Frecuencia): number {
    const precioBase = destinoReserva === frecuencia.destino
      ? frecuencia.total
      : frecuencia.rutas.find(r => r.parada.ciudad === destinoReserva)?.precio_parada;

    if (precioBase === undefined) {
      throw new NotFoundException(`Destino ${destinoReserva} no encontrado en la ruta`);
    }

    return precioBase;
  }

  private aplicarTarifaAsiento(precioBase: number, tipoAsiento: Asientos): number {
    return tipoAsiento === Asientos.VIP ? precioBase * 1.4 : precioBase;
  }

  private async obtenerNumerosAsientos(reservas: Reserva[]): Promise<string> {
    const numerosAsientos = await Promise.all(
      reservas.map(async reserva => {
        const asiento = await this.asientoRepository.findOne({
          where: { asiento_id: reserva.asiento_id }
        });
        return asiento.numero_asiento;
      })
    );
    return numerosAsientos.sort((a, b) => a - b).join(',');
  }

  private async checkAsientoConfirmado(dto: CreateReservaDto): Promise<boolean> {
    const asientoConfirmado = await this.reservaRepository.findOne({
      where: {
        frecuencia_id: dto.frecuencia_id,
        fecha_viaje: dto.fecha_viaje,
        asiento_id: dto.asiento_id,
        estado: EstadoReserva.CONFIRMADA
      }
    });
    return !!asientoConfirmado;
  }

  private async checkReservaExistente(dto: CreateReservaDto): Promise<boolean> {
    const reservaExistente = await this.reservaRepository.findOne({
      where: {
        usuario_id: dto.usuario_id,
        frecuencia_id: dto.frecuencia_id,
        fecha_viaje: dto.fecha_viaje,
        destino_reserva: dto.destino_reserva,
        asiento_id: dto.asiento_id
      }
    });
    return !!reservaExistente;
  }

  private async updateReservaDetails(reserva: Reserva, updateDto: UpdateReservaDto): Promise<void> {
    if (updateDto.usuario_id) {
      const usuario = await this.findUserById(updateDto.usuario_id);
      reserva.nombre_pasajero = this.formatNombrePasajero(usuario);
      reserva.identificacion_pasajero = usuario.identificacion;
    }

    if (updateDto.frecuencia_id) {
      const frecuencia = await this.findFrecuenciaById(updateDto.frecuencia_id);
      reserva.hora_viaje = frecuencia.hora_salida;
    }

    Object.assign(reserva, updateDto);
  }

  private async handleBoletoCreation(reserva: Reserva): Promise<void> {
    const boletoExistente = await this.buscarBoletoExistente(
      reserva.usuario_id,
      reserva.frecuencia_id,
      reserva.fecha_viaje,
      reserva.destino_reserva
    );

    reserva.boleto_id = boletoExistente?.boleto_id || (await this.crearNuevoBoleto(reserva)).boleto_id;
  }

  private async buscarBoletoExistente(
    usuarioId: number,
    frecuenciaId: number,
    fechaViaje: Date,
    destinoReserva: string
  ): Promise<Boleto | null> {
    const reservaExistente = await this.reservaRepository.findOne({
      where: [
        {
          usuario_id: usuarioId,
          frecuencia_id: frecuenciaId,
          fecha_viaje: fechaViaje,
          destino_reserva: destinoReserva,
          estado: EstadoReserva.CONFIRMADA,
        },
        {
          usuario_id: usuarioId,
          frecuencia_id: frecuenciaId,
          fecha_viaje: fechaViaje,
          destino_reserva: destinoReserva,
          estado: EstadoReserva.PENDIENTE,
          metodo_pago: MetodoPago.DEPOSITO,
        }
      ],
      relations: ['boleto'],
    });

    return reservaExistente?.boleto || null;
  }

  private async crearNuevoBoleto(reserva: Reserva): Promise<Boleto> {
    const asiento = await this.findAsientoById(reserva.asiento_id);
    const qrData = await this.generarQRData({
      total: reserva.precio,
      cantidad_asientos: 1,
      asientos: asiento.numero_asiento.toString(),
      reservas: [reserva]
    } as Boleto, asiento.numero_asiento.toString(), reserva.metodo_pago === MetodoPago.DEPOSITO);

    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
    const uploadResult = await this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');

    const boleto = this.boletoRepository.create({
      total: reserva.precio,
      cantidad_asientos: 1,
      estado: reserva.metodo_pago === MetodoPago.DEPOSITO ? EstadoBoleto.PENDIENTE : EstadoBoleto.PAGADO,
      asientos: asiento.numero_asiento.toString(),
      url_imagen_qr: uploadResult.secure_url,
    });

    return this.boletoRepository.save(boleto);
  }

  private async handleFacturaCreation(reserva: Reserva): Promise<void> {
    // Si el método de pago no es PRESENCIAL o PAYPAL, no crear factura
    if (reserva.metodo_pago !== MetodoPago.PRESENCIAL && reserva.metodo_pago !== MetodoPago.PAYPAL) {
      return;
    }

    // Buscar si ya existe una factura para este boleto
    const facturaExistente = await this.facturaService.findByReservaId(reserva.reserva_id);
    
    if (!facturaExistente) {
      // Si no existe factura, crear una nueva
      await this.facturaService.create({
        boleto_id: reserva.boleto_id,
        reservaId: reserva.reserva_id,
        usuarioId: reserva.usuario_id,
        cooperativaId: 1 // Valor fijo como especificado
      });
    }
  }

  private async actualizarFactura(boletoId: number): Promise<void> {
    const boleto = await this.boletoRepository.findOne({
      where: { boleto_id: boletoId },
      relations: ['reservas']
    });

    if (!boleto) return;

    // Buscar la factura asociada a cualquiera de las reservas del boleto
    for (const reserva of boleto.reservas) {
      const factura = await this.facturaService.findByReservaId(reserva.reserva_id);
      if (factura) {
        // Actualizar la factura con los nuevos datos del boleto
        await this.facturaService.create({
          boleto_id: boleto.boleto_id,
          reservaId: reserva.reserva_id,
          usuarioId: reserva.usuario_id,
          cooperativaId: 1
        });
        break; // Solo necesitamos actualizar una vez
      }
    }
  }
}