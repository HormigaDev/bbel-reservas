import { Reservation } from 'src/global/entities/reservation.entity';
import { CreateReservationDto } from './DTOs/create-reservation.dto';
import { QueryEntityDto } from 'src/global/DTOs/query-entity.dto';
import { UpdateReservationDto } from './DTOs/update-reservation.dto';

export interface ReservationsServiceInterface {
    createReservation(dto: CreateReservationDto): Promise<Reservation>;

    findById(id: number): Promise<Reservation>;

    getReservations(dto: QueryEntityDto): Promise<Reservation[]>;

    updateReservation(id: number, dto: UpdateReservationDto): Promise<void>;

    deleteReservation(id: number): Promise<void>;
}
