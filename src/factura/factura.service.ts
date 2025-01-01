import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Factura } from './entities/factura.entity';
import { PdfGeneratorService } from '../utils/pdf-generator.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Boleto } from '../boletos/entities/boleto.entity';
import { Cooperativa } from '../cooperativa/entities/cooperativa.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    @InjectRepository(Cooperativa)
    private readonly cooperativaRepository: Repository<Cooperativa>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly pdfGeneratorService: PdfGeneratorService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    // Obtener todas las entidades necesarias con sus relaciones
    const [boleto, cooperativa, reserva, usuario] = await Promise.all([
      this.boletoRepository.findOne({
        where: { boleto_id: createFacturaDto.boleto_id }
      }),
      this.cooperativaRepository.findOne({
        where: { cooperativa_id: createFacturaDto.cooperativaId || 1 }
      }),
      this.reservaRepository.findOne({
        where: { reserva_id: createFacturaDto.reservaId },
        relations: ['frecuencia', 'frecuencia.bus', 'asiento']
      }),
      this.userRepository.findOne({
        where: { usuario_id: createFacturaDto.usuarioId }
      })
    ]);

    // Validar que existan todas las entidades
    if (!boleto) {
      throw new NotFoundException(`Boleto con ID ${createFacturaDto.boleto_id} no encontrado`);
    }
    if (!cooperativa) {
      throw new NotFoundException(`Cooperativa con ID ${createFacturaDto.cooperativaId || 1} no encontrada`);
    }
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${createFacturaDto.reservaId} no encontrada`);
    }
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createFacturaDto.usuarioId} no encontrado`);
    }

    // Generar número de factura único
    const numeroFactura = await this.generateFacturaNumber();

    // Crear la factura con todas las relaciones
    const factura = this.facturaRepository.create({
      numeroFactura,
      subtotal: boleto.total,
      iva: 0,
      total: boleto.total,
      reserva: reserva,
      usuario: usuario,
      cooperativa: cooperativa,
      boleto: boleto,
      reservaId: reserva.reserva_id,
      usuarioId: usuario.usuario_id,
      cooperativaId: cooperativa.cooperativa_id,
      boleto_id: boleto.boleto_id
    });

    // Guardar la factura
    const facturaGuardada = await this.facturaRepository.save(factura);

    // Generar PDF usando los datos correctos del boleto
    const pdfBuffer = await this.pdfGeneratorService.generateTicket({
      cooperativa: cooperativa.nombre,
      direccion: cooperativa.direccion,
      ruc: cooperativa.ruc,
      fechaViaje: reserva.fecha_viaje.toISOString().split('T')[0],
      horaViaje: reserva.frecuencia.hora_salida,
      asientos: boleto.asientos, // Usar directamente los asientos del boleto
      numeroAutobus: reserva.frecuencia.bus.numero_bus.toString(),
      tipoPago: reserva.metodo_pago,
      identificacionUsuario: usuario.identificacion,
      nombreUsuario: reserva.nombre_pasajero,
      destino: reserva.destino_reserva,
      cantidad: boleto.cantidad_asientos, // Usar la cantidad de asientos del boleto
      precioUnitario: boleto.total / boleto.cantidad_asientos, // Calcular el precio unitario correctamente
    });

    // Subir PDF a Cloudinary
    const cloudinaryResponse = await this.cloudinaryService.uploadBuffer(
      pdfBuffer,
      'facturas'
    );

    // Actualizar factura con URL del PDF
    await this.facturaRepository.update(facturaGuardada.id, {
      pdfUrl: cloudinaryResponse.secure_url,
    });

    return this.facturaRepository.findOne({
      where: { id: facturaGuardada.id },
      relations: ['reserva', 'usuario', 'cooperativa', 'boleto']
    });
  }

  async findAll(): Promise<Factura[]> {
    return this.facturaRepository.find();
  }

  async findByUser(usuarioId: number): Promise<Factura[]> {
    return this.facturaRepository.find({
      where: { usuarioId }
    });
  }

  async findOne(id: string): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id },
      relations: [
        'reserva',
        'usuario',
        'cooperativa',
        'boleto',
        'reserva.frecuencia',
        'reserva.frecuencia.bus'
      ]
    });

    if (!factura) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    return factura;
  }

  async findByReservaId(reservaId: number): Promise<Factura | null> {
    return this.facturaRepository.findOne({
      where: { reservaId },
      relations: ['reserva', 'usuario', 'cooperativa', 'boleto']
    });
  }

  private async generateFacturaNumber(): Promise<string> {
    const count = await this.facturaRepository.count();
    return `F-${(count + 1).toString().padStart(8, '0')}`;
  }

  private async generatePdf(factura: Factura): Promise<Buffer> {
    if (!factura.cooperativa || !factura.reserva || !factura.boleto) {
      throw new NotFoundException('Faltan datos necesarios para generar el PDF');
    }

    return this.pdfGeneratorService.generateTicket({
      cooperativa: factura.cooperativa.nombre,
      direccion: factura.cooperativa.direccion,
      ruc: factura.cooperativa.ruc,
      fechaViaje: factura.reserva.fecha_viaje.toISOString().split('T')[0],
      horaViaje: factura.reserva.frecuencia.hora_salida,
      asientos: factura.boleto.asientos,
      numeroAutobus: factura.reserva.frecuencia.bus.numero_bus.toString(),
      tipoPago: factura.reserva.metodo_pago,
      identificacionUsuario: factura.usuario.identificacion,
      nombreUsuario: factura.reserva.nombre_pasajero,
      destino: factura.reserva.destino_reserva,
      cantidad: factura.boleto.cantidad_asientos,
      precioUnitario: factura.subtotal / factura.boleto.cantidad_asientos,
    });
  }
}
