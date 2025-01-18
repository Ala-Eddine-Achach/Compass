import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentLevelStatus } from '../entities/student-level-status.entity';
import { CreateStudentLevelStatusDto } from '../dto/create-student-level-status.dto';
import { UpdateStudentLevelStatusDto } from '../dto/update-student-level-status.dto';

@Injectable()
export class StudentLevelStatusService {
    constructor(
        @InjectRepository(StudentLevelStatus)
        private statusRepository: Repository<StudentLevelStatus>,
    ) {}

    create(createStatusDto: CreateStudentLevelStatusDto) {
        const status = this.statusRepository.create(createStatusDto);
        return this.statusRepository.save(status);
    }

    findAll() {
        return this.statusRepository.find();
    }

    findOne(id: number) {
        return this.statusRepository.findOneBy({ id });
    }

    update(id: number, updateStatusDto: UpdateStudentLevelStatusDto) {
        return this.statusRepository.update(id, updateStatusDto);
    }

    remove(id: number) {
        return this.statusRepository.delete(id);
    }
}