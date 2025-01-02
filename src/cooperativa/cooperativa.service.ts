import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cooperativa } from './entities/cooperativa.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CooperativaService {
  constructor(
    @InjectRepository(Cooperativa)
    private readonly cooperativaRepository: Repository<Cooperativa>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(createCooperativaDto: CreateCooperativaDto, file: Express.Multer.File) {
    // Verificar si ya existe una cooperativa con el mismo RUC
    const existingCooperativa = await this.cooperativaRepository.findOne({
      where: { ruc: createCooperativaDto.ruc }
    });

    if (existingCooperativa) {
      throw new ConflictException('Ya existe una cooperativa con ese RUC');
    }

    // Subir la imagen a Cloudinary
    const uploadResult = await this.cloudinaryService.upload(file);

    // Crear la cooperativa con la URL de la imagen
    const cooperativa = await this.cooperativaRepository.save({
      ...createCooperativaDto,
      logo: uploadResult.secure_url
    });

    return this.findOne(cooperativa.cooperativa_id);
  }

  async findAll() {
    const [cooperativa] = await this.cooperativaRepository.find({
      take: 1,
      order: {
        cooperativa_id: 'ASC'
      }
    });
    return cooperativa;
  }

  findOne(id: number) {
    return this.cooperativaRepository.findOneBy({ cooperativa_id: id });
  }

  async update(id: number, updateCooperativaDto: UpdateCooperativaDto, file?: Express.Multer.File) {
    const cooperativa = await this.findOne(id);
    if (!cooperativa) {
      throw new Error('Cooperativa no encontrada');
    }

    // Si hay un nuevo archivo de logo, subir a Cloudinary
    if (file) {
      const uploadResult = await this.cloudinaryService.upload(file);
      updateCooperativaDto.logo = uploadResult.secure_url;
    }

    // Actualizar la cooperativa
    await this.cooperativaRepository.update(id, updateCooperativaDto);

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} cooperativa`;
  }
}
