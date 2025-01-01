import { Roles } from "../../common/enums/roles.enum";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Frecuencia } from "../../frecuencias/entities/frecuencia.entity";
import { ComprobantePago } from "../../comprobantes_pagos/entities/comprobantes_pago.entity";
import { Reserva } from "src/reserva/entities/reserva.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    usuario_id: number;

    @Column({unique: true})
    identificacion: string;

    @Column()
    primer_nombre: string;

    @Column()
    segundo_nombre: string;

    @Column()
    primer_apellido: string;

    @Column()
    segundo_apellido: string;

    @Column({unique: true})
    correo: string;

    @Column({select:false})
    password: string;

    @Column({unique: true})
    telefono: string;

    @Column({type:"enum", default:Roles.USUARIOS_NORMAL, enum:Roles}) 
    rol: Roles;

    @Column()
    direccion: string;

    @OneToMany(() => Frecuencia, frecuencia => frecuencia.conductor)
    frecuencias_conductor: Frecuencia[];

    @OneToMany(() => ComprobantePago, comprobante => comprobante.usuario)
    comprobantes: ComprobantePago[];

    @OneToMany(() => Reserva, reserva => reserva.usuario)
    reservas: Reserva[];

    @DeleteDateColumn()
    fecha_eliminacion: Date;

    //La fecha de creacion es un timestamp que se genera automaticamente
    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP"})
    fecha_creacion: Date;
}
