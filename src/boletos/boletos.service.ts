import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Boleto } from './entities/boleto.entity';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

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

  async findOne(id: number) {
    const boleto = await this.boletoRepository.findOne({
      where: { boleto_id: id }
    });
    if(!boleto){
      throw new NotFoundException('No se encontro el boleto');
    }
    return boleto;
  }

  update(id: number, updateBoletoDto: UpdateBoletoDto) {
    return `This action updates a #${id} boleto`;
  }

  remove(id: number) {
    //El boleto se elimina cuando se elimina la reserva
    //El boleto cuando se cancela  libera los asientos
    //Solo se puede eliminar el boleto si es un dia antes de la fecha de viaje de reserva 
    //Un boleto no se puede eliminar se elimina cuando se elimina la reserva
    return `This action removes a #${id} boleto`;
  }
}
