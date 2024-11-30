import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @Column()
  conductor_id: number;

  @Column('timestamp')
  hora_salida: Date;

  @Column('timestamp')
  hora_llegada: Date;

  @Column()
  origen: string;

  @Column()
  destino: string;

  @Column()
  activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;
}
