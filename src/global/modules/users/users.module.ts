import { Module } from '@nestjs/common';
import { UsersService } from 'src/global/modules/users/users.service';
import { AuthService } from 'src/global/modules/auth/auth.service';
import { UsersController } from 'src/global/modules/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/global/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, AuthService],
    exports: [UsersService],
})
export class UsersModule {}
