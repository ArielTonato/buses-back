import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BusesFoto } from "src/buses-fotos/entities/buses-foto.entity";

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

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({default: true})
    activo: boolean;

    @OneToMany(() => BusesFoto, busFoto => busFoto.bus, { 
        eager: true,
        cascade: true 
    })
    fotos: BusesFoto[];
}