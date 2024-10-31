import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './global/modules/users/users.module';
import { AuthService } from './global/modules/auth/auth.service';
import { AuthController } from './global/modules/auth/auth.controller';
import { AuthMiddleware } from './global/middlewares/auth.middleware';
import { ResourcesModule } from './global/modules/resources/resources.module';
import { AuthModule } from './global/modules/auth/auth.module';
import { ReservationsModule } from './global/modules/reservations/reservations.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
        }),
        UsersModule,
        ResourcesModule,
        AuthModule,
        ReservationsModule,
    ],
    controllers: [AppController, AuthController],
    providers: [AppService, AuthService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude('public', {
            path: 'auth/login',
            method: RequestMethod.POST,
        });
    }
}
