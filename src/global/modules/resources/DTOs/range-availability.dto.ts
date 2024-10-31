import { IsDate, IsNotEmpty } from 'class-validator';

export class RangeAvailabilityDto {
    @IsNotEmpty({ message: 'La fecha de inicio del período es requerida' })
    @IsDate({ message: 'La fecha de inicio del período es inválida' })
    start: Date;

    @IsNotEmpty({ message: 'La fecha final del período es requerida' })
    @IsDate({ message: 'La fecha final del período es inválida' })
    end: Date;
}
