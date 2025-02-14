import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { StudentService } from './student.service';
import { Student } from '../entities/student.entity';
import { CurrentUser } from '../../decorators/user.decorator';
import { Teacher } from '../entities/teacher.entity';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all')
  // @UseGuards(JwtAuthGuard)
  async findAllStudents() {
    return await this.studentService.findAllStudents();
  }
  @Get('all/:sectorLevel')
  @UseGuards(JwtAuthGuard)
  async findAllStudentsBySectorLevel(
    @Param('sectorLevel') sectorLevel: string,
  ) {
    //console.log(sectorLevel);
    return await this.studentService.findAllStudentsBySectorLevel(sectorLevel);
  }

  @Get('count')
  // @UseGuards(JwtAuthGuard)
  async countStudents() {
    return await this.studentService.countStudents();
  }



  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Student>,
  ) {
    return await this.studentService.updateStudent(id, data);
  }

  @Get('group/teacher')
  @UseGuards(JwtAuthGuard)
  async findAllStudentsByTeacher(@CurrentUser() teacher: Teacher) {
    return await this.studentService.getStudentsByTeacherId(teacher.id);
  }
  @Get('leaderboard')
  async getLeaderboard() {
    console.log('leaderboard');
    return await this.studentService.getLeaderboard();
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneStudent(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.findOneStudent(id);
  }
}
