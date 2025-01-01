import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Cooperativa {
    @ApiProperty({
        description: 'ID único de la cooperativa',
        example: 1
    })
    @PrimaryGeneratedColumn()
    cooperativa_id: number;

    @ApiProperty({
        description: 'Nombre de la cooperativa de transporte',
        example: 'Cooperativa Trans Express'
    })
    @Column()
    nombre: string;

    @ApiProperty({
        description: 'Número de teléfono de la cooperativa',
        example: '0987654321'
    })
    @Column()
    telefono: string;

    @ApiProperty({
        description: 'Correo electrónico de contacto de la cooperativa',
        example: 'info@transexpress.com'
    })
    @Column()
    correo: string;

    @ApiProperty({
        description: 'URL del logo de la cooperativa',
        example: 'https://storage.googleapis.com/cooperativas/logo-transexpress.png'
    })
    @Column()
    logo: string;

    @ApiProperty({
        description: 'RUC (Registro Único de Contribuyentes) de la cooperativa',
        example: '1234567890001'
    })
    @Column()
    ruc: string;

    @ApiProperty({
        description: 'Dirección física de la cooperativa',
        example: 'Av. Principal 123 y Secundaria'
    })
    @Column()
    direccion: string;
}
