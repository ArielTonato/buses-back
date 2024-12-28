import { EstadoReserva } from "src/common/enums/reserva.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("reservas")
export class Reserva {
    @PrimaryGeneratedColumn()
    reserva_id: number

    @Column()
    usuario_id: number
    
    @Column()
    asiento_id: number

    @Column()
    frecuencia_id: number

    @Column()
    boleto_id: number

    @Column()
    nombre_pasajero: string 

    @Column()
    identificacion_pasajero: string

    @Column(
        {
            type: 'enum',
            enum: EstadoReserva,
            default: EstadoReserva.PENDIENTE
        }
    )
    estado: EstadoReserva

    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    fecha_creacion: Date

    @Column()
    fecha_viaje: Date

    @Column("time")
    hora_viaje: string

    @Column("float")
    precio: number

    @Column()
    observacion: string

    @Column()
    destino_reserva: string
}
