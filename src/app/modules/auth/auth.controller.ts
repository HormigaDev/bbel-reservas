import { Body, Controller, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/DTOs/login.dto';
import { CreateUserDto } from '../users/DTOs/create-user.dto';
import { User } from 'src/app/entities/user.entity';
import { ChangeUserPasswordDto } from '../users/DTOs/change-user-password.dto';

/**
 * Controla la autenticación del usuario (login, registro y  cambio de contraseña)
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        const token: string = await this.authService.login(loginDto);
        return { token };
    }

    @Post('register')
    @HttpCode(201)
    async register(
        @Body() registerDto: CreateUserDto,
    ): Promise<{ token: string; user: User }> {
        const data: { token: string; user: User } =
            await this.authService.register(registerDto);
        return data;
    }

    @Patch('change-password/:user')
    @HttpCode(204)
    async changePassword(
        @Param('user') user: number,
        @Body() changePasswordDto: ChangeUserPasswordDto,
    ): Promise<object> {
        await this.authService.changePassword(user, changePasswordDto);
        return {};
    }
}
