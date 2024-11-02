import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { UserRoles } from '../modules/users/enums/user.roles.enum';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request['user'];

        if (!user) {
            throw new ForbiddenException(
                'No se encontró el usuario en la solicitud.',
            );
        }

        if (user.role !== UserRoles.Administrator) {
            throw new ForbiddenException(
                'Permisos insuficientes para acceder a este recurso.',
            );
        }

        return true;
    }
}
