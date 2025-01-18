import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import {StudentLevelStatusService} from "../services/student-level-status.service";
import {CreateStudentLevelStatusDto} from "../dto/create-student-level-status.dto";
import {UpdateStudentLevelStatusDto} from "../dto/update-student-level-status.dto";


@Controller('student-level-status')
export class StudentLevelStatusController {
    constructor(private readonly statusService: StudentLevelStatusService) {}

    @Post()
    create(@Body() createStatusDto: CreateStudentLevelStatusDto) {
        return this.statusService.create(createStatusDto);
    }

    @Get()
    findAll() {
        return this.statusService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.statusService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateStatusDto: UpdateStudentLevelStatusDto) {
        return this.statusService.update(+id, updateStatusDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.statusService.remove(+id);
    }
}