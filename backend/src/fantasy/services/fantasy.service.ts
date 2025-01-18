import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Fantasy} from "../entities/fantasy.entity";
import {CreateFantasyDto} from "../dto/create-fantasy.dto";
import {UpdateFantasyDto} from "../dto/update-fantasy.dto";


@Injectable()
export class FantasyService {
    constructor(
        @InjectRepository(Fantasy)
        private fantasyRepository: Repository<Fantasy>,
    ) {}

    async create(createFantasyDto: CreateFantasyDto): Promise<Fantasy> {
        const fantasy = this.fantasyRepository.create(createFantasyDto);
        return this.fantasyRepository.save(fantasy);
    }

    async findAll(): Promise<Fantasy[]> {
        return this.fantasyRepository.find();
    }

    async findOne(id: number): Promise<Fantasy> {
        return this.fantasyRepository.findOneBy({ id });
    }

    async update(id: number, updateFantasyDto: UpdateFantasyDto): Promise<Fantasy> {
        await this.fantasyRepository.update(id, updateFantasyDto);
        return this.fantasyRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.fantasyRepository.delete(id);
    }
}