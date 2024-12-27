import { EstadoComprobante } from 'src/common/enums/comprobantes.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('comprobante_pago')
export class ComprobantePago {
  @PrimaryGeneratedColumn()
  comprobante_id: number;

  @Column()
  boleto_id: number;

  @Column()
  usuario_id: number;

  @Column({nullable: true})
  url_comprobante: string;

  @Column({
    type: 'enum',
    enum: EstadoComprobante,
    default: EstadoComprobante.PENDIENTE
  })
  estado: EstadoComprobante;

  @Column({ nullable: true })
  comentarios: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_revision: Date;
}
