import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateResourceDto {
    @IsOptional()
    @IsString({ message: 'El nombre del recurso es inválido' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'La descripción del recurso es inválida' })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: 'El precio del recurso es inválido' })
    price?: number;
}
