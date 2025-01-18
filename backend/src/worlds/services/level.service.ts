import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from '../entities/level.entity';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';

@Injectable()
export class LevelService {
    constructor(
        @InjectRepository(Level)
        private levelRepository: Repository<Level>,
    ) {}

    create(createLevelDto: CreateLevelDto) {
        const level = this.levelRepository.create(createLevelDto);
        return this.levelRepository.save(level);
    }

    findAll() {
        return this.levelRepository.find();
    }

    findOne(id: number) {
        return this.levelRepository.findOneBy({ id });
    }

    update(id: number, updateLevelDto: UpdateLevelDto) {
        return this.levelRepository.update(id, updateLevelDto);
    }

    remove(id: number) {
        return this.levelRepository.delete(id);
    }
}