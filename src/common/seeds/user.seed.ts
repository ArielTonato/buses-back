import { Roles } from '../enums/roles.enum';
import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export const userSeed = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);
    
    // Array of initial users
    const users = [
        {
            identificacion: '1234567890',
            primer_nombre: 'Admin',
            segundo_nombre: 'Sistema',
            primer_apellido: 'Principal',
            segundo_apellido: 'Admin',
            correo: 'admin@buses.com',
            password: await bcrypt.hash('123456', 10),
            telefono: '0987654321',
            rol: Roles.ADMINISTRADORES,
            direccion: 'Dirección Administrativa'
        },
        {
            identificacion: '0987654321',
            primer_nombre: 'Usuario',
            segundo_nombre: 'Bus',
            primer_apellido: 'Gestor',
            segundo_apellido: 'Buses',
            correo: 'bus@buses.com',
            password: await bcrypt.hash('123456', 10),
            telefono: '0912345678',
            rol: Roles.USUARIOS_BUSES,
            direccion: 'Dirección Terminal'
        },
        {
            identificacion: '1122334455',
            primer_nombre: 'Oficinista',
            segundo_nombre: 'Venta',
            primer_apellido: 'Boletos',
            segundo_apellido: 'Terminal',
            correo: 'oficina@buses.com',
            password: await bcrypt.hash('123456', 10),
            telefono: '0923456789',
            rol: Roles.OFICINISTAS,
            direccion: 'Oficina Terminal'
        },
        {
            identificacion: '5544332211',
            primer_nombre: 'Aprobador',
            segundo_nombre: 'Frecuencia',
            primer_apellido: 'Control',
            segundo_apellido: 'Rutas',
            correo: 'atonato5734@uta.edu.ec',
            password: await bcrypt.hash('123456', 10),
            telefono: '0934567890',
            rol: Roles.USUARIOS_APROBADORES,
            direccion: 'Oficina Control'
        },
        {
            identificacion: '9988776655',
            primer_nombre: 'Cliente',
            segundo_nombre: 'Normal',
            primer_apellido: 'Usuario',
            segundo_apellido: 'Regular',
            correo: 'cliente@mail.com',
            password: await bcrypt.hash('123456', 10),
            telefono: '0945678901',
            rol: Roles.USUARIOS_NORMAL,
            direccion: 'Dirección Cliente'
        },
        {
            identificacion: '9938776655',
            primer_nombre: 'Correo',
            segundo_nombre: 'Prueba',
            primer_apellido: 'Gmail',
            segundo_apellido: 'Regular',
            correo: 'alexitotn21@gmail.com',
            password: await bcrypt.hash('123456', 10),
            telefono: '0935678901',
            rol: Roles.USUARIOS_NORMAL,
            direccion: 'Dirección UTA'
        }
    ];

    // Insert users
    for (const user of users) {
        const existingUser = await userRepository.findOneBy({ correo: user.correo });
        if (!existingUser) {
            await userRepository.save(user);
        }
    }
};
