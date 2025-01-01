import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ActiveUser } from './decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    login(
        @Body() loginDto: LoginDto
    ){
        return this.authService.login(loginDto);
    }

    @Post('register')
    register(
        @Body() registerDto: RegisterDto
    ){
        return this.authService.register(registerDto);
    }
    

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(
        @ActiveUser() user: ActiveUserInterface
    ){
        return this.authService.profile(user);
    }

}
