import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/app/modules/users/DTOs/create-user.dto';
import { User } from 'src/app/entities/user.entity';
import { UsersServiceInterface } from 'src/app/modules/users/users.service.interface';
import { Repository } from 'typeorm';
import { UpdateUserDto } from 'src/app/modules/users/DTOs/update-user.dto';
import {
    filterNonNullableProps,
    EmailRegex,
    NameRegex,
    PhoneRegex,
    validateLimit,
} from 'src/app/helpers/service.helper';
import { QueryEntityDto } from 'src/app/DTOs/query-entity.dto';

@Injectable()
export class UsersService implements UsersServiceInterface {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        await this.checkUserExists(dto.email);

        if (!EmailRegex.test(dto.email)) {
            throw new BadRequestException(`El email: ${dto.email} es inválido`);
        }

        if (!NameRegex.test(dto.name)) {
            throw new BadRequestException(`El nombre: ${dto.name} es inválido`);
        }

        if (!PhoneRegex.test(dto.phone)) {
            throw new BadRequestException(
                `El número de teléfono: ${dto.phone} es inválido`,
            );
        }

        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    async findById(id: number, withPassword: boolean = false): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException(
                `No se ha encontrado ningún usuario con el ID: ${id}`,
            );
        }

        if (!withPassword){
            delete user.password;
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ email });
        return user;
    }

    async searchUsers(dto: QueryEntityDto): Promise<User[]> {
        const limit = validateLimit(dto.perPage);

        if (!dto.query) {
            throw new BadRequestException(
                `El texto para consulta es requerido`,
            );
        }
        const users: User[] = await this.userRepository
            .createQueryBuilder('u')
            .select()
            .take(limit)
            .skip(dto.perPage * dto.page)
            .where('u.name like :name', { name: `%${dto.query}%` })
            .orWhere('u.email like :email', { email: `%${dto.query}%` })
            .getMany();

        return users ?? [];
    }

    async getUsers(dto: QueryEntityDto): Promise<User[]> {
        const limit = validateLimit(dto.perPage);

        const users: User[] = await this.userRepository.find({
            take: limit,
            skip: dto.page,
        });

        return users ?? [];
    }

    async updateUser(id: number, dto: UpdateUserDto): Promise<void> {
        await this.validateUser(id);

        const props = filterNonNullableProps(dto);
        if (!Object.keys(props).length) {
            throw new BadRequestException(
                `No se proporcionó ningún dato para actualizar el usuario`,
            );
        }

        await this.userRepository
            .createQueryBuilder()
            .update()
            .set(props)
            .where('id = :id', { id })
            .execute();
    }

    async deleteUser(id: number): Promise<void> {
        await this.validateUser(id);

        await this.userRepository.delete({ id });
    }

    async validateUser(id: number): Promise<void> {
        const queryRunner = this.userRepository.queryRunner;

        await queryRunner.connect();
        try {
            const result = await queryRunner.query(
                `
                    select true as exists from users
                    where id = $1
                `,
                [id],
            );
            if (result !== 0) {
                throw new NotFoundException(
                    `No se ha encontrado ningún usuario con el ID: ${id}`,
                );
            }
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Valida si existe el usuario, si ya existe entonces lanza un error http.
     * @param email - El correo electrónico del usuario
     * @throws {ConflictException}
     */
    async checkUserExists(email: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ email });
        if (user) {
            throw new ConflictException(
                `Ya existe un usuario con el email: ${email}`,
            );
        }
    }
}
