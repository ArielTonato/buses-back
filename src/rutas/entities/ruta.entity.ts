import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rutas')
export class Ruta {
  //TODO: agregar la relacion con la parada y la frecuencia
  @PrimaryGeneratedColumn()
  rutas_id: number;

  @Column()
  frecuencia_id: number;

  @Column()
  parada_id: number;

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
