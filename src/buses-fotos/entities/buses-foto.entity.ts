import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Bus } from "src/buses/entities/bus.entity";

@Entity()
export class BusesFoto {
    @PrimaryGeneratedColumn()
    foto_id: number;

    @Column()
    url: string;

    @Column()
    public_id: string;

    @ManyToOne(() => Bus, bus => bus.fotos, { onDelete: 'CASCADE' })
    bus: Bus;

    @Column()
    bus_id: number;
}