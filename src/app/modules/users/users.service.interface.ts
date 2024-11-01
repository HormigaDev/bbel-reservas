import { QueryEntityDto } from '../../DTOs/query-entity.dto';
import { ChangeUserPasswordDto } from './DTOs/change-user-password.dto';
import { CreateUserDto } from './DTOs/create-user.dto';

import { UpdateUserDto } from './DTOs/update-user.dto';
import { User } from '../../entities/user.entity';
import { LoginDto } from './DTOs/login.dto';
import { SessionDto } from './DTOs/session.dto';

export interface UsersServiceInterface {
    createUser(dto: CreateUserDto): Promise<User>;

    findById(id: number): Promise<User>;

    findByEmail(email: string): Promise<User>;

    searchUsers(dto: QueryEntityDto, session: SessionDto): Promise<User[]>;

    getUsers(dto: QueryEntityDto, session: SessionDto): Promise<User[]>;

    updateUser(id: number, dto: UpdateUserDto): Promise<void>;

    deleteUser(id: number): Promise<void>;

    login(dto: LoginDto): Promise<string>;

    changePassword(id: number, dto: ChangeUserPasswordDto): Promise<void>;

    validateUser(id: number): Promise<void>;
}
