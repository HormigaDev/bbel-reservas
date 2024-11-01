import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/app/entities/user.entity';
import { UpdateUserDto } from './DTOs/update-user.dto';
import { AdminGuard } from 'src/app/guards/roles.guard';

/**
 * Controlador que gestiona la lógica de usuarios
 */
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @HttpCode(200)
    async getUser(@Req() req: Request): Promise<{ user: User }> {
        const session = req['user'];
        const user: User = await this.userService.findById(session?.id);
        return { user };
    }

    @Get('all')
    @HttpCode(200)
    @UseGuards(AdminGuard)
    async getUsers(
        @Query('limit') limit: number,
        @Query('page') page: number,
    ): Promise<{ users: User[]; count: number }> {
        const data: { users: User[]; count: number } =
            await this.userService.getUsers({
                perPage: limit,
                page: page,
            });

        return data;
    }

    @Get('search')
    @HttpCode(200)
    @UseGuards(AdminGuard)
    async searchUsers(
        @Query('limit') limit: number,
        @Query('page') page: number,
        @Query('text') text: string,
    ): Promise<{ users: User[]; count: number }> {
        const data: { users: User[]; count: number } =
            await this.userService.searchUsers({
                perPage: limit,
                page: page,
                query: text,
            });
        return data;
    }

    @Put()
    @HttpCode(204)
    async updateUser(
        @Req() req: Request,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<object> {
        const session = req['user'];
        await this.userService.updateUser(session?.id, updateUserDto);
        return {};
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AdminGuard)
    async deleteUser(@Param('id') id: number): Promise<object> {
        await this.userService.deleteUser(id);
        return {};
    }
}
