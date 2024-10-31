import { IsNotEmpty, IsString } from 'class-validator';

export class AvailableResourceForReservationDto {
    @IsNotEmpty()
    @IsString()
    reservationDate: string;

    @IsNotEmpty()
    @IsString()
    startTime: string;

    @IsNotEmpty()
    @IsString()
    endTime: string;
}
