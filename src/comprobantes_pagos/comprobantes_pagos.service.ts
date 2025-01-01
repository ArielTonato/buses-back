import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';
import { ComprobantePago } from './entities/comprobantes_pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from '../user/entities/user.entity';
import { Boleto } from 'src/boletos/entities/boleto.entity';
import { EstadoBoleto } from '../common/enums/boletos.enum';
import { EstadoComprobante } from '../common/enums/comprobantes.enum';
import { EstadoReserva } from '../common/enums/reserva.enum';
import { MailService } from '../mail/mail.service';
import { Reserva } from 'src/reserva/entities/reserva.entity';
import * as QRCode from 'qrcode';
import { FacturaService } from '../factura/factura.service';

@Injectable()
export class ComprobantesPagosService {
  constructor(
    @InjectRepository(ComprobantePago)
    private readonly comprobantePagoRepository: Repository<ComprobantePago>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
    private readonly facturaService: FacturaService,
  ) {}

  /**
   * Verifica si el usuario y el boleto pertenecen a la misma reserva
   * @param usuario_id ID del usuario
   * @param boleto_id ID del boleto
   */
  private async verificarUsuarioBoletoReserva(usuario_id: number, boleto_id: number): Promise<boolean> {
    const boleto = await this.boletoRepository.findOne({
      where: { boleto_id },
      relations: ['reservas', 'reservas.usuario']
    });

    if (!boleto) {
      throw new NotFoundException(`No se encontró el boleto con ID ${boleto_id}`);
    }

    // Verificar que el boleto no esté cancelado
    if (boleto.estado === EstadoBoleto.CANCELADO) {
      throw new BadRequestException('No se puede crear un comprobante para un boleto cancelado');
    }

    // Verificar si alguna reserva del boleto pertenece al usuario
    const reservaUsuario = boleto.reservas.some(reserva => reserva.usuario.usuario_id === usuario_id);
    
    if (!reservaUsuario) {
      throw new BadRequestException('El usuario no tiene una reserva asociada a este boleto');
    }

    return true;
  }

  /**
   * Crea un nuevo comprobante de pago.
   * @param createComprobantesPagoDto Datos del comprobante.
   * @param file Archivo del comprobante.
   */
  async create(createComprobantesPagoDto: CreateComprobantesPagoDto, file: Express.Multer.File) {
    // Verificar que el usuario exista
    const usuario = await this.userRepository.findOneBy({ usuario_id: createComprobantesPagoDto.usuario_id });
    if (!usuario) {
      throw new NotFoundException(`No se encontró el usuario con ID ${createComprobantesPagoDto.usuario_id}`);
    }

    // Verificar que el boleto exista
    const boleto = await this.boletoRepository.findOneBy({ boleto_id: createComprobantesPagoDto.boleto_id });
    if (!boleto) {
      throw new NotFoundException(`No se encontró el boleto con ID ${createComprobantesPagoDto.boleto_id}`);
    }

    // Verificar que el usuario y el boleto pertenezcan a la misma reserva
    await this.verificarUsuarioBoletoReserva(createComprobantesPagoDto.usuario_id, createComprobantesPagoDto.boleto_id);

    const cloudinaryResponse = await this.cloudinaryService.upload(file);
    createComprobantesPagoDto.url_comprobante = cloudinaryResponse.secure_url;
    return this.comprobantePagoRepository.save(createComprobantesPagoDto);
  }

  /**
   * Obtiene todos los comprobantes de pago.
   */
  async findAll() {
    const comprobantes = await this.comprobantePagoRepository.find({
      relations: {
        usuario: true
      },
      select: {
        usuario: {
          primer_nombre: true,
          primer_apellido: true
        }
      }
    });
    
    if (!comprobantes.length) {
      throw new NotFoundException('No se encontraron comprobantes de pago');
    }
    return comprobantes;
  }

  /**
   * Obtiene un comprobante de pago por ID.
   * @param id Identificador del comprobante.
   */
  async findOne(id: number) {
    const comprobante = await this.comprobantePagoRepository.findOne({
      where: { comprobante_id: id },
      relations: {
        usuario: true
      },
      select: {
        usuario: {
          primer_nombre: true,
          primer_apellido: true
        }
      }
    });
    if (!comprobante) {
      throw new NotFoundException('No se encontró el comprobante de pago');
    }
    return comprobante;
  }

  /**
   * Actualiza el estado del boleto y la reserva cuando se aprueba el comprobante
   * @param boleto_id ID del boleto
   */
  private async actualizarEstadosBoletoReserva(boleto_id: number): Promise<void> {
    const boleto = await this.boletoRepository.findOne({
      where: { boleto_id },
      relations: ['reservas', 'reservas.asiento']
    });

    if (!boleto) {
      throw new NotFoundException(`No se encontró el boleto con ID ${boleto_id}`);
    }

    // Actualizar estado del boleto
    boleto.estado = EstadoBoleto.PAGADO;

    // Obtener los números de asientos
    const numerosAsientos = boleto.reservas
      .map(reserva => reserva.asiento.numero_asiento)
      .sort((a, b) => a - b)
      .join(',');

    // Generar nuevo QR con estado actualizado
    const qrData = {
      total: boleto.reservas.reduce((sum, reserva) => sum + reserva.precio, 0),
      cantidad_asientos: boleto.reservas.length,
      estado: EstadoBoleto.PAGADO,
      asientos: numerosAsientos,
      mensaje: 'VÁLIDO - PAGO CONFIRMADO'
    };

    // Generar y subir nuevo QR
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
    const uploadResult = await this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');
    
    // Actualizar URL del QR
    boleto.url_imagen_qr = uploadResult.secure_url;
    await this.boletoRepository.save(boleto);

    // Actualizar estado de las reservas, generar factura y enviar correos
    for (const reserva of boleto.reservas) {
      reserva.estado = EstadoReserva.CONFIRMADA;
      await this.reservaRepository.save(reserva);

      // Buscar el usuario para enviar el correo
      const usuario = await this.userRepository.findOneBy({ usuario_id: reserva.usuario_id });
      if (usuario) {
        await this.mailService.sendReservationConfirmation(usuario.correo, {
          name: `${usuario.primer_nombre} ${usuario.primer_apellido}`,
          reservationId: reserva.reserva_id
        });
      }
    }

    // Generar factura con la primera reserva del boleto
    const primeraReserva = boleto.reservas[0];
    await this.facturaService.create({
      boleto_id: boleto.boleto_id,
      reservaId: primeraReserva.reserva_id,
      usuarioId: primeraReserva.usuario_id,
      cooperativaId: 1
    });
  }

  /**
   * Actualiza un comprobante de pago.
   * @param id Identificador del comprobante.
   * @param updateComprobantesPagoDto Datos actualizados del comprobante (solo estado, comentarios y url_comprobante).
   */
  async update(id: number, updateComprobantesPagoDto: UpdateComprobantesPagoDto) {
    const comprobante = await this.findOne(id);
    
    // Si el estado se está actualizando a APROBADO
    if (updateComprobantesPagoDto.estado === EstadoComprobante.APROBADO) {
      await this.actualizarEstadosBoletoReserva(comprobante.boleto_id);
    }
    // Si el estado se está actualizando a RECHAZADO
    else if (updateComprobantesPagoDto.estado === EstadoComprobante.RECHAZADO) {
      const boleto = await this.boletoRepository.findOne({
        where: { boleto_id: comprobante.boleto_id },
        relations: ['reservas', 'reservas.usuario']
      });

      if (boleto && boleto.reservas) {
        for (const reserva of boleto.reservas) {
          const usuario = await this.userRepository.findOneBy({ usuario_id: reserva.usuario_id });
          if (usuario) {
            await this.mailService.sendPaymentRejected(usuario.correo, {
              name: `${usuario.primer_nombre} ${usuario.primer_apellido}`,
              reason: updateComprobantesPagoDto.comentarios,
              reservationId: reserva.reserva_id,
              ticketId: boleto.boleto_id
            });
          }
        }
      }
    }

    // Actualizar el comprobante
    Object.assign(comprobante, updateComprobantesPagoDto);
    return this.comprobantePagoRepository.save(comprobante);
  }

  /**
   * Elimina un comprobante de pago por ID.
   * @param id Identificador del comprobante.
   */
  async remove(id: number) {
    await this.findOne(id); // Verifica que el comprobante exista antes de eliminarlo
    await this.comprobantePagoRepository.delete(id);
    return { message: 'Comprobante de pago eliminado correctamente' };
  }

  /** 
   * Obtiene todos los comprobantes de pago de un usuario.
   * @param id Identificador del usuario.
   */
  async findAllByUser(id: number) {
    const comprobantes = await this.comprobantePagoRepository.find({
      where: { usuario_id: id },
      relations: {
        usuario: true
      },
      select: {
        usuario: {
          primer_nombre: true,
          primer_apellido: true
        }
      }
    });
    
    if (!comprobantes.length) {
      throw new NotFoundException('No se encontraron comprobantes de pago para el usuario');
    }
    return comprobantes;
  }

  /**
   *  Obtener la cantidad de comprobantes de pago en total.
   */
  async count() {
    const count = await this.comprobantePagoRepository.count();
    return {
      cantidad: count
    }
  }
}