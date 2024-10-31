import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class UpdateReservationDto {
    @IsOptional()
    @IsDate({ message: 'La fecha de la reserva es inválida' })
    reservationDate?: Date;

    @IsOptional()
    @IsString({ message: 'El horario inicial es inválido' })
    startTime?: string;

    @IsOptional()
    @IsString({ message: 'El horario final es inválido' })
    endTime?: string;

    @IsOptional()
    @IsEnum(ReservationStatus, {
        message: 'El status de la reserva es inválido',
    })
    status?: ReservationStatus;
}
