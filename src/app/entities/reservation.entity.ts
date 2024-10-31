import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'reservation_date', type: 'date', default: 'CURRENT_DATE' })
    reservationDate: Date;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ type: 'varchar', length: 20 })
    status: string;

    @Column({ name: 'created_at', type: 'timestamp', default: 'CURRENT_DATE' })
    createdAt: Date;

    @Column({ name: 'user_id', type: 'integer', nullable: false })
    userId: number;

    @Column({ name: 'resource_id', type: 'integer', nullable: false })
    resourceId: number;
}
