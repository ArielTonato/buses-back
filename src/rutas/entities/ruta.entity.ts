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
  distancia_acumulada: number;

  @Column('float')
  precio_acumulado: number;

  @Column('time')
  tiempo_acumulado: string;

  @Column({default: true})
  activo: boolean;
}
