import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { World } from '../entities/world.entity';
import { CreateWorldDto } from '../dto/create-world.dto';
import { UpdateWorldDto } from '../dto/update-world.dto';

@Injectable()
export class WorldService {
    constructor(
        @InjectRepository(World)
        private worldRepository: Repository<World>,
    ) {}

    create(createWorldDto: CreateWorldDto) {
        const world = this.worldRepository.create(createWorldDto);
        return this.worldRepository.save(world);
    }

    findAll() {
        return this.worldRepository.find();
    }

    findOne(id: number) {
        return this.worldRepository.findOneBy({ id });
    }

    update(id: number, updateWorldDto: UpdateWorldDto) {
        return this.worldRepository.update(id, updateWorldDto);
    }

    remove(id: number) {
        return this.worldRepository.delete(id);
    }
}