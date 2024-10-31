import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesController } from 'src/global/modules/resources/resources.controller';
import { Resource } from 'src/global/entities/resource.entity';
import { ResourcesService } from 'src/global/modules/resources/resources.service';

@Module({
    imports: [TypeOrmModule.forFeature([Resource])],
    controllers: [ResourcesController],
    providers: [ResourcesService],
    exports: [ResourcesService],
})
export class ResourcesModule {}
