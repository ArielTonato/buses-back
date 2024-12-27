import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly comprobantePagoRepository: Repository<ComprobantePago>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Crea un nuevo comprobante de pago.
   * @param createComprobantesPagoDto Datos del comprobante.
   * @param file Archivo del comprobante.
   */
  async create(createComprobantesPagoDto: CreateComprobantesPagoDto, file: Express.Multer.File) {
    const cloudinaryResponse = await this.cloudinaryService.upload(file);
    createComprobantesPagoDto.url_comprobante = cloudinaryResponse.secure_url;
    return this.comprobantePagoRepository.save(createComprobantesPagoDto);
  }

  /**
   * Obtiene todos los comprobantes de pago.
   */
  async findAll() {
    const comprobantes = await this.comprobantePagoRepository.find();
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
    const comprobante = await this.comprobantePagoRepository.findOneBy({ comprobante_id: id });
    if (!comprobante) {
      throw new NotFoundException('No se encontró el comprobante de pago');
    }
    return comprobante;
  }

  /**
   * Actualiza un comprobante de pago.
   * @param id Identificador del comprobante.
   * @param updateComprobantesPagoDto Datos actualizados del comprobante.
   */
  async update(id: number, updateComprobantesPagoDto: UpdateComprobantesPagoDto) {
    const comprobante = await this.findOne(id);

    const updatedFields = {
      ...updateComprobantesPagoDto,
      fecha_revision: updateComprobantesPagoDto.estado ? new Date() : comprobante.fecha_revision,
    };

    await this.comprobantePagoRepository.update(id, updatedFields);

    return {
      message: 'Comprobante de pago actualizado',
      comprobante: await this.findOne(id),
    };
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
}
