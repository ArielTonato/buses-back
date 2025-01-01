import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { Ruta } from './entities/ruta.entity';
import { ParadasService } from '../paradas/paradas.service';
import { FrecuenciasService } from '../frecuencias/frecuencias.service';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,
    private readonly paradasService: ParadasService,
    private readonly frecuenciasService: FrecuenciasService,
  ) {}

  private async validateParada(paradaId: number) {
    const parada = await this.paradasService.findOne(paradaId);
    if (!parada) {
      throw new NotFoundException(`La parada con ID ${paradaId} no existe`);
    }
    if (!parada.activo) {
      throw new BadRequestException(`La parada con ID ${paradaId} no está activa`);
    }
    return parada;
  }

  private async validateFrecuencia(frecuenciaId: number) {
    const frecuencia = await this.frecuenciasService.findOne(frecuenciaId);
    if (!frecuencia) {
      throw new NotFoundException(`La frecuencia con ID ${frecuenciaId} no existe`);
    }
    if (!frecuencia.activo) {
      throw new BadRequestException(`La frecuencia con ID ${frecuenciaId} no está activa`);
    }
    return frecuencia;
  }

  private validateTiempoParada(tiempoParada: string, frecuencia: any) {
    const tiempoParadaDate = new Date(`1970-01-01T${tiempoParada}`);
    const horaSalidaDate = new Date(`1970-01-01T${frecuencia.hora_salida}`);
    const horaLlegadaDate = new Date(`1970-01-01T${frecuencia.hora_llegada}`);

    if (tiempoParadaDate < horaSalidaDate || tiempoParadaDate > horaLlegadaDate) {
      throw new BadRequestException(
        `El tiempo de parada (${tiempoParada}) debe estar entre la hora de salida (${frecuencia.hora_salida}) y la hora de llegada (${frecuencia.hora_llegada}) de la frecuencia ${frecuencia.nombre_frecuencia}`,
      );
    }
  }

  private async validateUniqueRuta(
    paradaId: number, 
    frecuenciaId: number, 
    tiempoParada: string, 
    orden: number,  // Nuevo parámetro de orden
    rutaId?: number
  ) {
    // Verificación de parada y frecuencia única
    const existingRutaByParadaFrecuencia = await this.rutaRepository.findOne({
      where: { 
        parada_id: paradaId, 
        frecuencia_id: frecuenciaId 
      },
    });

    if (existingRutaByParadaFrecuencia && existingRutaByParadaFrecuencia.rutas_id !== rutaId) {
      throw new BadRequestException('Ya existe una ruta con la misma parada y frecuencia');
    }

    // Verificación de horario único en la frecuencia
    const existingRutaByHorario = await this.rutaRepository.findOne({
      where: { 
        frecuencia_id: frecuenciaId, 
        tiempo_parada: tiempoParada 
      },
    });

    if (existingRutaByHorario && existingRutaByHorario.rutas_id !== rutaId) {
      throw new BadRequestException(
        `Ya existe una parada con el mismo horario (${tiempoParada}) en la frecuencia`
      );
    }

    // Nueva validación de orden único en la frecuencia
    const existingRutaByOrden = await this.rutaRepository.findOne({
      where: { 
        frecuencia_id: frecuenciaId, 
        orden: orden 
      },
    });

    if (existingRutaByOrden && existingRutaByOrden.rutas_id !== rutaId) {
      throw new BadRequestException(
        `Ya existe una ruta con el orden ${orden} en esta frecuencia`
      );
    }
  }

  async create(createRutaDto: CreateRutaDto) {
    // Validar parada y frecuencia
    const parada = await this.validateParada(createRutaDto.parada_id);
    const frecuencia = await this.validateFrecuencia(createRutaDto.frecuencia_id);

    // Validar tiempo de parada
    this.validateTiempoParada(createRutaDto.tiempo_parada, frecuencia);

    // Verificar unicidad de la ruta, incluyendo el orden
    await this.validateUniqueRuta(
      createRutaDto.parada_id, 
      createRutaDto.frecuencia_id, 
      createRutaDto.tiempo_parada,
      createRutaDto.orden  // Añadir el orden a la validación
    );

    // Crear ruta
    return this.rutaRepository.save(createRutaDto);
  }

  findAll() {
    return this.rutaRepository.find({
      relations: {
        parada: true,
        frecuencia: true,
      },
    });
  }

  async findOne(id: number) {
    const ruta = await this.rutaRepository.findOne({
      where: { rutas_id: id },
      relations: {
        parada: true,
        frecuencia: true,
      },
    });
    if (!ruta) {
      throw new NotFoundException(`La ruta con ID ${id} no existe`);
    }
    return ruta;
  }

  async findByFrecuencia(frecuenciaId: number) {
    const rutas = await this.rutaRepository.find({
      where: { frecuencia_id: frecuenciaId },
      relations: {
        parada: true,
        frecuencia: true,
      },
      order: {
        orden: 'ASC',
      },
    });

    if (!rutas.length) {
      throw new NotFoundException(`No se encontraron rutas para la frecuencia ${frecuenciaId}`);
    }

    return rutas;
  }

  async findByParada(paradaId: number) {
    const rutas = await this.rutaRepository.find({
      where: { parada_id: paradaId },
      relations: {
        parada: true,
        frecuencia: true,
      },
      order: {
        frecuencia_id: 'ASC',
        orden: 'ASC',
      },
    });

    if (!rutas.length) {
      throw new NotFoundException(`No se encontraron rutas para la parada ${paradaId}`);
    }

    return rutas;
  }

  async update(id: number, updateRutaDto: UpdateRutaDto) {
    // Verificar que la ruta exista
    await this.findOne(id);

    // Validar parada y frecuencia
    await this.validateParada(updateRutaDto.parada_id);
    const frecuencia = await this.validateFrecuencia(updateRutaDto.frecuencia_id);

    // Validar tiempo de parada
    this.validateTiempoParada(updateRutaDto.tiempo_parada, frecuencia);

    // Verificar unicidad de la ruta
    await this.validateUniqueRuta(
      updateRutaDto.parada_id, 
      updateRutaDto.frecuencia_id, 
      updateRutaDto.tiempo_parada,
      updateRutaDto.orden,  // Añadir el orden a la validación
      id
    );

    // Actualizar ruta
    await this.rutaRepository.update(id, updateRutaDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const ruta = await this.rutaRepository.findOneBy({ rutas_id: id });
    if (!ruta) {
      return { message: 'La ruta no existe' };
    }
    await this.rutaRepository.delete(id);
    return { message: "Ruta Eliminada" };
  }
}
