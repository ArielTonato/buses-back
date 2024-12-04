import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Frecuencia } from './entities/frecuencia.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Roles } from '../common/enums/roles.enum';
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
  ) { }

  async create(createFrecuenciaDto: CreateFrecuenciaDto) {
    const { conductor_id, hora_salida, hora_llegada, bus_id } = createFrecuenciaDto;

    // Validar que el bus exista
    const bus = await this.busRepository.findOne({ 
      where: { bus_id },
      select: ['bus_id']
    });

    if (!bus) {
      throw new BadRequestException(`El bus con ID ${bus_id} no existe`);
    }

    // Validar que el usuario exista y sea conductor
    const conductor = await this.userRepository.findOne({ 
      where: { usuario_id: conductor_id },
      select: ['usuario_id', 'rol']
    });

    if (!conductor) {
      throw new BadRequestException(`El usuario con ID ${conductor_id} no existe`);
    }

    if (conductor.rol !== Roles.USUARIO_CONDUCTOR) {
      throw new BadRequestException('Solo los usuarios con rol USUARIO_CONDUCTOR pueden ser asignados a frecuencias');
    }

    // Validar que las horas sean correctas
    this.validateHoras(hora_salida, hora_llegada);

    // Obtener frecuencias existentes del conductor
    const conductorFrecuencias = await this.frecuenciaRepository.find({
      where: { conductor_id },
    });

    // Validar que no haya solapamientos con las frecuencias existentes
    this.validateSolapamiento(
      conductorFrecuencias,
      hora_salida,
      hora_llegada,
    );

    // Guardar la nueva frecuencia
    return this.frecuenciaRepository.save(createFrecuenciaDto);
  }

  findAll() {
    return this.frecuenciaRepository.find({
      relations: {
        conductor: true,
        bus: {
          fotos: true
        }
      },
      select: {
        conductor: {
          usuario_id: true,
          primer_nombre: true,
          primer_apellido: true,
          rol: true
        },
        bus: {
          bus_id: true,
          numero_bus: true,
          placa: true,
          chasis: true,
          carroceria: true,
          total_asientos_normales: true,
          total_asientos_vip: true,
          fotos: {
            foto_id: true,
            url: true,
            public_id: true
          }
        }
      }
    });
  }

  findOne(id: number) {
    return this.frecuenciaRepository.findOne({ 
      where: { frecuencia_id: id },
      relations: {
        conductor: true,
        bus: {
          fotos: true
        }
      },
      select: {
        conductor: {
          primer_nombre: true,
          primer_apellido: true,
          rol: true
        },
        bus: {
          bus_id: true,
          numero_bus: true,
          placa: true,
          chasis: true,
          carroceria: true,
          total_asientos_normales: true,
          total_asientos_vip: true,
          fotos: {
            foto_id: true,
            url: true,
            public_id: true
          }
        }
      }
    });
  }

  async update(id: number, updateFrecuenciaDto: UpdateFrecuenciaDto) {
    const frecuencia = await this.frecuenciaRepository.findOne({ where: { frecuencia_id: id } });

    if (!frecuencia) {
      throw new BadRequestException(`Frecuencia con ID ${id} no encontrada`);
    }

    Object.assign(frecuencia, updateFrecuenciaDto);
    return this.frecuenciaRepository.save(frecuencia);
  }

  async remove(id: number) {
    const frecuencia = await this.frecuenciaRepository.findOne({ where: { frecuencia_id: id } });

    if (!frecuencia) {
      throw new BadRequestException(`Frecuencia con ID ${id} no encontrada`);
    }

    return this.frecuenciaRepository.remove(frecuencia);
  }

  private validateHoras(hora_salida: string, hora_llegada: string): void {
    const salida = new Date(`1970-01-01T${hora_salida}`);
    const llegada = new Date(`1970-01-01T${hora_llegada}`);

    if (salida >= llegada) {
      throw new BadRequestException('La hora de salida debe ser menor a la hora de llegada');
    }
  }

  private validateSolapamiento(
    frecuencias: Frecuencia[],
    nuevaHoraSalida: string,
    nuevaHoraLlegada: string,
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
          `El conductor ya tiene una frecuencia asignada entre ${frecuencia.hora_salida} y ${frecuencia.hora_llegada}`,
        );
      }
    }
  }
}
