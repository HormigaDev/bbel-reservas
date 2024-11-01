import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/app/entities/user.entity';
import { LoginDto } from '../users/DTOs/login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/DTOs/create-user.dto';
import { PasswordRegex } from 'src/app/helpers/service.helper';
import { AuthServiceInterface } from './auth.service.interface';
import { ChangeUserPasswordDto } from '../users/DTOs/change-user-password.dto';

@Injectable()
export class AuthService implements AuthServiceInterface {
    constructor(
        private readonly userService: UsersService,
    ) {}

    async login(dto: LoginDto): Promise<string> {
        const unauthorizedMessage = 'Email o contraseña incorrectos';
        const user = await this.userService.findByEmail(dto.email);
        if(!user){
            throw new NotFoundException(unauthorizedMessage);
        }
        await this.verifyPassword(dto.password, user.password);

        const token = await this.generateToken(user);
        return token;
    }

    async register(dto: CreateUserDto){
        await this.userService.checkUserExists(dto.email);
        if (!PasswordRegex.test(dto.password)) {
            throw new BadRequestException(
                [
                    'La contraseña es inválida.',
                    'La contraseña debe tener 1 caracter especial, 1 letra minúscula,',
                    '1 letra mayúscula y debe tener al menos 8 caracteres',
                ].join(' '),
            );
        }
        dto.password = await this.hashPassword(dto.password);
        const user = await this.userService.createUser(dto);
        const token = await this.generateToken(user);
        delete user.password;
        return {token, user};
    }

    async changePassword(id: number, dto: ChangeUserPasswordDto): Promise<void> {
        const user = await this.userService.findById(id, true);
        await this.verifyPassword(dto.prevPassword, user.password);
        if (!PasswordRegex.test(dto.newPassword)) {
            throw new BadRequestException(
                [
                    'La nueva contraseña es inválida.',
                    'La contraseña debe tener 1 caracter especial, 1 letra minúscula,',
                    '1 letra mayúscula y debe tener al menos 8 caracteres',
                ].join(' '),
            );
        }
    
        const newPassword = await this.hashPassword(dto.newPassword);
        await this.userService.updateUser(id, {password: newPassword});
    }

    private async generateToken(user: User): Promise<string> {
        const payload: Record<string, any> = {
            id: user.id,
            email: user.email,
            expiresIn: '2h',
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
        return token;
    }

    async validateToken(
        token: string,
    ): Promise<{ id: number; email: string; expiresIn: string }> {
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!decoded.id || !decoded.email) {
                throw new UnauthorizedException(
                    `No autorizado, token inválido`,
                );
            }

            return {
                id: decoded.id,
                email: decoded.email,
                expiresIn: decoded.expiresIn,
            };
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException(`Token inválido o expirado`);
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, process.env.BCRYPT_SALT_ROUNDS);
    }

    private async verifyPassword(
        password: string,
        encrypted: string,
    ): Promise<void> {
        const isPasswordCorrect = await bcrypt.compare(password, encrypted);
        if(!isPasswordCorrect){
            throw new UnauthorizedException('Email o contraseña incorrectos');
        }
    }
}
