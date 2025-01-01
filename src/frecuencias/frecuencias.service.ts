import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, FindOptionsWhere } from 'typeorm';

import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';
import { Frecuencia } from './entities/frecuencia.entity';
import { User } from '../user/entities/user.entity';
import { Bus } from '../buses/entities/bus.entity';
import { defaultRelations, defaultOrder } from 'src/common/utils/relations';

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

  private async findFrecuencias(where: FindOptionsWhere<Frecuencia>, errorMessage?: string) {
    const frecuencias = await this.frecuenciaRepository.find({
      where: { ...where, activo: true },
      relations: defaultRelations,
      //@ts-ignore
      order: defaultOrder,
    });

    if (errorMessage && frecuencias.length === 0) {
      throw new BadRequestException(errorMessage);
    }

    return this.processFrecuencias(frecuencias);
  }

  private processFrecuencias(frecuencias: Frecuencia[]): Frecuencia[] {
    return frecuencias.map(frecuencia => ({
      ...frecuencia,
      rutas: frecuencia.es_directo ? [] : frecuencia.rutas
    }));
  }

  async create(createFrecuenciaDto: CreateFrecuenciaDto) {
    const { conductor_id, hora_salida, hora_llegada, bus_id } = createFrecuenciaDto;

    await Promise.all([
      this.validateBus(bus_id),
      this.validateConductor(conductor_id)
    ]);

    this.validateHoras(hora_salida, hora_llegada);

    const [conductorFrecuencias, busFrecuencias] = await Promise.all([
      this.fetchConductorFrecuencias(conductor_id),
      this.fetchBusFrecuencias(bus_id)
    ]);

    this.validateConductorSolapamiento(conductorFrecuencias, hora_salida, hora_llegada);
    this.validateBusSolapamiento(busFrecuencias, hora_salida, hora_llegada);

    const frecuencia = await this.frecuenciaRepository.save(createFrecuenciaDto);
    return this.findOne(frecuencia.frecuencia_id);
  }

  async findAll() {
    return this.findFrecuencias({});
  }

  async findByDestino(destino: string) {
    return this.findFrecuencias(
      { destino },
      `Frecuencias para el destino ${destino} no encontradas`
    );
  }

  async findByProvincia(provincia: string) {
    return this.findFrecuencias(
      { provincia },
      `Frecuencias para la provincia ${provincia} no encontradas`
    );
  }

  async findByOrigen(origen: string) {
    return this.findFrecuencias(
      { origen },
      `Frecuencias para el origen ${origen} no encontradas`
    );
  }

  async findOne(id: number) {
    const [frecuencia] = await this.findFrecuencias(
      { frecuencia_id: id },
      `Frecuencia con ID ${id} no encontrada`
    );
    return frecuencia;
  }

  async findByConductor(id: number) {
    return this.findFrecuencias(
      { conductor_id: id },
      `Frecuencias para el conductor con ID ${id} no encontradas`
    );
  }

  async findByBus(id: number) {
    return this.findFrecuencias(
      { bus_id: id },
      `Frecuencias para el bus con ID ${id} no encontradas`
    );
  }

  async update(id: number, updateFrecuenciaDto: UpdateFrecuenciaDto) {
    const frecuencia = await this.findFrecuenciaById(id);
    const { conductor_id, bus_id, hora_salida, hora_llegada } = updateFrecuenciaDto;

    // Validaciones paralelas
    if (conductor_id || bus_id) {
      await Promise.all([
        conductor_id && this.validateConductor(conductor_id),
        bus_id && this.validateBus(bus_id)
      ]);
    }

    if (hora_salida && hora_llegada) {
      this.validateHoras(hora_salida, hora_llegada);

      const conductorFrecuencias = await this.fetchConductorFrecuenciasExcludingCurrent(
        id,
        conductor_id || frecuencia.conductor_id
      );

      this.validateConductorSolapamiento(conductorFrecuencias, hora_salida, hora_llegada);
    } else if (hora_salida || hora_llegada) {
      throw new BadRequestException('Debe proporcionar tanto hora_salida como hora_llegada');
    }

    await this.frecuenciaRepository.update(id, updateFrecuenciaDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const frecuencia = await this.findFrecuenciaById(id);
    
    if (!frecuencia.activo) {
      return { message: `Frecuencia con ID ${id} ya está desactivada` };
    }

    await this.frecuenciaRepository.update(id, { activo: false });
    return { message: `Frecuencia con ID ${id} desactivada correctamente` };
  }

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
  }

  private validateHoras(hora_salida: string, hora_llegada: string) {
    const [salida, llegada] = [
      new Date(`1970-01-01T${hora_salida}`),
      new Date(`1970-01-01T${hora_llegada}`)
    ];

    if (salida >= llegada) {
      throw new BadRequestException('La hora de salida debe ser menor a la hora de llegada');
    }
  }

  private async fetchConductorFrecuencias(conductor_id: number) {
    return this.frecuenciaRepository.find({
      where: { conductor_id, activo: true },
    });
  }

  private async fetchBusFrecuencias(bus_id: number) {
    return this.frecuenciaRepository.find({
      where: { bus_id, activo: true },
    });
  }

  private async fetchConductorFrecuenciasExcludingCurrent(currentId: number, conductor_id: number) {
    return this.frecuenciaRepository.find({
      where: {
        conductor_id,
        frecuencia_id: Not(currentId),
        activo: true,
      },
    });
  }

  private validateTimeOverlap(
    frecuencias: Frecuencia[],
    nuevaHoraSalida: string,
    nuevaHoraLlegada: string,
    errorMessage: string,
  ) {
    const [nuevaSalida, nuevaLlegada] = [
      new Date(`1970-01-01T${nuevaHoraSalida}`),
      new Date(`1970-01-01T${nuevaHoraLlegada}`)
    ];
  
    const hasOverlap = frecuencias.some(frecuencia => {
      const [frecuenciaSalida, frecuenciaLlegada] = [
        new Date(`1970-01-01T${frecuencia.hora_salida}`),
        new Date(`1970-01-01T${frecuencia.hora_llegada}`)
      ];
  
      return (
        (nuevaSalida >= frecuenciaSalida && nuevaSalida <= frecuenciaLlegada) ||
        (nuevaLlegada >= frecuenciaSalida && nuevaLlegada <= frecuenciaLlegada) ||
        (nuevaSalida <= frecuenciaSalida && nuevaLlegada >= frecuenciaLlegada)
      );
    });
  
    if (hasOverlap) {
      throw new BadRequestException(
        `${errorMessage} ${nuevaHoraSalida} y ${nuevaHoraLlegada}`
      );
    }
  }
  
  private validateConductorSolapamiento(
    frecuencias: Frecuencia[],
    nuevaHoraSalida: string,
    nuevaHoraLlegada: string,
  ) {
    return this.validateTimeOverlap(
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
    return this.validateTimeOverlap(
      frecuencias,
      nuevaHoraSalida,
      nuevaHoraLlegada,
      'El bus ya tiene una frecuencia asignada entre'
    );
  }

  private async findFrecuenciaById(id: number) {
    const frecuencia = await this.frecuenciaRepository.findOne({
      where: { frecuencia_id: id },
      relations: defaultRelations,
    });

    if (!frecuencia) {
      throw new BadRequestException(`Frecuencia con ID ${id} no encontrada`);
    }

    return frecuencia;
  }
}