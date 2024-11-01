import { QueryEntityDto } from '../../DTOs/query-entity.dto';
import { RegisterResourceDto } from './DTOs/register-resource.dto';
import { UpdateResourceDto } from './DTOs/update-resource.dto';
import { Resource } from '../../entities/resource.entity';

export interface ResourcesServiceInterface {
    registerResource(dto: RegisterResourceDto): Promise<Resource>;

    findById(id: number): Promise<Resource | null>;

    getResources(
        dto: QueryEntityDto,
    ): Promise<{ resources: Resource[]; count: number }>;

    searchResources(
        dto: QueryEntityDto,
    ): Promise<{ resources: Resource[]; count: number }>;

    updateResource(id: number, dto: UpdateResourceDto): Promise<void>;

    deleteResource(id: number): Promise<void>;

    validateResource(id: number): Promise<void>;
}
