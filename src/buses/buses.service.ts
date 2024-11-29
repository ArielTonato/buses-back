import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Repository } from 'typeorm';
import { BusesFoto } from 'src/buses-fotos/entities/buses-foto.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BusesService {
  
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @InjectRepository(BusesFoto)
    private readonly busesFotoRepository: Repository<BusesFoto>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(createBusDto: CreateBusDto, files?: Express.Multer.File[]) {
    const bus = await this.findOneByPlaca(createBusDto.placa);
    if (bus) {
      throw new ConflictException('Ya existe un bus con esa placa');
    }

    // Crear el bus
    const newBus = await this.busRepository.save(createBusDto);

    // Si hay archivos, subirlos a Cloudinary y crear los registros de fotos
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => this.cloudinaryService.upload(file));
      const uploadResults = await Promise.all(uploadPromises);

      const fotosPromises = uploadResults.map(result => 
        this.busesFotoRepository.save({
          url: result.secure_url,
          public_id: result.public_id,
          bus_id: newBus.bus_id
        })
      );

      await Promise.all(fotosPromises);
    }

    // Retornar el bus con sus fotos
    return this.findOne(newBus.bus_id);
  }

  findAll() {
    return this.busRepository.find({
      relations:{
        fotos: true
      }
    });
  }

   findOneByPlaca(placa: string) {
    return this.busRepository.findOne({
      where: { placa },
      relations: {
        fotos: true
      }
    });
  }

  async findOneByPlacaNoValidation(placa: string) {
    const bus = await this.busRepository.findOne({
      where: { placa },
      relations: {
        fotos: true
      }
    });
    if (!bus) {
      throw new ConflictException('El bus no existe');
    }
    return bus;
  }

  findOne(id: number) {
    return this.busRepository.findOne({
      where: { bus_id: id },
      relations: {
        fotos: true
      }
    });
  }

  async update(id: number, updateBusDto: UpdateBusDto) {
    const bus = await this.findOne(id);
    if (!bus) {
      throw new ConflictException('El bus no existe');
    }
    const busExists = await this.findOneByPlaca(updateBusDto.placa);
    if (busExists && busExists.bus_id !== id) {
      throw new ConflictException('Ya existe un bus con esa placa');
    }
    await this.busRepository.update(id, updateBusDto);
    return {message: "Bus Actualizado"};
  }
  //Si un bus no esta activo no se puede asignar a una frecuencia

  async remove(id: number) {
    const bus = await this.busRepository.findOneBy({bus_id: id});
    if (!bus) {
      throw new ConflictException('El bus no existe');
    }

   await this.busRepository.delete({
      bus_id: id
    });
    return {message: "Bus Eliminado"};
  }
}
