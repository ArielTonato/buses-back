import { EstadoBoleto, MetodoPago } from "src/common/enums/boletos.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("boletos")
export class Boleto {
    @PrimaryGeneratedColumn()
    boleto_id: number

    @Column("float")
    total: number

    @Column()
    cantidad_asientos: number

    @Column(
        {
            type: 'enum',
            enum: MetodoPago,
            default: MetodoPago.PRESENCIAL
        }
    )
    metodo_pago: MetodoPago

    @Column(
        {
            type: 'enum',
            enum: EstadoBoleto,
            default: EstadoBoleto.PAGADO
        }
    )
    estado: EstadoBoleto

    @Column()
    url_imagen_qr: string

    @Column()
    asientos: string

    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    fecha_emision: Date
    
}
