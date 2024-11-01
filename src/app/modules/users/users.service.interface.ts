import { QueryEntityDto } from '../../DTOs/query-entity.dto';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';
import { User } from '../../entities/user.entity';

export interface UsersServiceInterface {
    createUser(dto: CreateUserDto): Promise<User>;

    findById(id: number): Promise<User>;

    getUserById(id: number): Promise<User>;

    findByEmail(email: string): Promise<User>;

    searchUsers(dto: QueryEntityDto): Promise<{ users: User[]; count: number }>;

    getUsers(dto: QueryEntityDto): Promise<{ users: User[]; count: number }>;

    updateUser(id: number, dto: UpdateUserDto): Promise<void>;

    deleteUser(id: number): Promise<void>;

    validateUser(id: number): Promise<void>;
}
