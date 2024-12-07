import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';
import { Frecuencia } from './entities/frecuencia.entity';
import { User } from '../user/entities/user.entity';
import { Bus } from '../buses/entities/bus.entity';

@Injectable()
export class FrecuenciasService {
  constructor(
    @InjectRepository(Frecuencia)
    private readonly frecuenciaRepository: Repository<Frecuencia>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  async create(createFrecuenciaDto: CreateFrecuenciaDto) {
    const { conductor_id, hora_salida, hora_llegada, bus_id } = createFrecuenciaDto;

    await this.validateBus(bus_id);
    await this.validateConductor(conductor_id);
    this.validateHoras(hora_salida, hora_llegada);

    const conductorFrecuencias = await this.fetchConductorFrecuencias(conductor_id);
    const busFrecuencias = await this.fetchBusFrecuencias(bus_id);

    this.validateConductorSolapamiento(conductorFrecuencias, hora_salida, hora_llegada);
    this.validateBusSolapamiento(busFrecuencias, hora_salida, hora_llegada);

    return this.frecuenciaRepository.save(createFrecuenciaDto);
  }

  async findAll() {
    const frecuencias = await this.frecuenciaRepository.find({
      where: { activo: true },
      relations: {
        conductor: true,
        bus: {
          fotos: true,
        },
        rutas: {
          parada: true,
        },
      },
      order: {
        rutas: {
          orden: 'ASC',
        },
      },
    });

    // Procesar cada frecuencia para mostrar rutas solo si NO es directo
    return frecuencias.map(frecuencia => {
      if (frecuencia.es_directo) {
        // Si es directo, no mostrar rutas
        frecuencia.rutas = [];
      }
      return frecuencia;
    });
  }

  async findByDestino(destino: string) {
    const frecuencias = await this.frecuenciaRepository.find({
      where: { destino },
      relations: {
        conductor: true,
        bus: {
          fotos: true,
        },
      },
    });

    if (frecuencias.length === 0) {
      throw new BadRequestException(`Frecuencias para el destino ${destino} no encontradas`);
    }

    return frecuencias;
  }

  async findByProvincia(provincia: string) {
    const frecuencias = await this.frecuenciaRepository.find({
      where: { provincia },
      relations: {
        conductor: true,
        bus: {
          fotos: true,
        },
      },
    });

    if (frecuencias.length === 0) {
      throw new BadRequestException(`Frecuencias para la provincia ${provincia} no encontradas`);
    }

    return frecuencias;
  }

  async findByOrigen(origen: string) {
    const frecuencias = await this.frecuenciaRepository.find({
      where: { origen },
      relations: {
        conductor: true,
        bus: {
          fotos: true,
        },
      },
    });

    if (frecuencias.length === 0) {
      throw new BadRequestException(`Frecuencias para el origen ${origen} no encontradas`);
    }

    return frecuencias;
  }

  async findOne(id: number) {
    const frecuencia = await this.frecuenciaRepository.findOne({
      where: { frecuencia_id: id },
      relations: {
        conductor: true,
        bus: {
          fotos: true,
        },
        rutas: {
          parada: true,
        },
      },
      order: {
        rutas: {
          orden: 'ASC',
        },
      },
    });

    if (!frecuencia) {
      throw new NotFoundException(`Frecuencia con ID ${id} no encontrada`);
    }

    // Si es directo, no mostrar rutas
    if (frecuencia.es_directo) {
      frecuencia.rutas = [];
    }

    return frecuencia;
  }

  async findByConductor(id: number) {
    const frecuencias = await this.frecuenciaRepository.find({
      where: { conductor_id: id },
      relations: {
        conductor: true,
        bus: {
          fotos: true,
        },
      },
    });

    if (frecuencias.length === 0) {
      throw new BadRequestException(`Frecuencias para el conductor con ID ${id} no encontradas`);
    }

    return frecuencias;
  }

  async findByBus(id: number) {
    const frecuencias = await this.frecuenciaRepository.find({
      where: { bus_id: id },
      relations: {
        conductor: true,
        bus: {
          fotos: true,
        },
      },
    });

    if (frecuencias.length === 0) {
      throw new BadRequestException(`Frecuencias para el bus con ID ${id} no encontradas`);
    }

    return frecuencias;
  }

  async update(id: number, updateFrecuenciaDto: UpdateFrecuenciaDto) {
    const frecuencia = await this.findFrecuenciaById(id);
    const { conductor_id, bus_id, hora_salida, hora_llegada } = updateFrecuenciaDto;

    if (conductor_id) {
      await this.validateConductor(conductor_id);
    }

    if (bus_id) {
      await this.validateBus(bus_id);
    }

    if (hora_salida && hora_llegada) {
      this.validateHoras(hora_salida, hora_llegada);
      
      const conductorFrecuencias = await this.fetchConductorFrecuenciasExcludingCurrent(
        id, 
        conductor_id || frecuencia.conductor_id
      );

      this.validateConductorSolapamiento(conductorFrecuencias, hora_salida, hora_llegada);
    } else if ((hora_salida && !hora_llegada) || (!hora_salida && hora_llegada)) {
      throw new BadRequestException('Debe proporcionar tanto hora_salida como hora_llegada');
    }

    await this.frecuenciaRepository.update(id, updateFrecuenciaDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const frecuencia = await this.findFrecuenciaById(id);

    if (!frecuencia.activo) {
      return;
    }

    await this.frecuenciaRepository.update(id, { activo: false });

    return {
      message: `Frecuencia con ID ${id} desactivada correctamente`,
    };
  }

  // Validation and helper methods
  private async validateBus(bus_id: number) {
    const bus = await this.busRepository.findOne({
      where: { bus_id },
      select: ['bus_id'],
    });

    if (!bus) {
      throw new BadRequestException(`El bus con ID ${bus_id} no existe`);
    }
  }

  private async validateConductor(conductor_id: number) {
    const conductor = await this.userRepository.findOne({
      where: { usuario_id: conductor_id },
      select: ['usuario_id', 'rol'],
    });

    if (!conductor) {
      throw new BadRequestException(`El usuario con ID ${conductor_id} no existe`);
    }

    // if (conductor.rol !== Roles.USUARIO_CONDUCTOR) {
    //   throw new BadRequestException('Solo los usuarios con rol USUARIO_CONDUCTOR pueden ser asignados a frecuencias');
    // }
  }

  private validateHoras(hora_salida: string, hora_llegada: string) {
    const salida = new Date(`1970-01-01T${hora_salida}`);
    const llegada = new Date(`1970-01-01T${hora_llegada}`);

    if (salida >= llegada) {
      throw new BadRequestException('La hora de salida debe ser menor a la hora de llegada');
    }
  }

  private async fetchConductorFrecuencias(conductor_id: number) {
    return this.frecuenciaRepository.find({
      where: { conductor_id },
    });
  }

  private async fetchBusFrecuencias(bus_id: number) {
    return this.frecuenciaRepository.find({
      where: { bus_id },
    });
  }

  private async fetchConductorFrecuenciasExcludingCurrent(currentId: number, conductor_id: number) {
    return this.frecuenciaRepository.find({
      where: { 
        conductor_id,
        frecuencia_id: Not(currentId),
      },
    });
  }

  private validateConductorSolapamiento(
    frecuencias: Frecuencia[],
    nuevaHoraSalida: string,
    nuevaHoraLlegada: string,
  ) {
    this.validateTimeOverlap(
      frecuencias, 
      nuevaHoraSalida, 
      nuevaHoraLlegada, 
      'El conductor ya tiene una frecuencia asignada entre'
    );
  }

  private validateBusSolapamiento(
    frecuencias: Frecuencia[],
    nuevaHoraSalida: string,
    nuevaHoraLlegada: string,
  ) {
    this.validateTimeOverlap(
      frecuencias, 
      nuevaHoraSalida, 
      nuevaHoraLlegada, 
      'El bus ya tiene una frecuencia asignada entre'
    );
  }

  private validateTimeOverlap(
    frecuencias: Frecuencia[],
    nuevaHoraSalida: string,
    nuevaHoraLlegada: string,
    errorMessage: string,
  ) {
    const nuevaSalida = new Date(`1970-01-01T${nuevaHoraSalida}`);
    const nuevaLlegada = new Date(`1970-01-01T${nuevaHoraLlegada}`);

    for (const frecuencia of frecuencias) {
      const frecuenciaSalida = new Date(`1970-01-01T${frecuencia.hora_salida}`);
      const frecuenciaLlegada = new Date(`1970-01-01T${frecuencia.hora_llegada}`);

      if (
        (nuevaSalida >= frecuenciaSalida && nuevaSalida <= frecuenciaLlegada) ||
        (nuevaLlegada >= frecuenciaSalida && nuevaLlegada <= frecuenciaLlegada) ||
        (nuevaSalida <= frecuenciaSalida && nuevaLlegada >= frecuenciaLlegada)
      ) {
        throw new BadRequestException(
          `${errorMessage} ${frecuencia.hora_salida} y ${frecuencia.hora_llegada}`,
        );
      }
    }
  }

  private async findFrecuenciaById(id: number) {
    const frecuencia = await this.frecuenciaRepository.findOne({
      where: { frecuencia_id: id },
      relations: {
        conductor: true,
        bus: {
          fotos: true,
        },
      },
    });

    if (!frecuencia) {
      throw new BadRequestException(`Frecuencia con ID ${id} no encontrada`);
    }

    return frecuencia;
  }
}