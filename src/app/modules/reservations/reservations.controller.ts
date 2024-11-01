import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Reservation } from 'src/app/entities/reservation.entity';
import { ReservationsService } from './reservations.service';
import { AdminGuard } from 'src/app/guards/roles.guard';
import { CreateReservationDto } from './DTOs/create-reservation.dto';
import { UpdateReservationDto } from './DTOs/update-reservation.dto';
import { ReservationStatus } from './enums/reservation-status.enum';

/**
 * Gestiona la lógica de reservas y disponibilidad de los recursos
 */
@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationService: ReservationsService) {}

    @Get()
    @HttpCode(200)
    async getReservations(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('startTime') startTime: string,
        @Query('endTime') endTime: string,
        @Query('limit') limit: number,
        @Query('page') page: number,
    ): Promise<{
        reservations: Reservation[];
        count: number;
    }> {
        const data: { reservations: Reservation[]; count: number } =
            await this.reservationService.getReservations({
                startDate,
                endDate,
                startTime,
                endTime,
                perPage: limit,
                page,
            });

        return data;
    }

    @Get('all')
    @HttpCode(200)
    @UseGuards(AdminGuard)
    async getAllReservations(
        @Query('limit') limit: number,
        @Query('page') page: number,
    ): Promise<{ reservations: Reservation[]; count: number }> {
        const data: { reservations: Reservation[]; count: number } =
            await this.reservationService.getAllReservations({
                perPage: limit,
                page,
            });

        return data;
    }

    @Post('reserve')
    @HttpCode(201)
    async registerReservation(
        @Body() dto: CreateReservationDto,
        @Req() req: Request,
    ): Promise<{ reservation: Reservation }> {
        const session = req['user'];
        dto.userId = session?.id;
        const reservation: Reservation =
            await this.reservationService.createReservation(dto);

        return { reservation };
    }

    @Put()
    @HttpCode(204)
    async updateReservation(
        @Body() dto: UpdateReservationDto,
        @Req() req: Request,
    ): Promise<object> {
        const session = req['user'];
        delete dto.status;
        await this.reservationService.updateReservation(session?.id, dto);
        return {};
    }

    @Patch('status/:id/:status')
    @HttpCode(204)
    @UseGuards(AdminGuard)
    async updateReservationStatus(
        @Param('id') id: number,
        @Param('status') status: ReservationStatus,
    ): Promise<object> {
        await this.reservationService.updateReservation(id, { status });
        return {};
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AdminGuard)
    async deleteReservation(@Param('id') id: number): Promise<object> {
        await this.reservationService.deleteReservation(id);
        return {};
    }
}
