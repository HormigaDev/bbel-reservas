import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class AvailableResourceDto {
    @IsNotEmpty({ message: 'El id del recurso es requrido' })
    @IsNumber({}, { message: 'El id del recurso debe ser un número válido' })
    id: number;

    @IsNotEmpty({
        message: 'Se requiere informar la fecha inicial de la disponibilidad',
    })
    @IsDate({ message: 'La fecha inicial debe ser válida' })
    startDate: Date;

    @IsNotEmpty({ message: 'Se require la fecha final de la disponibilidad' })
    @IsDate({ message: 'La fecha final debe ser válida' })
    endDate: Date;
}
