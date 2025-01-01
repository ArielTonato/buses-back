import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Repository } from 'typeorm';
import { BusesFoto } from 'src/buses-fotos/entities/buses-foto.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Asiento } from 'src/asientos/entities/asiento.entity';
import { Asientos } from 'src/common/enums/asientos.enum';

@Injectable()
export class BusesService {
  
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @InjectRepository(BusesFoto)
    private readonly busesFotoRepository: Repository<BusesFoto>,
    @InjectRepository(Asiento)
    private readonly asientoRepository: Repository<Asiento>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  private async createAsientos(bus: Bus) {
    let numeroAsiento = 1;
    
    // Crear asientos normales
    for (let i = 0; i < bus.total_asientos_normales; i++) {
      await this.asientoRepository.save({
        tipo_asiento: Asientos.NORMAL,
        numero_asiento: numeroAsiento++,
        bus: bus
      });
    }

    // Crear asientos VIP
    for (let i = 0; i < bus.total_asientos_vip; i++) {
      await this.asientoRepository.save({
        tipo_asiento: Asientos.VIP,
        numero_asiento: numeroAsiento++,
        bus: bus
      });
    }
  }

  private async updateAsientos(bus: Bus, newTotalNormales: number, newTotalVip: number) {
    // Obtener todos los asientos actuales del bus
    const asientosActuales = await this.asientoRepository.find({
      where: { bus: { bus_id: bus.bus_id } },
      order: { numero_asiento: 'ASC' }
    });

    const asientosNormales = asientosActuales.filter(a => a.tipo_asiento === Asientos.NORMAL);
    const asientosVip = asientosActuales.filter(a => a.tipo_asiento === Asientos.VIP);

    // Manejar asientos normales
    if (newTotalNormales > asientosNormales.length) {
      // Agregar nuevos asientos normales
      const numeroInicio = asientosNormales.length > 0 
        ? Math.max(...asientosNormales.map(a => a.numero_asiento)) + 1 
        : 1;
      
      for (let i = 0; i < (newTotalNormales - asientosNormales.length); i++) {
        await this.asientoRepository.save({
          tipo_asiento: Asientos.NORMAL,
          numero_asiento: numeroInicio + i,
          bus: bus,
          activo: true
        });
      }
    } else if (newTotalNormales < asientosNormales.length) {
      // Eliminar asientos normales excedentes
      const asientosAEliminar = asientosNormales.slice(newTotalNormales);
      await this.asientoRepository.remove(asientosAEliminar);
    }

    // Manejar asientos VIP
    if (newTotalVip > asientosVip.length) {
      // Agregar nuevos asientos VIP
      const numeroInicio = asientosActuales.length > 0 
        ? Math.max(...asientosActuales.map(a => a.numero_asiento)) + 1 
        : 1;
      
      for (let i = 0; i < (newTotalVip - asientosVip.length); i++) {
        await this.asientoRepository.save({
          tipo_asiento: Asientos.VIP,
          numero_asiento: numeroInicio + i,
          bus: bus,
          activo: true
        });
      }
    } else if (newTotalVip < asientosVip.length) {
      // Eliminar asientos VIP excedentes
      const asientosAEliminar = asientosVip.slice(newTotalVip);
      await this.asientoRepository.remove(asientosAEliminar);
    }

    // Renumerar todos los asientos para mantener la secuencia
    const todosLosAsientos = await this.asientoRepository.find({
      where: { bus: { bus_id: bus.bus_id } },
      order: { tipo_asiento: 'ASC', numero_asiento: 'ASC' }
    });

    let numeroAsiento = 1;
    for (const asiento of todosLosAsientos) {
      asiento.numero_asiento = numeroAsiento++;
      await this.asientoRepository.save(asiento);
    }
  }

  async create(createBusDto: CreateBusDto, files?: Express.Multer.File[]) {
    const bus = await this.findOneByPlaca(createBusDto.placa);
    if (bus) {
      throw new ConflictException('Ya existe un bus con esa placa');
    }

    // Crear el bus
    const newBus = await this.busRepository.save(createBusDto);

    // Crear los asientos
    await this.createAsientos(newBus);

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

    // Si cambiaron la cantidad de asientos, actualizarlos
    if (updateBusDto.total_asientos_normales !== undefined || 
        updateBusDto.total_asientos_vip !== undefined) {
      
      const newTotalNormales = updateBusDto.total_asientos_normales ?? bus.total_asientos_normales;
      const newTotalVip = updateBusDto.total_asientos_vip ?? bus.total_asientos_vip;
      
      await this.updateAsientos(bus, newTotalNormales, newTotalVip);
    }

    await this.busRepository.update(id, updateBusDto);
    return { message: "Bus Actualizado" };
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
