import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesController } from 'src/app/modules/resources/resources.controller';
import { Resource } from 'src/app/entities/resource.entity';
import { ResourcesService } from 'src/app/modules/resources/resources.service';

@Module({
    imports: [TypeOrmModule.forFeature([Resource])],
    controllers: [ResourcesController],
    providers: [ResourcesService],
    exports: [ResourcesService],
})
export class ResourcesModule {}
