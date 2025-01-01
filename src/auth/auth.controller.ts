import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ActiveUser } from './decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { AuthGuard } from './guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuario autenticado correctamente',
        schema: {
            example: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 1,
                    correo: 'usuario@ejemplo.com',
                    roles: ['user']
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    @Post('login')
    login(
        @Body() loginDto: LoginDto
    ){
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @ApiResponse({ 
        status: 201, 
        description: 'Usuario registrado correctamente',
        schema: {
            example: {
                message: 'Usuario registrado correctamente'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @Post('register')
    register(
        @Body() registerDto: RegisterDto
    ){
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
    @ApiResponse({ 
        status: 200, 
        description: 'Perfil del usuario',
        schema: {
            example: {
                id: 1,
                identificacion: '1234567890',
                primer_nombre: 'Juan',
                segundo_nombre: 'Carlos',
                primer_apellido: 'Pérez',
                segundo_apellido: 'García',
                correo: 'usuario@ejemplo.com',
                telefono: '+593987654321',
                direccion: 'Calle Principal'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(AuthGuard)
    profile(
        @ActiveUser() user: ActiveUserInterface
    ){
        return this.authService.profile(user);
    }
}
