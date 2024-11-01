import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/app/modules/users/DTOs/create-user.dto';
import { User } from 'src/app/entities/user.entity';
import { UsersServiceInterface } from 'src/app/modules/users/users.service.interface';
import { Repository } from 'typeorm';
import { UpdateUserDto } from 'src/app/modules/users/DTOs/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { ChangeUserPasswordDto } from 'src/app/modules/users/DTOs/change-user-password.dto';
import {
    filterNonNullableProps,
    EmailRegex,
    NameRegex,
    PhoneRegex,
    PasswordRegex,
    validateLimit,
} from 'src/app/helpers/service.helper';
import { QueryEntityDto } from 'src/app/DTOs/query-entity.dto';
import { LoginDto } from './DTOs/login.dto';

@Injectable()
export class UsersService implements UsersServiceInterface {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthService,
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

        if (!PasswordRegex.test(dto.password)) {
            throw new BadRequestException(
                [
                    'La contraseña es inválida.',
                    'La contraseña debe tener 1 caracter especial, 1 letra minúscula,',
                    '1 letra mayúscula y debe tener al menos 8 caracteres',
                ].join(' '),
            );
        }

        dto.password = await this.authService.hashPassword(dto.password);

        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    async findById(id: number): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException(
                `No se ha encontrado ningún usuario con el ID: ${id}`,
            );
        }

        delete user.password;
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

    async login(dto: LoginDto): Promise<string> {
        const user = await this.findByEmail(dto.email);
        if (!user) {
            throw new NotFoundException(
                `No se ha encontrado ningun usuario con el email: ${dto.email}`,
            );
        }

        if (
            !(await this.authService.verifyPassword(
                dto.password,
                user.password,
            ))
        ) {
            throw new UnauthorizedException(`Usuario o contraseña incorrectos`);
        }
        return await this.authService.generateToken(user);
    }

    async changePassword(
        id: number,
        dto: ChangeUserPasswordDto,
    ): Promise<void> {
        await this.validateUser(id);
        await this.verifyPassword(id, null, dto.prevPassword);

        if (dto.prevPassword === dto.newPassword) {
            throw new BadRequestException(
                'La nueva contraseña no puede ser igual a la anterior',
            );
        }

        if (!PasswordRegex.test(dto.newPassword)) {
            throw new BadRequestException(
                [
                    'La contraseña nueva debe contener al menos 1 caracter especial,',
                    '1 letra minúscula, 1 letra mayúscula y tener al menos 8 caracteres.',
                ].join(' '),
            );
        }

        const hashedPassword = await this.authService.hashPassword(
            dto.newPassword,
        );
        const result = await this.userRepository
            .createQueryBuilder()
            .update()
            .set({ password: hashedPassword })
            .where('id = :id', { id })
            .execute();

        if (result.affected === 0) {
            throw new BadRequestException(
                'No se pudo actualizar la contraseña. Intente nuevamente.',
            );
        }
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
     * Verifica si existe el usuario y si la contraseña es correspondiente
     * a la que está en la base de datos
     * Nota: debe ser informado un ID o un email, se considera primero el id y luego el email.
     * @param id - El id del usuario a validar (opcional)
     * @param email - El email del usuario a validar (opcional)
     * @param password - La contraseña actual del usuario
     * @throws {NotFoundException | UnauthorizedException}
     */
    private async verifyPassword(
        id: number | null,
        email: string | null,
        password: string,
    ): Promise<void> {
        let user: User;
        if (id) {
            user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new NotFoundException(
                    `No se ha encontrado ningún usuario con el ID: ${id}`,
                );
            }
        }
        if (email) {
            user = await this.findByEmail(email);
            if (!user) {
                throw new NotFoundException(
                    `No se ha encontrado ningún usuario con el email: ${email}`,
                );
            }
        }

        const isPasswordCorrect = await this.authService.verifyPassword(
            password,
            user.password,
        );
        if (!isPasswordCorrect) {
            throw new UnauthorizedException(
                `La contraseña actual informada es inválida`,
            );
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
