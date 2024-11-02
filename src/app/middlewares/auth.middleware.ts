import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                throw new UnauthorizedException(
                    'Token de autorización no proporcionado',
                );
            }

            const token = authHeader.split(' ')[1]; // Asumiendo formato "Bearer <token>"

            if (!token) {
                throw new UnauthorizedException('Formato de token inválido');
            }

            // Validar el token usando AuthService
            const data = await this.authService.validateToken(token);

            const user = await this.userService.findById(Number(data?.id));
            req['user'] = user;

            next(); // Continuar con la siguiente función o controlador
        } catch (err) {
            (_ => _)(err);
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }
}
