import { Roles } from "../../common/enums/roles.enum";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @DeleteDateColumn()
    fecha_eliminacion: Date;

    //La fecha de creacion es un timestamp que se genera automaticamente
    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP"})
    fecha_creacion: Date;
}
