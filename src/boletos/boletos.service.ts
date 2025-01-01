import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Boleto } from './entities/boleto.entity';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EstadoReserva } from '../common/enums/reserva.enum';
import { EstadoBoleto } from 'src/common/enums/boletos.enum';

@Injectable()
export class BoletosService {

  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    private readonly cloudinaryService: CloudinaryService
  ){}

  async create(createBoletoDto: CreateBoletoDto) {
    // Generar datos para el QR
    const qrData = {
      total: createBoletoDto.total ,
      cantidad_asientos: createBoletoDto.cantidad_asientos,
      estado: createBoletoDto.estado,
      asientos: createBoletoDto.asientos 
    };

    // Generar QR como Buffer
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));

    // Subir el QR a Cloudinary
    const uploadResult = await this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');

    // Asignar la URL del QR al DTO
    createBoletoDto.url_imagen_qr = uploadResult.secure_url;

    // Guardar el boleto con la URL del QR
    return this.boletoRepository.save(createBoletoDto);
  }

  async findAll() {
    const boletos = await this.boletoRepository.find();
    if(!boletos.length){
      throw new NotFoundException('No se encontraron boletos');
    }
    return boletos;
  }

  async findAllByUserId(userId: number) {
    const boletos = await this.boletoRepository
      .createQueryBuilder('boleto')
      .innerJoinAndSelect('boleto.reservas', 'reserva')
      .where('reserva.usuario_id = :userId', { userId })
      .orderBy('boleto.fecha_emision', 'DESC')
      .getMany();

    if (!boletos.length) {
      throw new NotFoundException(`No se encontraron boletos para el usuario con ID ${userId}`);
    }

    return boletos;
  }

  async findOne(id: number) {
    const boleto = await this.boletoRepository.findOne({
      where: { boleto_id: id },
      relations: ['reservas', 'reservas.asiento']
    });
    if(!boleto){
      throw new NotFoundException('No se encontro el boleto');
    }
    return boleto;
  }

  async findByReservaId(reservaId: number) {
    const boleto = await this.boletoRepository
      .createQueryBuilder('boleto')
      .innerJoinAndSelect('boleto.reservas', 'reserva')
      .where('reserva.reserva_id = :reservaId', { reservaId })
      .getOne();

    if (!boleto) {
      throw new NotFoundException(`No se encontró boleto para la reserva con ID ${reservaId}`);
    }

    return boleto;
  }

  update(id: number, updateBoletoDto: UpdateBoletoDto) {
    return `This action updates a #${id} boleto`;
  }

  async remove(id: number) {
    const boleto = await this.boletoRepository.findOne({
      where: { boleto_id: id },
      relations: ['reservas', 'reservas.asiento']
    });

    if (!boleto) {
      throw new NotFoundException(`Boleto con ID ${id} no encontrado`);
    }

    // Si hay dos reservas, solo eliminar los datos de la reserva cancelada
    if (boleto.reservas && boleto.reservas.length > 1) {
      const reservaCancelada = boleto.reservas.find(r => r.estado === EstadoReserva.CANCELADA);
      if (reservaCancelada) {
        // Actualizar el total y cantidad de asientos
        boleto.total -= reservaCancelada.precio;
        boleto.cantidad_asientos--;
        
        // Actualizar la lista de asientos
        const asientosArray = boleto.asientos.split(',');
        const asientoIndex = asientosArray.indexOf(reservaCancelada.asiento.numero_asiento.toString());
        if (asientoIndex > -1) {
          asientosArray.splice(asientoIndex, 1);
        }
        boleto.asientos = asientosArray.join(',');

        // Generar nuevo QR con datos actualizados
        const qrData = {
          total: boleto.total,
          cantidad_asientos: boleto.cantidad_asientos,
          estado: boleto.estado,
          asientos: boleto.asientos
        };

        const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
        const uploadResult = await this.cloudinaryService.uploadBuffer(qrBuffer, 'boletos');
        boleto.url_imagen_qr = uploadResult.secure_url;

        return this.boletoRepository.save(boleto);
      }
    }

    boleto.estado = EstadoBoleto.CANCELADO;

    return this.boletoRepository.save(boleto);
  }
}
