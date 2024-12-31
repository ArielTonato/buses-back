import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { User } from '../../user/entities/user.entity';
import { Cooperativa } from '../../cooperativa/entities/cooperativa.entity';

@Entity()
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numeroFactura: string;

  @CreateDateColumn()
  fechaEmision: Date;

  @Column()
  tipoPago: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  iva: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Reserva, { eager: true })
  @JoinColumn()
  reserva: Reserva;

  @Column()
  reservaId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  usuario: User;

  @Column()
  usuarioId: string;

  @ManyToOne(() => Cooperativa, { eager: true })
  @JoinColumn()
  cooperativa: Cooperativa;

  @Column()
  cooperativaId: string;
}
