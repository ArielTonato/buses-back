import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('paradas')
export class Parada {
  @PrimaryGeneratedColumn()
  parada_id: number;

  @Column()
  frecuencia_id: number;

  @Column()
  ciudad: string;

  @Column()
  orden: number;

  @Column('float')
  distancia_km: number;

  @Column('time')
  tiempo_estimado: string;

  @Column('float')
  precio_base: number;

  @Column()
  activo: boolean;
}
