import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bus } from '../../buses/entities/bus.entity';
import { User } from '../../user/entities/user.entity';

@Entity('frecuencias')
export class Frecuencia {
  @PrimaryGeneratedColumn()
  frecuencia_id: number;

  @Column()
  nombre_frecuencia: string;

  @Column()
  bus_id: number;

  @ManyToOne(() => Bus, bus => bus.frecuencias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @Column()
  conductor_id: number;

  @ManyToOne(() => User, user => user.frecuencias_conductor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conductor_id' })
  conductor: User;

  @Column('time')
  hora_salida: string;

  @Column('time')
  hora_llegada: string;

  @Column()
  origen: string;

  @Column()
  destino: string;

  @Column()
  provincia: string;

  @Column({ default: true })
  activo: boolean;

  @Column('float')
  total: number;

  //El es directo me va a indicar si la frecuencia va mostrar o no paradas intermedias
  @Column({default: false})
  es_directo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;
}
