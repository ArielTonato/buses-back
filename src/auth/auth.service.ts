import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async login({correo, password}: LoginDto){
        const user = await this.userService.findByEmailWithPassword(correo);
        if(!user){
            throw new BadRequestException('Credenciales inválidas o usuario no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new BadRequestException('Credenciales inválidas o usuario no encontrado');
        }
        const payload = {id:user.usuario_id, correo: user.correo, rol: user.rol, primer_nombre: user.primer_nombre, primer_apellido: user.primer_apellido};
        const token = this.jwtService.sign(payload);
        return{
            token
        }
    }

    async register(userRegister: RegisterDto){
        const user = await this.userService.findOneByEmail(userRegister.correo);
        if(user){
            throw new BadRequestException('El usuario ya existe');
        }

        await this.userService.create({
            ...userRegister,
            password: await bcrypt.hash(userRegister.password, 10),
        });

        return {
            message: 'Usuario registrado correctamente'
        }
    }


    async profile(
        {correo: email}: ActiveUserInterface
    ){
        const {usuario_id, rol, correo, primer_nombre, primer_apellido} = await this.userService.findOneByEmail(email);
        console.log(correo)
        return {
            usuario_id,
            rol,
            correo,
            primer_nombre,
            primer_apellido
        }
    }
}
