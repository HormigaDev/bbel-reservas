import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryEntityDto {
    @IsNotEmpty({ message: 'El límite de registros es requerido' })
    @IsNumber(
        {},
        { message: 'El límite de registros debe ser un número válido' },
    )
    perPage: number;

    @IsNotEmpty({ message: 'La página es requerida' })
    @IsNumber({}, { message: 'La página debe ser un número válido' })
    page: number;

    @IsOptional()
    @IsString({ message: 'Se requiere un textó válido para consulta' })
    query?: string;
}
