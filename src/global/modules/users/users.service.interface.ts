import { QueryEntityDto } from '../../DTOs/query-entity.dto';
import { ChangeUserPasswordDto } from './DTOs/change-user-password.dto';
import { CreateUserDto } from './DTOs/create-user.dto';

import { UpdateUserDto } from './DTOs/update-user.dto';
import { User } from '../../entities/user.entity';

export interface UsersServiceInterface {
    createUser(dto: CreateUserDto): Promise<User>;

    findById(id: number): Promise<User>;

    findByEmail(email: string): Promise<User>;

    searchUsers(dto: QueryEntityDto): Promise<User[]>;

    getUsers(dto: QueryEntityDto): Promise<User[]>;

    updateUser(id: number, dto: UpdateUserDto): Promise<void>;

    deleteUser(id: number): Promise<void>;

    login(email: string, password: string): Promise<string>;

    changePassword(id: number, dto: ChangeUserPasswordDto): Promise<void>;
}
