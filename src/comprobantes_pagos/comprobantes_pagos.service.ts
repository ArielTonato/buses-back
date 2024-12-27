import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComprobantesPagoDto } from './dto/create-comprobantes_pago.dto';
import { UpdateComprobantesPagoDto } from './dto/update-comprobantes_pago.dto';
import { ComprobantePago } from './entities/comprobantes_pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ComprobantesPagosService {
  constructor(
    @InjectRepository(ComprobantePago)
    private readonly comprobantePagoRepository: Repository<ComprobantePago>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
   * Actualiza un comprobante de pago.
   * @param id Identificador del comprobante.
   * @param updateComprobantesPagoDto Datos actualizados del comprobante (solo estado, comentarios y url_comprobante).
   */
  async update(id: number, updateComprobantesPagoDto: UpdateComprobantesPagoDto) {
    const comprobante = await this.findOne(id);
    
    // Solo actualizamos los campos permitidos que vengan en el DTO
    const updatedFields: Partial<ComprobantePago> = {};
    
    if (updateComprobantesPagoDto.estado !== undefined) {
      updatedFields.estado = updateComprobantesPagoDto.estado;
      updatedFields.fecha_revision = new Date();
    }
    
    if (updateComprobantesPagoDto.comentarios !== undefined) {
      updatedFields.comentarios = updateComprobantesPagoDto.comentarios;
    }
    
    if (updateComprobantesPagoDto.url_comprobante !== undefined) {
      updatedFields.url_comprobante = updateComprobantesPagoDto.url_comprobante;
    }

    if (Object.keys(updatedFields).length === 0) {
      return {
        message: 'No se proporcionaron campos válidos para actualizar',
        comprobante
      };
    }

    await this.comprobantePagoRepository.update(id, updatedFields);

    return {
      message: 'Comprobante de pago actualizado',
      comprobante: await this.findOne(id)
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
