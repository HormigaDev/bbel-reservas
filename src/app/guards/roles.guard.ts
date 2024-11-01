import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { UserRoles } from '../modules/users/enums/user.roles.enum';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const sessionUser = request['user'];

        if (!sessionUser) {
            throw new ForbiddenException(
                'No se encontró el usuario en la solicitud.',
            );
        }

        const user = await this.usersService.findById(sessionUser.id);

        if (user.role !== UserRoles.Administrator) {
            throw new ForbiddenException(
                'Permisos insuficientes para acceder a este recurso.',
            );
        }

        return true;
    }
}
