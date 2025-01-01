import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { User } from '../../user/entities/user.entity';
import { Cooperativa } from '../../cooperativa/entities/cooperativa.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';

@Entity()
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numeroFactura: string;

  @CreateDateColumn()
  fechaEmision: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  iva: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  pdfUrl: string;

  @ManyToOne(() => Reserva, { eager: true })
  @JoinColumn()
  reserva: Reserva;

  @Column()
  reservaId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  usuario: User;

  @Column()
  usuarioId: number;

  @ManyToOne(() => Cooperativa, { eager: true })
  @JoinColumn()
  cooperativa: Cooperativa;

  @Column({ default: 1 })
  cooperativaId: number;

  @ManyToOne(() => Boleto, { eager: true })
  @JoinColumn({ name: 'boleto_id' })
  boleto: Boleto;

  @Column()
  boleto_id: number;
}
