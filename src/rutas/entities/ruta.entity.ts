import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Frecuencia } from '../../frecuencias/entities/frecuencia.entity';
import { Parada } from '../../paradas/entities/parada.entity';

@Entity('rutas')
export class Ruta {
  //TODO: agregar la relacion con la parada y la frecuencia
  @PrimaryGeneratedColumn()
  rutas_id: number;

  @Column()
  frecuencia_id: number;

  @ManyToOne(() => Frecuencia, frecuencia => frecuencia.rutas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'frecuencia_id' })
  frecuencia: Frecuencia;

  @Column()
  parada_id: number;

  @ManyToOne(() => Parada, parada => parada.rutas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parada_id' })
  parada: Parada;

  @Column()
  orden: number;

  @Column('float')
  distancia_parada: number;

  @Column('float')
  precio_parada: number;

  @Column('time')
  tiempo_parada: string;

  @Column({default: true})
  activo: boolean;
}
