import { Module } from '@nestjs/common';
import { UsersService } from 'src/app/modules/users/users.service';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { UsersController } from 'src/app/modules/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/app/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, AuthService],
    exports: [UsersService],
})
export class UsersModule {}
