import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async login({email, password}: LoginDto){

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
}
