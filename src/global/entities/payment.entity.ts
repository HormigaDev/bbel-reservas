import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'numeric' })
    amount: number;

    @Column({ name: 'payment_method', type: 'varchar', length: 50 })
    paymentMethod: string;

    @Column({ type: 'varchar' })
    status: string;

    @Column({ name: 'payment_date', type: 'date', default: 'CURRENT_DATE' })
    paymentDate: Date;

    @Column({ name: 'reservation_id', type: 'integer', nullable: false })
    reservationId: number;
}
