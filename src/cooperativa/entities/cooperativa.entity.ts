import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cooperativa {
    @PrimaryGeneratedColumn()
    cooperativa_id: number;
    @Column()
    nombre: string;
    @Column()
    telefono: string;
    @Column()
    correo: string;
    @Column()
    logo: string;
    @Column()
    ruc: string;
    @Column()
    direccion: string;
}
