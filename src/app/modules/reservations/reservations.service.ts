import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ReservationsServiceInterface } from './reservations.service.interface';
import { Reservation } from 'src/app/entities/reservation.entity';
import { CreateReservationDto } from './DTOs/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableResourceForReservationDto } from './DTOs/available-resource-for-reservation.dto';
import {
    DateRegex,
    filterNonNullableProps,
    TimeRegex,
    validateLimit,
} from 'src/app/helpers/service.helper';
import { ReservationStatus } from './enums/reservation-status.enum';
import { UsersService } from '../users/users.service';
import { ResourcesService } from '../resources/resources.service';
import { UpdateReservationDto } from './DTOs/update-reservation.dto';
import { ReservationQueryDto } from './DTOs/reservation-query.dto';
import { QueryEntityDto } from 'src/app/DTOs/query-entity.dto';

@Injectable()
export class ReservationsService implements ReservationsServiceInterface {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        private readonly userService: UsersService,
        private readonly resourceService: ResourcesService,
    ) {}

    async createReservation(dto: CreateReservationDto): Promise<Reservation> {
        const isAvailable = await this.isAvailableResourceForReservation({
            reservationDate: dto.reservationDate,
            startTime: dto.startTime,
            endTime: dto.endTime,
        });

        if (!isAvailable) {
            throw new ConflictException(
                `El recurso ya está reservado para la fecha y horario especificados`,
            );
        }

        await this.userService.validateUser(dto.userId);
        await this.resourceService.validateResource(dto.resourceId);

        const reservation = this.reservationRepository.create(dto);
        return await this.reservationRepository.save(reservation);
    }

    async findById(id: number): Promise<Reservation> {
        const reservation = await this.reservationRepository.findOneBy({ id });
        return reservation;
    }

    async getReservations(
        dto: ReservationQueryDto,
    ): Promise<{ reservations: Reservation[]; count: number }> {
        const limit = validateLimit(dto.perPage);

        if (!DateRegex.test(dto.startDate) || !DateRegex.test(dto.endDate)) {
            throw new BadRequestException(
                'Las fechas de inicio y fin deben cumplir el formato YYYY-MM-DD',
            );
        }
        if (!TimeRegex.test(dto.startTime) || !TimeRegex.test(dto.endTime)) {
            throw new BadRequestException(
                'Los horarios de inicio y fin deben cumplir el formato HH:MM:SS',
            );
        }

        const reservations: Reservation[] = await this.reservationRepository
            .createQueryBuilder('r')
            .where(
                'r.reservation_date between (:startDate)::date and (:endDate)::date',
                { startDate: dto.startDate, endDate: dto.endDate },
            )
            .andWhere('r.start_time >= (:startTime)::time', {
                startTime: dto.startTime,
            })
            .andWhere('r.end_time <= (:endTime)::time', {
                endTime: dto.endTime,
            })
            .take(limit)
            .skip(dto.page * limit)
            .getMany();

        const reservationsCount: number = await this.reservationRepository
            .createQueryBuilder('r')
            .where(
                'r.reservation_date between (:startDate)::date and (:endDate)::date',
                { startDate: dto.startDate, endDate: dto.endDate },
            )
            .andWhere('r.start_time >= (:startTime)::time', {
                startTime: dto.startTime,
            })
            .andWhere('r.end_time <= (:endTime)::time', {
                endTime: dto.endTime,
            })
            .getCount();

        return { reservations: reservations ?? [], count: reservationsCount };
    }

    async getAllReservations(
        dto: QueryEntityDto,
    ): Promise<{ reservations: Reservation[]; count: number }> {
        const limit = validateLimit(dto.perPage);
        const reservations: Reservation[] =
            await this.reservationRepository.find({
                take: limit,
                skip: dto.page * limit,
            });

        const reservationsCount: number = await this.reservationRepository
            .createQueryBuilder()
            .getCount();

        return { reservations: reservations ?? [], count: reservationsCount };
    }

    async updateReservation(
        id: number,
        dto: UpdateReservationDto,
    ): Promise<void> {
        const props = filterNonNullableProps(dto);
        if (Object.keys(props).length === 0) {
            throw new BadRequestException(
                `No se proporcionó ninguna información para actualizar la reserva`,
            );
        }

        await this.reservationRepository
            .createQueryBuilder()
            .update()
            .set(props)
            .where('id = :id', { id })
            .execute();
    }

    async deleteReservation(id: number): Promise<void> {
        await this.validateReservation(id);
        await this.reservationRepository.delete({ id });
    }

    private async validateReservation(id: number) {
        const queryRunner = this.reservationRepository.queryRunner;

        await queryRunner.connect();
        try {
            const result = await queryRunner.query(
                `
                select true as exists from reservations
                where id = $1
            `,
                [id],
            );

            if (result.length === 0) {
                throw new NotFoundException(
                    `No se ha encontrado ninguna reserva con el ID: ${id}`,
                );
            }
        } finally {
            await queryRunner.release();
        }
    }

    private async isAvailableResourceForReservation(
        dto: AvailableResourceForReservationDto,
    ): Promise<boolean> {
        if (!DateRegex.test(dto.reservationDate)) {
            throw new BadRequestException(`La fecha de reserva es inválida`);
        }
        if (!TimeRegex.test(dto.startTime)) {
            throw new BadRequestException(`El horario inicial es inválido`);
        }
        if (!TimeRegex.test(dto.endTime)) {
            throw new BadRequestException(`El horario final es inválido`);
        }

        const queryRunner = this.reservationRepository.queryRunner;
        await queryRunner.connect();
        try {
            const result = await queryRunner.query(
                `
                    select true as exists from reservations
                    where
                        reservation_date = ($1)::date
                        and ($2)::time >= start_time
                        and ($3)::time <= end_time
                        and status not in ($4, $5)   
                    limit 1;
                `,
                [
                    dto.reservationDate,
                    dto.startTime,
                    dto.endTime,
                    ReservationStatus.Cancelled,
                    ReservationStatus.Pending,
                ],
            );
            if (result.length === 0) {
                return true;
            } else {
                return false;
            }
        } finally {
            queryRunner.release();
        }
    }
}
