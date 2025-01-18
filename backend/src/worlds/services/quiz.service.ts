import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';

@Injectable()
export class QuizService {
    constructor(
        @InjectRepository(Quiz)
        private quizRepository: Repository<Quiz>,
    ) {}

    create(createQuizDto: CreateQuizDto) {
        const quiz = this.quizRepository.create(createQuizDto);
        return this.quizRepository.save(quiz);
    }

    findAll() {
        return this.quizRepository.find();
    }

    findOne(id: number) {
        return this.quizRepository.findOneBy({ id });
    }

    update(id: number, updateQuizDto: UpdateQuizDto) {
        return this.quizRepository.update(id, updateQuizDto);
    }

    remove(id: number) {
        return this.quizRepository.delete(id);
    }
}