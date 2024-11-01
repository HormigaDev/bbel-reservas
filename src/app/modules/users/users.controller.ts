import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { LoginDto } from './DTOs/login.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { User } from 'src/app/entities/user.entity';
import { UpdateUserDto } from './DTOs/update-user.dto';
import { ChangeUserPasswordDto } from './DTOs/change-user-password.dto';
import { AdminGuard } from 'src/app/guards/roles.guard';

/**
 * Controlador que gestiona la lógica de usuarios y autenticación de los mismos
 */
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    //CREATE
    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto) {
        const token: string = await this.userService.login(loginDto);
        return { token };
    }

    @Post('register')
    @HttpCode(201)
    async register(@Body() registerDto: CreateUserDto) {
        const user: User = await this.userService.createUser(registerDto);
        return { user };
    }

    //READ
    @Get(':id')
    @HttpCode(200)
    async getUser(@Param('id') id: number): Promise<{ user: User }> {
        const user: User = await this.userService.findById(id);
        return { user };
    }

    @Get('all')
    @HttpCode(200)
    @UseGuards(AdminGuard)
    async getUsers(
        @Query('limit') limit: number,
        @Query('page') page: number,
    ): Promise<{ users: User[] }> {
        const users = await this.userService.getUsers({
            perPage: limit,
            page: page,
        });

        return { users };
    }

    @Get('search')
    @HttpCode(200)
    @UseGuards(AdminGuard)
    async searchUsers(
        @Query('limit') limit: number,
        @Query('page') page: number,
        @Query('text') text: string,
    ): Promise<{ users: User[] }> {
        const users = await this.userService.searchUsers({
            perPage: limit,
            page: page,
            query: text,
        });
        return { users };
    }

    //UPDATE
    @Put(':id')
    @HttpCode(204)
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<void> {
        await this.userService.updateUser(id, updateUserDto);
        return;
    }

    @Patch(':id/change-password')
    @HttpCode(204)
    async changeUserPassword(
        @Param('id') id: number,
        @Body() changePasswordDto: ChangeUserPasswordDto,
    ): Promise<object> {
        await this.userService.changePassword(id, changePasswordDto);
        return {};
    }

    //DELETE
    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: number): Promise<object> {
        await this.userService.deleteUser(id);
        return {};
    }
}
