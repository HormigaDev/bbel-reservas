import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Resource {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'numeric' })
    price: number;
}
