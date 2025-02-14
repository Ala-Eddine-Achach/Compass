import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CreateTeacherDto } from '../user/teacher/dto/create-teacher.dto';
import { CreateStudentDto } from '../user/student/dto/create-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from "@nestjs/swagger";
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<Partial<User>> {
    return await this.authService.registerAdmin(userData);
  }

  @Post('student')
  @UseGuards(JwtAuthGuard)
  async registerStudent(
    @Body() userData: CreateStudentDto,
  ): Promise<Partial<User>> {
    return await this.authService.registerStudent(userData);
  }

  @Post('teacher')
  @UseGuards(JwtAuthGuard)
  async registerTeacher(
    @Body() userData: CreateTeacherDto,
  ): Promise<Partial<User>> {
    return await this.authService.registerTeacher(userData);
  }

  @Post('students')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async registerStudents(@UploadedFile() file: Express.Multer.File) {
    return await this.authService.registerStudents(file);
  }

  @Post('teachers')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async registerTeachers(@UploadedFile() file: Express.Multer.File) {
    return await this.authService.registerTeachers(file);
  }

  @Post('login')
  async login(@Body() credentials: LoginCredentialsDto) {
    console.log('credentials :', credentials);
    return await this.authService.login(credentials);
  }
}
