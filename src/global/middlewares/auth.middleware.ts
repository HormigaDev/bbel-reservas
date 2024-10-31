import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) {}

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
            const user = await this.authService.validateToken(token);

            // Guardar el usuario en la solicitud para acceder a él más adelante
            req['user'] = user;

            next(); // Continuar con la siguiente función o controlador
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }
}
