import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { QuizService } from '../services/quiz.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import {UpdateQuizDto} from "../dto/update-quiz.dto";


@Controller('quizzes')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Post()
    create(@Body() createQuizDto: CreateQuizDto) {
        return this.quizService.create(createQuizDto);
    }

    @Get()
    findAll() {
        return this.quizService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quizService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
        return this.quizService.update(+id, updateQuizDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.quizService.remove(+id);
    }
}