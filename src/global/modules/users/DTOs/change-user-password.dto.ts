import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserPasswordDto {
    @IsNotEmpty({ message: 'La contraseña antigua es requerida' })
    @IsString({ message: 'La contraseña antigua debe ser un texto válido' })
    prevPassword: string;

    @IsNotEmpty({ message: 'La contraseña nueva es requerida' })
    @IsString({ message: 'La contraseña nueva debe ser un texto válido' })
    newPassword: string;
}
