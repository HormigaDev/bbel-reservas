import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'Necesario informar un e-mail para iniciar sesión' })
    @IsString({ message: 'E-mail inválido' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @IsString({ message: 'La contraseña debe ser un texto válido' })
    password: string;
}
