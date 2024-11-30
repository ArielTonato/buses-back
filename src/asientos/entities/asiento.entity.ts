import { Bus } from "src/buses/entities/bus.entity";
import { Asientos } from "src/common/enums/asientos.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Asiento {
    @PrimaryGeneratedColumn()
    asiento_id: number;

    @Column({type:"enum", default:Asientos.NORMAL, enum:Asientos})
    tipo_asiento: Asientos;

    @Column()
    numero_asiento: number;


    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    fecha_creacion: Date;

    @ManyToOne(() => Bus, bus => bus.asientos, { onDelete: 'CASCADE' })
    bus: Bus;
}
