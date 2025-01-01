import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { User } from '../../user/entities/user.entity';
import { Cooperativa } from '../../cooperativa/entities/cooperativa.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Factura {
  @ApiProperty({
    description: 'ID único de la factura',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Número de factura único',
    example: 'FACT-001-2025'
  })
  @Column({ unique: true })
  numeroFactura: string;

  @ApiProperty({
    description: 'Fecha de emisión de la factura',
    example: '2025-01-01T15:30:00Z'
  })
  @CreateDateColumn()
  fechaEmision: Date;

  @ApiProperty({
    description: 'Subtotal de la factura',
    example: 25.50
  })
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({
    description: 'IVA de la factura',
    example: 3.06
  })
  @Column('decimal', { precision: 10, scale: 2 })
  iva: number;

  @ApiProperty({
    description: 'Total de la factura (subtotal + IVA)',
    example: 28.56
  })
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    description: 'URL del PDF de la factura',
    example: 'https://storage.googleapis.com/facturas/FACT-001-2025.pdf',
    required: false
  })
  @Column({ nullable: true })
  pdfUrl: string;

  @ApiProperty({
    description: 'Reserva asociada a la factura',
    type: () => Reserva
  })
  @ManyToOne(() => Reserva, { eager: true })
  @JoinColumn()
  reserva: Reserva;

  @ApiProperty({
    description: 'ID de la reserva asociada',
    example: 1
  })
  @Column()
  reservaId: number;

  @ApiProperty({
    description: 'Usuario al que se emite la factura',
    type: () => User
  })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  usuario: User;

  @ApiProperty({
    description: 'ID del usuario',
    example: 1
  })
  @Column()
  usuarioId: number;

  @ApiProperty({
    description: 'Cooperativa que emite la factura',
    type: () => Cooperativa
  })
  @ManyToOne(() => Cooperativa, { eager: true })
  @JoinColumn()
  cooperativa: Cooperativa;

  @ApiProperty({
    description: 'ID de la cooperativa',
    example: 1,
    default: 1
  })
  @Column({ default: 1 })
  cooperativaId: number;

  @ApiProperty({
    description: 'Boleto asociado a la factura',
    type: () => Boleto
  })
  @ManyToOne(() => Boleto, { eager: true })
  @JoinColumn({ name: 'boleto_id' })
  boleto: Boleto;

  @ApiProperty({
    description: 'ID del boleto',
    example: 1
  })
  @Column()
  boleto_id: number;
}
