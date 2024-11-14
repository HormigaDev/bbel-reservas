import { Body, Controller, HttpCode, Patch, Post, Req } from '@nestjs/common';
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
    async login(
        @Body() loginDto: LoginDto,
    ): Promise<{ token: string; user: User }> {
        const data: { token: string; user: User } =
            await this.authService.login(loginDto);
        return data;
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

    @Patch('change-password/')
    @HttpCode(204)
    async changePassword(
        @Req() req: Request,
        @Body() changePasswordDto: ChangeUserPasswordDto,
    ): Promise<object> {
        const session = req['user'];
        await this.authService.changePassword(session?.id, changePasswordDto);
        return {};
    }
}
