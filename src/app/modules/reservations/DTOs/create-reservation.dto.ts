import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
    @IsNotEmpty({ message: 'La fecha de reserva es requerida' })
    @IsString({ message: 'La fecha de reserva es inválida' })
    reservationDate: string;

    @IsNotEmpty({ message: 'La hora inicial de la reserva es requerida' })
    @IsString({ message: 'La hora inicial de la reserva es inválida' })
    startTime: string;

    @IsNotEmpty({ message: 'La hora final de la reserva es requerida' })
    @IsString({ message: 'La hora final de la reserva es inválida' })
    endTime: string;

    @IsNotEmpty({ message: 'El id del usuario es requerido' })
    @IsNumber(
        {},
        { message: 'El id del usuario debe ser un número entero válido' },
    )
    userId: number;

    @IsNotEmpty({ message: 'El id del recurso es requerido' })
    @IsNumber({}, { message: 'El id del recurso debe ser un número válido' })
    resourceId: number;
}
