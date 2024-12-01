import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('paradas')
export class Parada {
  @PrimaryGeneratedColumn()
  parada_id: number;

  @Column()
  ciudad: string;

  @Column({default: true})
  activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;
}
