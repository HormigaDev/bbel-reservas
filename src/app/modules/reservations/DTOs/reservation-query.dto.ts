import { IsNotEmpty, IsString } from 'class-validator';
import { QueryEntityDto } from 'src/app/DTOs/query-entity.dto';

export class ReservationQueryDto extends QueryEntityDto {
    @IsNotEmpty({ message: 'La fecha inicial es requerida' })
    @IsString({ message: 'La fecha inicial es inválida' })
    startDate: string;

    @IsNotEmpty({ message: 'La fecha final es requerida' })
    @IsString({ message: 'La fecha final es inválida' })
    endDate: string;

    @IsNotEmpty({ message: 'El horario inicial es requerido' })
    @IsString({ message: 'El horario inicial es inválido' })
    startTime: string;

    @IsNotEmpty({ message: 'El horario final es requerido' })
    @IsString({ message: 'El horario final es inválido' })
    endTime: string;
}
