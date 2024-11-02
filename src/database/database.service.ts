import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private tablesOrder: string[] = [
        'users',
        'resources',
        'reservations',
        'payments',
    ];
    constructor(private readonly dataSource: DataSource) {}

    async onModuleInit() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const tablesSQLDir = 'src/app/sql/tables';
            for (const tableName of this.tablesOrder) {
                const sql = fs.readFileSync(
                    tablesSQLDir + `/${tableName}.sql`,
                    'utf-8',
                );
                await queryRunner.query(sql);
            }
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(
                `Ha ocurrido un error al ejecutar la base de datos:\n${err}`,
            );
        } finally {
            await queryRunner.release();
        }
    }
}
