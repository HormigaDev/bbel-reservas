import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/app/entities/reservation.entity';
import { UsersModule } from '../users/users.module';
import { ResourcesModule } from '../resources/resources.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reservation]),
        UsersModule,
        ResourcesModule,
    ],
    providers: [ReservationsService],
    controllers: [ReservationsController],
    exports: [ReservationsService],
})
export class ReservationsModule {}
