import { Reservation } from 'src/app/entities/reservation.entity';
import { CreateReservationDto } from './DTOs/create-reservation.dto';
import { UpdateReservationDto } from './DTOs/update-reservation.dto';
import { ReservationQueryDto } from './DTOs/reservation-query.dto';
import { QueryEntityDto } from 'src/app/DTOs/query-entity.dto';

export interface ReservationsServiceInterface {
    createReservation(dto: CreateReservationDto): Promise<Reservation>;

    findById(id: number): Promise<Reservation>;

    getReservations(
        dto: ReservationQueryDto,
    ): Promise<{ reservations: Reservation[]; count: number }>;

    getAllReservations(
        dto: QueryEntityDto,
    ): Promise<{ reservations: Reservation[]; count: number }>;

    updateReservation(id: number, dto: UpdateReservationDto): Promise<void>;

    deleteReservation(id: number): Promise<void>;
}
