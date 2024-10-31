import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString({ message: 'El nombre debe ser un texto válido' })
    name: string;

    @IsNotEmpty({ message: 'El email es requerido' })
    @IsString({ message: 'El email debe ser un texto válido' })
    email: string;

    @IsOptional()
    @IsString({
        message:
            'El número de teléfono debe ser un texto válido (secuencia de números)',
    })
    phone: string;

    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @IsString({ message: 'La contraseña debe ser un texto válido' })
    password: string;
}
