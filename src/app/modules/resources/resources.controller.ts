import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { Resource } from 'src/app/entities/resource.entity';
import { RegisterResourceDto } from './DTOs/register-resource.dto';
import { AdminGuard } from 'src/app/guards/roles.guard';
import { UpdateResourceDto } from './DTOs/update-resource.dto';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourceService: ResourcesService) {}

    @Get('all')
    @HttpCode(200)
    async getAllResources(
        @Query('limit') limit: number,
        @Query('page') page: number,
    ): Promise<{ resources: Resource[]; count: number }> {
        const data: { resources: Resource[]; count: number } =
            await this.resourceService.getResources({ perPage: limit, page });
        return data;
    }

    @Get('search')
    @HttpCode(200)
    async searchResources(
        @Query('limit') limit: number,
        @Query('page') page: number,
        @Query('text') text: string,
    ): Promise<{ resources: Resource[]; count: number }> {
        const data: { resources: Resource[]; count: number } =
            await this.resourceService.searchResources({
                perPage: limit,
                page,
                query: text,
            });

        return data;
    }

    @Post('create')
    @HttpCode(201)
    @UseGuards(AdminGuard)
    async createResource(
        @Body() dto: RegisterResourceDto,
    ): Promise<{ resource: Resource }> {
        const resource: Resource =
            await this.resourceService.registerResource(dto);
        return { resource };
    }

    @Put('update/:id')
    @HttpCode(204)
    @UseGuards(AdminGuard)
    async updateResource(
        @Param('id') id: number,
        dto: UpdateResourceDto,
    ): Promise<object> {
        await this.resourceService.updateResource(id, dto);
        return {};
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AdminGuard)
    async deleteResource(@Param('id') id: number): Promise<object> {
        await this.resourceService.deleteResource(id);
        return {};
    }
}
