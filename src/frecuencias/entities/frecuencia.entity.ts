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
  ruta_id: number;

  @Column()
  bus_id: number;

  @ManyToOne(() => Bus)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @Column()
  conductor_id: number;

  @ManyToOne(() => User, user => user.frecuencias_conductor)
  @JoinColumn({ name: 'conductor_id' })
  conductor: User;

  @Column('timestamp')
  hora_salida: Date;

  @Column('timestamp')
  hora_llegada: Date;

  @Column()
  origen: string;

  @Column()
  destino: string;

  @Column({default: true})
  activo: boolean;

  @Column()
  provincia: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}
