import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';
import { ComprobantePago } from './entities/comprobantes_pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ComprobantesPagosService {

  constructor(
    @InjectRepository(ComprobantePago)
    private comprobantePagoRepository: Repository<ComprobantePago>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createComprobantesPagoDto: CreateComprobantesPagoDto, file: Express.Multer.File) {
    // Subir la imagen a Cloudinary
    const cloudinaryResponse = await this.cloudinaryService.upload(file);
    
    // Asignar la URL de la imagen al DTO
    createComprobantesPagoDto.url_comprobante = cloudinaryResponse.secure_url;
    
    // Guardar el comprobante en la base de datos
    return this.comprobantePagoRepository.save(createComprobantesPagoDto);
  }

  async findAll() {
    const comprobantes = await this.comprobantePagoRepository.find();
    if (!comprobantes) {
      throw new NotFoundException('No se encontraron comprobantes de pago');
    }
    return comprobantes;
  }

  findOne(id: number) {
    return this.comprobantePagoRepository.findOneBy({comprobante_id: id});
  }

  update(id: number, updateComprobantesPagoDto: UpdateComprobantesPagoDto) {
    return `This action updates a #${id} comprobantesPago`;
  }

  remove(id: number) {
    return `This action removes a #${id} comprobantesPago`;
  }
}
