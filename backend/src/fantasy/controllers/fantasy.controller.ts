import {Controller, Get, Post, Body, Param, Put, Delete, UseGuards} from '@nestjs/common';
import {FantasyService} from "../services/fantasy.service";
import {CreateFantasyDto} from "../dto/create-fantasy.dto";
import {UpdateFantasyDto} from "../dto/update-fantasy.dto";
import {JwtAuthGuard} from "../../auth/guard/jwt-auth.guard";
import {User} from "../../user/entities/user.entity";
import {CurrentUser} from "../../decorators/user.decorator";
import {Student} from "../../user/entities/student.entity";
import {SubjectDto, UpdateFantasySubjectsDto} from "../dto/subjects.dto";

@Controller('fantasy')
@UseGuards(JwtAuthGuard)
export class FantasyController {
    constructor(private readonly fantasyService: FantasyService) {}

    @Get()
    async findAll(@CurrentUser() user: Student) {
        return await this.fantasyService.getSubjects(user);
    }
    @Post()
    async create(
        @Body() updateFantasyDto: UpdateFantasySubjectsDto, // Extract the body
        @CurrentUser() user: Student, // Extract the current user
    ) {
        console.log('updateFantasyDto', updateFantasyDto);
        console.log('user', user);
        return await this.fantasyService.updateSubjects(updateFantasyDto, user);
    }

    @Get('subjects')
    async findAllSubjects() {
        return await this.fantasyService.findAllSubjects();
    }

}