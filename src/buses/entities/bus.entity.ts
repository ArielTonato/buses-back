import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bus {
    @PrimaryGeneratedColumn()
    bus_id: number;

    @Column()
    numero_bus: number;

    @Column()
    placa: string;

    @Column()
    chasis: string;

    @Column()
    carroceria: string;


    @Column()
    total_asientos_normales: number;

    @Column()
    total_asientos_vip: number;

    @Column({default: true})
    activo: boolean;

    @DeleteDateColumn()
    fecha_eliminacion: Date;

    //La fecha de creacion es un timestamp que se genera automaticamente
    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP"})
    fecha_creacion: Date;
}
