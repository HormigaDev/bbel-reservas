import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from 'src/app/entities/resource.entity';
import { Repository } from 'typeorm';
import { ResourcesServiceInterface } from './resources.service.interface';
import { RegisterResourceDto } from './DTOs/register-resource.dto';
import { QueryEntityDto } from 'src/app/DTOs/query-entity.dto';
import {
    filterNonNullableProps,
    validateLimit,
} from 'src/app/helpers/service.helper';
import { UpdateResourceDto } from './DTOs/update-resource.dto';

@Injectable()
export class ResourcesService implements ResourcesServiceInterface {
    constructor(
        @InjectRepository(Resource)
        private readonly resourceRepository: Repository<Resource>,
    ) {}

    async registerResource(dto: RegisterResourceDto): Promise<Resource> {
        await this.checkResourceExists(dto.name);

        const resource = this.resourceRepository.create(dto);
        return await this.resourceRepository.save(resource);
    }

    async findById(id: number): Promise<Resource | null> {
        const resource: Resource | null =
            await this.resourceRepository.findOneBy({
                id,
            });
        if (!resource) {
            return null;
        }
        return resource;
    }

    async getResources(dto: QueryEntityDto): Promise<Resource[]> {
        const limit = validateLimit(dto.perPage);
        const resources = await this.resourceRepository.find({
            take: limit,
            skip: dto.page,
        });
        return resources;
    }

    async searchResources(dto: QueryEntityDto): Promise<Resource[]> {
        const limit = validateLimit(dto.perPage);
        if (!dto.query) {
            throw new BadRequestException(
                `No se ha informado el criterio de busqueda`,
            );
        }

        const resources = await this.resourceRepository
            .createQueryBuilder('r')
            .take(limit)
            .skip(dto.page)
            .where('r.name like :name', { name: `%${dto.query}%` })
            .orWhere('r.description like :description', {
                description: `%${dto.query}%`,
            })
            .getMany();

        return resources;
    }

    async updateResource(id: number, dto: UpdateResourceDto): Promise<void> {
        await this.validateResource(id);

        const props = filterNonNullableProps(dto);
        if (Object.keys(props).length === 0) {
            throw new BadRequestException(
                `No se proporcionó ninguna información para actualizar el recurso`,
            );
        }

        await this.resourceRepository
            .createQueryBuilder()
            .update()
            .set(props)
            .where('id = :id', { id })
            .execute();
    }

    async deleteResource(id: number): Promise<void> {
        await this.validateResource(id);
        await this.resourceRepository.delete({ id });
    }

    async validateResource(id: number): Promise<void> {
        /* const resource = await this.findById(id);
        if (!resource) {
            throw new NotFoundException(
                `No existe ningún recurso con el ID: ${id}`,
            );
        } */
        const queryRunner = this.resourceRepository.queryRunner;

        await queryRunner.connect();
        try {
            const result = await queryRunner.query(
                `
                select true as exists from resources
                where id = $1    
            `,
                [id],
            );

            if (result.length === 0) {
                throw new NotFoundException(
                    `No existe ningún recurso con el ID: ${id}`,
                );
            }
        } finally {
            await queryRunner.release();
        }
    }

    private async checkResourceExists(name: string): Promise<void> {
        const exists = await this.resourceRepository
            .createQueryBuilder('r')
            .where('r.name = :name', { name })
            .getCount();

        if (exists) {
            throw new ConflictException(
                `Ya existe un recurso registrado con el nombre: ${name}`,
            );
        }
    }
}
