import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/app/entities/user.entity';

@Injectable()
export class AuthService {
    constructor() {}

    async generateToken(user: User): Promise<string> {
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

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async verifyPassword(
        password: string,
        encrypted: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, encrypted);
    }
}
