import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 15 })
    phone: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'varchar', length: 20 })
    role: string;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
