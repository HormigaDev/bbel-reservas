import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto válido' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'El número de teléfono debe ser un texto válido' })
    phone?: string;

    @IsOptional()
    @IsString({ message: 'El email debe ser un texto válido' })
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
}
