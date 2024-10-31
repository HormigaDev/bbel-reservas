import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class RegisterResourceDto {
    @IsNotEmpty({ message: 'El nombre del recurso es requerido' })
    @IsString({ message: 'El nombre del recurso debe ser un texto válido' })
    @Length(3, 100, {
        message: 'El nombre del recurso debe tener entre 3 y 100 caracteres',
    })
    name: string;

    @IsOptional()
    @IsString({
        message: 'La descripción del recurso debe ser un texto válido',
    })
    description?: string;

    @IsNotEmpty({ message: 'Es necesario informar el precio del recurso' })
    @IsNumber({}, { message: 'El valor del recurso es inválido' })
    price: number;
}
