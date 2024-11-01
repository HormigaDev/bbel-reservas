import { User } from "src/app/entities/user.entity";
import { LoginDto } from "../users/DTOs/login.dto";
import { CreateUserDto } from "../users/DTOs/create-user.dto";
import { ChangeUserPasswordDto } from "../users/DTOs/change-user-password.dto";

export interface AuthServiceInterface {
    login(dto: LoginDto): Promise<string>;

    register(dto: CreateUserDto): Promise<{token: string, user: User}>;

    changePassword(id: number, dto: ChangeUserPasswordDto): Promise<void>;
}